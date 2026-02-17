// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { apiClient } from "@/api/lib/lib/apiClient"
// import { ErrorMessage, Field, Form, Formik } from "formik"
// import * as Yup from "yup"

// // --- 1. Validation Schema (Matches your Google Form logic) ---
// const CommentSchema = Yup.object().shape({
//   topic: Yup.string().required("Topic is required"),
//   discipline: Yup.string().required("Discipline is required"),
//   content: Yup.string().trim().required("Comment is required"),
//   referenceUrl: Yup.string().url("Must be a valid URL"),
//   citations: Yup.string(),
// })

// // --- 2. TypeScript Interfaces ---
// type FormValues = {
//   topic: string
//   discipline: string
//   content: string
//   referenceUrl: string
//   citations: string
// }

// type CommentType = {
//   id: number
//   content: string
//   topic: string
//   discipline: string
//   commentApprovalStatus: string
//   referenceUrl: string
//   user: {
//     username: string
//     fullName?: string
//     affiliation?: string
//   }
// }

// type CommentSectionProps = {
//   blogId: string | number
// }

// const CommentSection = ({ blogId }: CommentSectionProps) => {
//   const router = useRouter()
//   const [comments, setComments] = useState<CommentType[]>([])
//   const [isLoggedIn, setIsLoggedIn] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)

//   // --- 3. Authentication & Data Fetching ---
//   useEffect(() => {
//     const checkAuthAndFetch = async () => {
//       // Check token in localStorage
//       const token = localStorage.getItem("token")

//       if (!token) {
//         setIsLoggedIn(false)
//         setIsLoading(false)
//         return
//       }

//       setIsLoggedIn(true)

//       try {
//         const res = await apiClient.get(
//           `/comments?populate=user&filters[blog][documentId][$eq]=${blogId}&filters[commentApprovalStatus][$eq]=Approved`
//         )
//         setComments(res.data.data || [])
//         console.log(res.data.data)
//       } catch (error) {
//         console.error("Error fetching comments:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     checkAuthAndFetch()
//   }, [blogId])

//   // --- 4. Submission Handler ---
//   const handleSubmit = async (
//     values: FormValues,
//     { resetForm, setStatus }: any
//   ) => {
//     try {
//       await apiClient.post("/comments", {
//         data: {
//           ...values,
//           blog: blogId,
//           commentApprovalStatus: "Pending",
//         },
//       })

//       resetForm()
//       setStatus({
//         success:
//           "Correction submitted successfully! It is pending moderator approval.",
//       })

//       // Optional: Scroll to success message
//       window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
//     } catch (error) {
//       console.error("Error posting comment:", error)
//       setStatus({ error: "Failed to submit. Please try again later." })
//     }
//   }

//   if (isLoading)
//     return (
//       <div className="p-10 text-center">Loading academic discussion...</div>
//     )

//   // --- 5. STATE: Gated Content (Not Logged In) ---
//   if (!isLoggedIn) {
//     return (
//       <div className="max-w-4xl mx-auto mt-12 p-8 bg-gray-50 border border-gray-200 rounded-lg text-center shadow-sm">
//         <h3 className="text-2xl font-bold text-[#3B3098] mb-3">
//           Join the Discussion
//         </h3>
//         <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
//           To maintain the integrity of our data, comments and corrections are
//           visible only to registered users. Please log in to view peer critiques
//           or submit a methodology correction.
//         </p>
//         <button
//           onClick={() => router.push("/login")}
//           className="bg-[#3B3098] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#2a226b] transition-all shadow-md hover:shadow-lg cursor-pointer"
//         >
//           Login
//         </button>
//       </div>
//     )
//   }

//   // --- 6. STATE: Authenticated View ---
//   return (
//     <div className="max-w-4xl mx-auto mt-10 px-4 md:px-0">
//       <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
//         Comments
//       </h2>

