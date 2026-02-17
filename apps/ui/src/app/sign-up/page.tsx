"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiClient } from "@/api/lib/lib/apiClient"
import { getAllUniversities } from "@/api/services/articles.service"
import { ErrorMessage, Field, Form, Formik } from "formik"
import * as Yup from "yup"

import type { Article } from "@/api/services/articlesCache"

// 1. Validation Schema - UPDATED with separate firstName/lastName
const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&#]/,
      "Password must contain at least one special character (@$!%*?&#)"
    )
    .test(
      "no-repeated-chars",
      "Password cannot have more than 2 consecutive identical characters (e.g., aaa, 111)",
      (value) => {
        if (!value) return true
        return !/(.)\1{2,}/.test(value)
      }
    )
    .required("Password is required"),
  // ✅ NEW: Separate firstName and lastName validation
  firstName: Yup.string()
    .required("First Name is required")
    .matches(/^[a-zA-Z]+$/, "First Name can only contain letters")
    .min(2, "First Name must be at least 2 characters")
    .max(50, "First Name cannot exceed 50 characters"),
  lastName: Yup.string()
    .required("Last Name is required")
    .matches(/^[a-zA-Z]+$/, "Last Name can only contain letters")
    .min(2, "Last Name must be at least 2 characters")
    .max(50, "Last Name cannot exceed 50 characters"),
  affiliation: Yup.string(),
  orcidId: Yup.string()
    .matches(
      /^(\d{4}-){3}\d{3}[\dX]$/,
      "Invalid ORCID format (e.g., 0000-0002-1825-0097)"
    )
    .nullable()
    .notRequired(),
  scopusId: Yup.string()
    .matches(/^\d{10,11}$/, "Scopus ID must be 10-11 digits")
    .nullable()
    .notRequired(),
  personalWebsite: Yup.string()
    .url("Must be a valid URL")
    .nullable()
    .notRequired(),
  universityWebsite: Yup.string()
    .url("Must be a valid URL")
    .nullable()
    .notRequired(),
})

const formatOrcid = (value: string) => {
  const cleanVal = value.replace(/[^0-9X]/gi, "")
  const formatted = cleanVal.match(/.{1,4}/g)?.join("-") || ""
  return formatted.substr(0, 19)
}

const formatScopusId = (value: string) => {
  const cleanVal = value.replace(/[^0-9]/g, "")
  return cleanVal.substr(0, 11)
}

