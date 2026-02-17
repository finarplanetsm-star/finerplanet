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
      const res = await apiClient.post("/auth/local", {
        identifier: values.identifier,
        password: values.password,
      })

      localStorage.setItem("token", res.data.jwt)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      router.push("/blogs")
    } catch (error: any) {
      console.error("Login Error:", error)
      const message = "Account not found"
      setServerError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F6EC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div>
          {/* Kept Forma for the Header */}
          <h2 className="mt-6 text-center text-3xl font-Forma-DJR-700 text-gray-900">
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
                  {/* Replaced font-medium with Segoe-600 */}
                  <label className="block text-sm font-Segoe-600 text-gray-700 mb-1">
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
                  {/* Replaced font-medium with Segoe-600 */}
                  <label className="block text-sm font-Segoe-600 text-gray-700 mb-1">
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
                <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded font-Segoe-600">
                  {serverError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-Segoe-600 rounded-md text-white bg-[#2F7664] hover:bg-[#1D4B40] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link
                  href="/sign-up"
                  className="text-indigo-600 hover:text-indigo-500 font-Segoe-600"
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