//       {/* --- Display Approved Comments --- */}
//       <div className="space-y-6 mb-12">
//         {comments.length > 0 ? (
//           comments.map((c) => (
//             <div
//               key={c.id}
//               className="bg-white border border-gray-200 p-6 rounded-lg"
//             >
//               <div className="flex justify-between items-start mb-3">
//                 <div>
//                   <span className="font-bold text-[#3B3098] text-lg">
//                     {c.user?.fullName || c.user?.username || "Researcher"}
//                   </span>
//                   {c.user?.affiliation && (
//                     <span className="text-sm text-gray-500 block">
//                       {c.user.affiliation}
//                     </span>
//                   )}
//                 </div>
//                 {/* <div className="flex flex-col items-end gap-1">
//                   <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
//                     {c.topic}
//                   </span>
//                   <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
//                     {c.discipline}
//                   </span>
//                 </div> */}
//               </div>

//               <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
//                 {c.content}
//               </div>

//               {c.referenceUrl && (
//                 <div className="mt-3 pt-3 border-t border-gray-100">
//                   <span className="text-xs font-bold text-gray-500 uppercase mr-2">
//                     Reference:
//                   </span>
//                   <a
//                     href={c.referenceUrl}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="text-blue-600 hover:underline text-sm truncate"
//                   >
//                     {c.referenceUrl}
//                   </a>
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <div className="p-8 bg-gray-50 rounded-lg text-center italic text-gray-500 border border-dashed border-gray-300">
//             No approved corrections yet. If you found a data error, please
//             submit it below.
//           </div>
//         )}
//       </div>

//       {/* --- Submission Form --- */}
//       <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200">
//         <h3 className="text-xl font-bold text-gray-800 mb-6">
//           Submit a Comment
//         </h3>

//         <Formik
//           initialValues={{
//             topic: "Methodology",
//             discipline: "Information Systems",
//             content: "",
//             referenceUrl: "",
//             citations: "",
//           }}
//           validationSchema={CommentSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting, status }) => (
//             <Form className="space-y-5">
//               {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <div>
//                   <label className="block text-sm font-bold text-gray-700 mb-2">
//                     Topic(Please let us know general topic of your feedback or
//                     comment.)
//                   </label>
//                   <Field
//                     as="select"
//                     name="topic"
//                     className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3B3098] focus:border-transparent bg-white"
//                   >
//                     <option value="Methodology">Methodology</option>
//                     <option value="Data Error">Data Error</option>
//                     <option value="Author Analysis">Author Analysis</option>
//                     <option value="Journal Analysis">Journal Analysis</option>
//                     <option value="Suggestions">Suggestions</option>
//                     <option value="Other">Other</option>
//                   </Field>
//                   <ErrorMessage
//                     name="topic"
//                     component="div"
//                     className="text-red-500 text-sm mt-1"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-bold text-gray-700 mb-2">
//                     Discipline(If your comment pertains to a specific discipline
//                     then please indicate the name of the discipline. )
//                   </label>
//                   <Field
//                     as="select"
//                     name="discipline"
//                     className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3B3098] focus:border-transparent bg-white"
//                   >
//                     <option value="Information Systems">
//                       Information Systems
//                     </option>
//                     <option value="Accounting">Accounting</option>
//                     <option value="Finance">Finance</option>
//                     <option value="Marketing">Marketing</option>
//                     <option value="Economics">Economics</option>
//                     <option value="Management">Management</option>
//                     <option value="Operations Management">
//                       Operations Management
//                     </option>
//                   </Field>
//                   <ErrorMessage
//                     name="discipline"
//                     component="div"
//                     className="text-red-500 text-sm mt-1"
//                   />
//                 </div>
//               </div> */}

//               <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-2">
//                   Comment
//                 </label>
//                 <Field
//                   as="textarea"
//                   name="content"
//                   rows={5}
//                   placeholder="Please provide specific details about the error or suggestion..."
//                   className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3B3098] focus:border-transparent"
//                 />
//                 <ErrorMessage
//                   name="content"
//                   component="div"
//                   className="text-red-500 text-sm mt-1"
//                 />
//               </div>

