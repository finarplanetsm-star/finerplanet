"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiClient } from "@/api/lib/lib/apiClient"
import { ErrorMessage, Field, Form, Formik } from "formik"
import * as Yup from "yup"

// 1. Validation Schema matching your User Collection requirements
const SignupSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password too short")
    .required("Password is required"),
  fullName: Yup.string().required("Full Name is required for citations"),
  affiliation: Yup.string(),
  orcidId: Yup.string().matches(
    /^(\d{4}-){3}\d{3}[\dX]$/,
    "Invalid orcidId format (0000-0000-0000-0000)"
  ),
  scopusId: Yup.string().matches(/^\d+$/, "Scopus ID must be numbers only"),
  personalWebsite: Yup.string().url("Must be a valid URL"),
})

const SignupPage = () => {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const handleSignup = async (values: any, { setSubmitting }: any) => {
    setServerError(null)
    console.log(values)

    try {
      // 2. Call Strapi Registration Endpoint
      const res = await apiClient.post("/auth/local/register", values)

      // 3. Store Token & User Data
      localStorage.setItem("token", res.data.jwt)
      localStorage.setItem("user", JSON.stringify(res.data.user))

      // 4. Redirect to Home or previous page
      router.push("/")
    } catch (error: any) {
      console.error("Registration Error:", error)
      const message =
        error.response?.data?.error?.message || "Registration failed"
      setServerError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Researcher Registration
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create an academic profile to participate in discussions.
          </p>
        </div>

        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            fullName: "",
            affiliation: "",
            orcidId: "",
            scopusId: "",
            personalWebsite: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={handleSignup}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-4">
              {/* --- Core Credentials --- */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username
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
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
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
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Field
                    name="password"
                    type="password"
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>

              <hr className="border-gray-200 my-4" />

              {/* --- Academic Profile --- */}
              <h3 className="text-lg font-medium text-gray-900">
                Academic Profile
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name (Last, First)
                </label>
                <Field
                  name="fullName"
                  placeholder="Mithas, Sunil"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <ErrorMessage
                  name="fullName"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Affiliation (University/Inst)
                </label>
                <Field
                  name="affiliation"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ORCID ID
                  </label>
                  <Field
                    name="orcidId"
                    placeholder="0000-0000-0000-0000"
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <ErrorMessage
                    name="orcidId"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Scopus ID
                  </label>
                  <Field
                    name="scopusId"
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <ErrorMessage
                    name="scopusId"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>

              {/* 👇 ADDED MISSING FIELD HERE 👇 */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
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
              {/* 👆 ADDED MISSING FIELD HERE 👆 */}

              {serverError && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                  {serverError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#3B3098] hover:bg-[#2a226b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? "Creating Profile..." : "Register"}
              </button>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Log in
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default SignupPage
