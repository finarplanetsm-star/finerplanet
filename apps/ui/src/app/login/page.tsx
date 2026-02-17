"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiClient } from "@/api/lib/lib/apiClient"
import { ErrorMessage, Field, Form, Formik } from "formik"
import * as Yup from "yup"

const LoginSchema = Yup.object().shape({
  identifier: Yup.string().required("Email or Username is required"),
  password: Yup.string().required("Password is required"),
})

const LoginPage = () => {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const handleLogin = async (values: any, { setSubmitting }: any) => {
    setServerError(null)

    try {
      // 1. Call Strapi Login Endpoint
      const res = await apiClient.post("/auth/local", {
        identifier: values.identifier,
        password: values.password,
      })

      // 2. Store Credentials
      localStorage.setItem("token", res.data.jwt)
      localStorage.setItem("user", JSON.stringify(res.data.user))

      // 3. Redirect (Go back or to home)
      router.back() // Tries to go back to the article page they were reading
      // Or: router.push("/")
    } catch (error: any) {
      console.error("Login Error:", error)
      const message =
        error.response?.data?.error?.message || "Invalid credentials"
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
            Researcher Login
          </h2>
        </div>

        <Formik
          initialValues={{ identifier: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div className="rounded-md shadow-sm -space-y-px p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email or Username
                  </label>
                  <Field
                    name="identifier"
                    type="text"
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <ErrorMessage
                    name="identifier"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                {isSubmitting ? "Logging in..." : "Sign in"}
              </button>

              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link
                  href="/sign-up"
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Register here
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default LoginPage