const SignupPage = () => {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [universities, setUniversities] = useState<string[]>([])
  const [filteredUniversities, setFilteredUniversities] = useState<string[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [affiliationInput, setAffiliationInput] = useState("")
  const [loadingUniversities, setLoadingUniversities] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch universities on mount
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        console.log("📥 Loading universities from static data...")

        // Fetch the static JSON file from the public folder
        const res = await fetch("/articles-db.json")
        if (!res.ok) throw new Error("Failed to load article data")

        const articles: Article[] = await res.json()
        console.log("Articles loaded:", articles.length)
        console.log("Sample article:", articles[0])

        const allUniversities = getAllUniversities(articles)
        console.log("Total universities extracted:", allUniversities.length)
        console.log("First 10 universities:", allUniversities.slice(0, 10))
        setUniversities(allUniversities)
      } catch (error) {
        console.error("Failed to fetch universities:", error)
      } finally {
        setLoadingUniversities(false)
      }
    }
    fetchUniversities()
  }, [])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Filter universities based on input
  const handleAffiliationChange = (value: string, setFieldValue: any) => {
    setAffiliationInput(value)
    setFieldValue("affiliation", value)

    if (value.trim().length > 0) {
      console.log("Searching for:", value)
      console.log("Total universities available:", universities.length)
      const filtered = universities.filter((uni) =>
        uni.toLowerCase().includes(value.toLowerCase())
      )
      console.log("Filtered universities:", filtered.length)
      console.log("Filtered results:", filtered.slice(0, 10))
      setFilteredUniversities(filtered.slice(0, 10)) // Limit to 10 results
      setShowDropdown(true)
    } else {
      setFilteredUniversities([])
      setShowDropdown(false)
    }
  }

  const handleUniversitySelect = (university: string, setFieldValue: any) => {
    setAffiliationInput(university)
    setFieldValue("affiliation", university)
    setShowDropdown(false)
  }

  const handleSignup = async (values: any, { setSubmitting }: any) => {
    setServerError(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    try {
      // ✅ Combine firstName + lastName for backend
      const submitValues = {
        ...values,
        fullName: `${values.lastName} ${values.firstName}`, // "Doe John"
      }

      const res = await apiClient.post("/auth/local/register", submitValues)
      localStorage.setItem("token", res.data.jwt)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      router.push("/blogs")
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Registration failed"
      setServerError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F6EC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-6 text-center font-Forma-DJR-700 text-3xl text-gray-900">
            Researcher Registration
          </h2>
          <p className="mt-2 text-center font-Segoe-400 text-sm text-gray-600">
            Create an academic profile to participate in discussions.
          </p>
        </div>

        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            // ✅ UPDATED: Separate firstName and lastName fields
            firstName: "",
            lastName: "",
            affiliation: "",
            orcidId: "",
            scopusId: "",
            personalWebsite: "",
            universityWebsite: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={handleSignup}
        >
          {({ isSubmitting, setFieldValue }) => {
            // Sync affiliationInput with form value on mount
            useEffect(() => {
              setAffiliationInput("")
            }, [])

            return (
              <Form className="mt-8 space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-Segoe-600 text-gray-700">
                      Username *
                    </label>
                    <Field
                      name="username"
                      type="text"
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-Segoe-600 text-gray-700">
                      Email Address *
                    </label>
                    <Field
                      name="email"
                      type="email"
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-Segoe-600 text-gray-700">
                      Password *
                    </label>
                    <div className="relative">
                      <Field
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="appearance-none rounded-md relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        {showPassword ? (
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                </div>

                <hr className="border-gray-300 my-6 shadow" />

                {/* UPDATED: Section Header remains font-Segoe-600 */}
                <h3 className="text-lg font-Segoe-600 text-center text-gray-900">
                  Academic Profile
                </h3>

                {/* ✅ NEW: Separate Last Name and First Name fields in 2-column layout */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-Segoe-600 text-gray-700">
                      First Name *
                    </label>
                    <Field
                      name="firstName"
                      placeholder="John"
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-Segoe-600 text-gray-700">
                      Last Name *
                    </label>
                    <Field
                      name="lastName"
                      placeholder="Doe"
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-Segoe-600 text-gray-700">
                    Affiliation (University/Inst)
                    {loadingUniversities && (
                      <span className="text-xs text-gray-500">
                        (Loading...)
                      </span>
                    )}
                  </label>
                  <div className="relative" ref={dropdownRef}>
                    <Field name="affiliation">
                      {({ form }: any) => (
                        <input
                          name="affiliation"
                          type="text"
                          value={affiliationInput}
                          onChange={(e) =>
                            handleAffiliationChange(
                              e.target.value,
                              form.setFieldValue
                            )
                          }
                          onFocus={() => {
                            if (affiliationInput.trim().length > 0) {
                              const filtered = universities.filter((uni) =>
                                uni
                                  .toLowerCase()
                                  .includes(affiliationInput.toLowerCase())
                              )
                              setFilteredUniversities(filtered.slice(0, 10))
                              setShowDropdown(true)
                            }
                          }}
                          className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder={
                            loadingUniversities
                              ? "Loading universities..."
                              : "Start typing to search..."
                          }
                          autoComplete="off"
                          disabled={loadingUniversities}
                        />
                      )}
                    </Field>
                    {showDropdown &&
                      (filteredUniversities.length > 0 ||
                        affiliationInput.trim().length > 0) && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {loadingUniversities ? (
                            <div className="px-3 py-2 text-sm text-gray-500 italic">
                              Loading universities...
                            </div>
                          ) : (
                            <>
                              {filteredUniversities.map((uni, index) => (
                                <Field name="affiliation" key={index}>
                                  {({ form }: any) => (
                                    <div
                                      className="px-3 py-2 hover:bg-indigo-50 cursor-pointer text-sm text-gray-700 transition-colors"
                                      onClick={() =>
                                        handleUniversitySelect(
                                          uni,
                                          form.setFieldValue
                                        )
                                      }
                                    >
                                      {uni}
                                    </div>
                                  )}
                                </Field>
                              ))}
                              {filteredUniversities.length === 0 &&
                                affiliationInput.trim().length > 0 && (
                                  <Field name="affiliation">
                                    {({ form }: any) => (
                                      <div
                                        className="px-3 py-2 hover:bg-indigo-50 cursor-pointer text-sm text-gray-700 transition-colors"
                                        onClick={() =>
                                          handleUniversitySelect(
                                            affiliationInput,
                                            form.setFieldValue
                                          )
                                        }
                                      >
                                        {affiliationInput}, Other (Not listed)
                                      </div>
                                    )}
                                  </Field>
                                )}
                            </>
                          )}
                        </div>
                      )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-Segoe-600 text-gray-700">
                      ORCID ID
                    </label>
                    <Field name="orcidId">
                      {({ field, form }: any) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="0000-0000-0000-0000"
                          maxLength={19}
                          className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          onChange={(e) => {
                            const formatted = formatOrcid(e.target.value)
                            form.setFieldValue("orcidId", formatted)
                          }}
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="orcidId"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-Segoe-600 text-gray-700">
                      Scopus ID
                    </label>
                    <Field name="scopusId">
                      {({ field, form }: any) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="12345678901"
                          maxLength={11}
                          className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          onChange={(e) => {
                            const formatted = formatScopusId(e.target.value)
                            form.setFieldValue("scopusId", formatted)
                          }}
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="scopusId"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-Segoe-600 text-gray-700">
                      Personal Website
                    </label>
                    <Field
                      name="personalWebsite"
                      placeholder="https://..."
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <ErrorMessage
                      name="personalWebsite"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-Segoe-600 text-gray-700">
                      University Website
                    </label>
                    <Field
                      name="universityWebsite"
                      placeholder="https://..."
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <ErrorMessage
                      name="universityWebsite"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                </div>

                {serverError && (
                  <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded font-Segoe-600">
                    {serverError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center py-2 px-4 border cursor-pointer border-transparent text-sm font-Segoe-600 rounded-md text-white bg-[#2F7664] hover:bg-[#1D4B40] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSubmitting ? "Creating Profile..." : "Register"}
                </button>

                <div className="text-center text-sm font-Segoe-400">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-indigo-600 hover:text-indigo-500 cursor-pointer font-Segoe-600"
                  >
                    Log in
                  </Link>
                </div>
              </Form>
            )
          }}
        </Formik>
      </div>
    </div>
  )
}

export default SignupPage