//               {/* <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-2">
//                   Citations (Complete citations of your papers in UTD24/FT50
//                   journals in APA format so that we can cross-check with our
//                   records and correct appropriately if any records are
//                   misclassified or missing in the original dataset)
//                   <span className="font-normal text-gray-400">- Optional</span>
//                 </label>
//                 <Field
//                   as="textarea"
//                   name="citations"
//                   rows={2}
//                   placeholder="E.g., Mithas, S. (2025)..."
//                   className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3B3098] focus:border-transparent"
//                 />
//               </div> */}

//               {/* <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-2">
//                   Any further details, information or url that can help us to
//                   better understand your comments or suggestions for corrections{" "}
//                   <span className="font-normal text-gray-400">- Optional</span>
//                 </label>
//                 <Field
//                   type="url"
//                   name="referenceUrl"
//                   placeholder="https://..."
//                   className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3B3098] focus:border-transparent"
//                 />
//                 <ErrorMessage
//                   name="referenceUrl"
//                   component="div"
//                   className="text-red-500 text-sm mt-1"
//                 />
//               </div> */}

//               <div className="pt-2">
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="w-full md:w-auto bg-[#3A6E63] text-white px-8 py-3 rounded-[9px] font-bold hover:bg-[#3A6E63] disabled:opacity-50 transition-all shadow-md cursor-pointer"
//                 >
//                   {isSubmitting ? "Submitting..." : "Submit for Review"}
//                 </button>
//               </div>

//               {status?.success && (
//                 <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-md">
//                   ✅ {status.success}
//                 </div>
//               )}
//               {status?.error && (
//                 <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-md">
//                   ❌ {status.error}
//                 </div>
//               )}
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   )
// }

// export default CommentSection

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/api/lib/lib/apiClient"
import { ErrorMessage, Field, Form, Formik } from "formik"
import * as Yup from "yup"

// --- 1. Validation Schema ---
const CommentSchema = Yup.object().shape({
  topic: Yup.string().required("Topic is required"),
  discipline: Yup.string().required("Discipline is required"),
  content: Yup.string().trim().required("Comment is required"),
  referenceUrl: Yup.string().url("Must be a valid URL"),
  citations: Yup.string(),
})

// --- 2. TypeScript Interfaces ---
type FormValues = {
  topic: string
  discipline: string
  content: string
  referenceUrl: string
  citations: string
}

type CommentType = {
  id: number
  content: string
  topic: string
  discipline: string
  commentApprovalStatus: string
  referenceUrl: string
  user: {
    username: string
    fullName?: string
    affiliation?: string
  }
}

type CommentSectionProps = {
  blogId: string | number
}

