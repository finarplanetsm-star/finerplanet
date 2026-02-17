import { notFound } from "next/navigation"
import { apiClient } from "@/api/lib/lib/apiClient" // Update path to matches your project

import { BlogMarkdown } from "@/utils/Markdown"

// Define the shape of your data
interface MethodologyData {
  Title: string
  Introduction: string
  table_1_data: Array<{
    name: string
    abbr: string
    disc: string
    utd: string
    ft: string
  }>
  table_1_note: string
  table_2_data: Array<{ abbr: string; full: string }>
  disclaimer_text: string
  issue_form_url: string
  references: string
}

// 1. Make the component async (Server Component)
export default async function Methodology() {
  let data: MethodologyData | null = null

  try {
    // 2. Fetch directly on the server
    // loading.tsx will show while this await is pending
    const response = await apiClient.get("methodology")

    // Validate that we actually got data (Strapi sometimes returns null data for single types if unpublished)
    if (!response.data || !response.data.data) {
      notFound()
    }

    data = response.data.data
  } catch (error: any) {
    // If the API returns a 404, trigger the Next.js not-found page
    if (error.response?.status === 404) {
      notFound()
    }
    // Handle other errors (optional: trigger error.tsx or log it)
    console.error("Error fetching methodology:", error)
    throw error // This triggers error.tsx if you have one
  }

  // Double check in case data is still null
  if (!data) {
    notFound()
  }

  return (
    <div className="bg-[#FDF9F0] text-[#253430] font-sans py-12 md:py-20">
      {/* Inline Scroller Styles - Works fine in Server Components */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-table-scroller::-webkit-scrollbar { height: 10px; }
        .custom-table-scroller::-webkit-scrollbar-track { background: #D4EAE4; border-radius: 50px; }
        .custom-table-scroller::-webkit-scrollbar-thumb { background: #3A6B5E; border-radius: 50px; border: 2px solid transparent; background-clip: content-box; }
        .custom-table-scroller::-webkit-scrollbar-thumb:hover { background: #2D5248; background-clip: content-box; }
      `,
        }}
      />

      <div className="mx-auto px-[16px] md:px-10">
        <h2 className="text-center methodology-header-main-mobile md:methodology-header-main-desktop tracking-[0.7px] md:tracking-[2px] mb-7 md:uppercase">
          {data.Title}
        </h2>

        <div className="space-y-4 opacity-90 methodology-body-mobile md:methodology-body-desktop">
          <div className="prose prose-p:mb-4 prose-li:list-disc prose-ul:ml-6 max-w-none text-inherit">
            <BlogMarkdown content={data.Introduction} />
          </div>

          {/* Table 1 */}
          <div className="pt-4">
            <h3 className="mb-4 methodology-header-mobile md:methodology-header-desktop">
              Table 1. Mapping Top 51 Business Journals with Disciplinary Areas
            </h3>
            <div className="overflow-x-auto rounded-t-lg shadow-sm mb-4 custom-table-scroller">
              <table className="w-full text-left border-collapse bg-white">
                <thead className="bg-[#1F3936] text-white table-head-mobile md:font-Forma-DJR-400 md:text-mobile-h4-size">
                  <tr>
                    <th className="p-2 md:p-4">Journal Name</th>
                    <th className="p-2 md:p-4">Journal Abbreviation</th>
                    <th className="p-2 md:p-4">Discipline Abbreviation</th>
                    <th className="p-2 md:p-4">UTD 24</th>
                    <th className="p-2 md:p-4">FT 50</th>
                  </tr>
                </thead>
                <tbody className="text-[#4A5568] table-body-mobile md:table-body-desktop divide-y divide-gray-200">
                  {data.table_1_data?.map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-2 md:p-4 border-r border-gray-100">
                        {row.name}
                      </td>
                      <td className="p-2 md:p-4 border-r border-gray-100">
                        {row.abbr}
                      </td>
                      <td className="p-2 md:p-4 border-r border-gray-100">
                        {row.disc}
                      </td>
                      <td className="p-2 md:p-4 border-r border-gray-100">
                        {row.utd}
                      </td>
                      <td className="p-2 md:p-4">{row.ft}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[15px] text-gray-600 italic mb-6">
              {data.table_1_note}
            </p>
          </div>

          {/* Table 2 */}
          <div className="pt-2">
            <h3 className="mb-4 methodology-header-mobile md:methodology-header-desktop">
              Table 2. Discipline Abbreviations with Full Names
            </h3>
            <div className="overflow-x-auto rounded-lg custom-table-scroller">
              <table className="w-full text-left border-collapse bg-white border border-gray-200">
                <thead className="bg-[#1F3936] text-white table-head-mobile md:font-Forma-DJR-400 md:text-mobile-h4-size">
                  <tr>
                    <th className="p-2 md:p-4">Discipline Abbreviation</th>
                    <th className="p-2 md:p-4">Discipline Full Name</th>
                  </tr>
                </thead>
                <tbody className="text-[#4A5568] table-body-mobile md:table-body-desktop divide-y divide-gray-200">
                  {data.table_2_data?.map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-2 md:p-4 border-r border-gray-100 font-medium">
                        {row.abbr}
                      </td>
                      <td className="p-2 md:p-4">{row.full}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="mb-2 methodology-header-mobile md:methodology-header-desktop">
              Disclaimers
            </h3>
            <div className="opacity-90 methodology-body-mobile md:methodology-body-desktop">
              <BlogMarkdown content={data.disclaimer_text} />
            </div>
            <a
              href={data.issue_form_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2F7664] hover:scale-105 transition-transform duration-300 ease-in-out underline mt-1 inline-block font-medium"
            >
              Report an issue form
            </a>
          </div>

          {/* References */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="mb-4 methodology-header-mobile md:methodology-header-desktop">
              References
            </h3>
            <div className="space-y-3 opacity-80 methodology-body-mobile md:methodology-body-desktop">
              <BlogMarkdown
                content={data.references}
                components={{
                  // Override 'a' tag to match your design (inherit color, not blue)
                  a: (props) => (
                    <a
                      {...props}
                      className="hover:underline text-inherit font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                  // Optional: Reduce paragraph spacing for references if 'mt-5' is too big
                  p: (props) => (
                    <p
                      {...props}
                      className="mb-3 text-[0.9rem] md:text-[1rem]"
                    />
                  ),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