const CommentSection = ({ blogId }: CommentSectionProps) => {
  const router = useRouter()
  const [comments, setComments] = useState<CommentType[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // --- 3. Authentication & Data Fetching ---
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        setIsLoggedIn(false)
        setIsLoading(false)
        return
      }

      setIsLoggedIn(true)

      try {
        const res = await apiClient.get(
          `/comments?populate=user&filters[blog][documentId][$eq]=${blogId}&filters[commentApprovalStatus][$eq]=Approved`
        )
        setComments(res.data.data || [])
        console.log(res.data.data)
      } catch (error) {
        console.error("Error fetching comments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndFetch()
  }, [blogId])

  // --- 4. Submission Handler ---
  const handleSubmit = async (
    values: FormValues,
    { resetForm, setStatus }: any
  ) => {
    try {
      await apiClient.post("/comments", {
        data: {
          ...values,
          blog: blogId,
          commentApprovalStatus: "Pending",
        },
      })

      resetForm()
      setStatus({
        success:
          "Comment submitted successfully! It is pending admin approval.",
      })
    } catch (error) {
      console.error("Error posting comment:", error)
      setStatus({ error: "Failed to submit. Please try again later." })
    }
  }

  if (isLoading)
    return (
      <div className="p-10 text-center text-[#253430]">
        Loading academic discussion...
      </div>
    )

  // --- 5. STATE: Gated Content (Not Logged In) ---
  if (!isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto mt-12 p-8 bg-[#F5F0E8] border border-[#E5E7EB] rounded-lg text-center">
        <h3 className="typo-desktop-h3 text-[#253430] mb-3">
          Join the Discussion
        </h3>
        <p className="text-[14px] md:typo-desktop-body-md text-[#44525D] mb-6 max-w-2xl mx-auto leading-normal">
          To maintain the integrity of our data, comments and corrections are
          visible only to registered users. Please log in to view peer critiques
          or submit a methodology correction.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="bg-[#3A6E63] text-white px-8 py-3 rounded-[9px] font-bold hover:bg-[#325e54] transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          Login
        </button>
      </div>
    )
  }

  // --- 6. STATE: Authenticated View ---
  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 md:px-0">
      <h2 className="typo-mobile-h3 md:typo-desktop-h2 text-[#253430] mb-8 border-b border-[#E5E7EB] pb-4">
        Comments
      </h2>

      {/* --- Display Approved Comments --- */}
      <div className="space-y-6 mb-12">
        {comments.length > 0 ? (
          comments.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-[#E5E7EB] p-6 rounded-lg"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="typo-desktop-body-md font-bold text-[#253430]">
                    {c.user?.fullName || c.user?.username || "Researcher"}
                  </span>
                </div>
              </div>

              <div className="text-[14px] md:typo-desktop-body-md text-[#253430] whitespace-pre-wrap leading-normal">
                {c.content}
              </div>

              {c.referenceUrl && (
                <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
                  <span className="text-[12px] font-semibold text-[#44525D] uppercase mr-2">
                    Reference:
                  </span>
                  <a
                    href={c.referenceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#2F7664] hover:underline text-[12px] md:text-[14px] truncate"
                  >
                    {c.referenceUrl}
                  </a>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 bg-[#F5F0E8] rounded-lg text-center italic text-[#44525D] text-[14px] md:typo-desktop-body-md border border-[#E5E7EB]">
            No approved corrections yet. If you found a data error, please
            submit it below.
          </div>
        )}
      </div>

      {/* --- Submission Form --- */}
      <div className="bg-white p-6 md:p-8 rounded-[12px] border border-[#E5E7EB]">
        <h3 className="typo-desktop-h4 text-[#253430] mb-6">
          Submit a Comment
        </h3>

        <Formik
          initialValues={{
            topic: "Methodology",
            discipline: "Information Systems",
            content: "",
            referenceUrl: "",
            citations: "",
          }}
          validationSchema={CommentSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form className="space-y-5">
              <div>
                <label className="block text-[14px] md:typo-desktop-body-md font-semibold text-[#253430] mb-2">
                  Comment
                </label>
                <Field
                  as="textarea"
                  name="content"
                  rows={5}
                  placeholder="Please provide specific details about the error or suggestion..."
                  className="w-full p-3 border border-[#E5E7EB] rounded-[8px] text-[14px] md:typo-desktop-body-md text-[#253430] placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-[#3A6E63] focus:border-transparent"
                />
                <ErrorMessage
                  name="content"
                  component="div"
                  className="text-red-500 text-[12px] md:text-[14px] mt-1"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto bg-[#3A6E63] text-white px-8 py-3 rounded-[9px] font-bold hover:bg-[#325e54] disabled:opacity-50 transition-all shadow-md cursor-pointer text-[14px] md:typo-desktop-body-md"
                >
                  {isSubmitting ? "Submitting..." : "Add a Review"}
                </button>
              </div>

              {status?.success && (
                <div className="p-4 bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] rounded-[8px] text-[14px]">
                  ✅ {status.success}
                </div>
              )}
              {status?.error && (
                <div className="p-4 bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2] rounded-[8px] text-[14px]">
                  ❌ {status.error}
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default CommentSection
