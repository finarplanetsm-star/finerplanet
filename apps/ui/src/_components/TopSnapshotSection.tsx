import {
  getAuthorRankings,
  getUniversityRankings,
} from "@/api/services/articles.service"
import { useNav } from "@/context/NavContext"

import type { Article } from "@/api/services/articlesCache"

export type SnapshotRow = {
  name: string
  count: number
  rank: number
}

const formatAuthorName = (name: string) => {
  const [last, first] = name.split(",").map((s) => s.trim())
  return first && last ? `${first} ${last}` : name
}

export function SnapshotTable({
  title,
  rows,
}: {
  title: "University" | "Author"
  rows: SnapshotRow[]
}) {
  return (
    <div
      className="flex flex-col w-full bg-white rounded-[11px] border border-gray-300 font-body"
      style={{ clipPath: "inset(0 round 11px)" }}
    >
      <table className="w-full border-collapse table-fixed">
        <thead>
          <tr className="text-white">
            <th className="w-16 md:w-24 px-3 md:px-7 py-4 border-r border-gray-600 text-left font-normal sticky top-0 z-10 bg-[#253430] rounded-tl-[11px]">
              Rank
            </th>
            <th className="px-3 md:px-7 py-4 border-r border-gray-600 text-left font-normal sticky top-0 z-10 bg-[#253430]">
              {title}
            </th>
            <th className="w-20 md:w-32 px-3 md:px-7 py-4 text-left font-normal sticky top-0 z-10 bg-[#253430] rounded-tr-[11px]">
              Articles
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {rows.map((row, index) => (
            <tr key={row.name} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 md:px-7 py-4 text-[#364D48] border-r border-gray-300">
                {row.rank}
              </td>
              <td className="px-3 md:px-7 py-4 text-[#364D48] border-r border-gray-300">
                {title === "Author" ? formatAuthorName(row.name) : row.name}
              </td>
              <td className="px-3 md:px-7 py-4 text-[#364D48] text-left">
                {row.count}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function TopSnapshotSection({
  articles,
}: {
  articles: Article[]
}) {
  const universityData = getUniversityRankings(articles, {
    yearStart: "2022",
    yearEnd: "2024",
  })
  const authorData = getAuthorRankings(articles, {
    yearStart: "2022",
    yearEnd: "2024",
  })

  const { setActive } = useNav()

  return (
    <section className="w-full">
      <div className="w-full max-w-[1300px] mx-auto px-4 md:px-6 flex flex-col pt-12 md:pt-[78px] pb-12 md:pb-24">
        <h2 className="typo-mobile-body-md md:typo-desktop-h2 mb-8 text-left text-[#253430]">
          Top 10 Snapshot (2022–2024, 51 UTD/FT Business And Economic Journals)
        </h2>

        <div className="flex flex-col lg:flex-row gap-8 w-full justify-between lg:items-stretch">
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex-1">
              <SnapshotTable
                title="University"
                rows={universityData.slice(0, 10)}
              />
            </div>
            <button
              onClick={() => {
                setActive("UniversityRanking")
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }}
              className="flex cursor-pointer w-full justify-center items-center gap-[10px] px-6 py-3 rounded-[9px] bg-[#3A6E63] text-white typo-desktop-cta font-semibold hover:bg-[#325e54] transition-colors duration-150"
            >
              View All Universities
            </button>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <div className="flex-1">
              <SnapshotTable title="Author" rows={authorData.slice(0, 10)} />
            </div>
            <button
              onClick={() => {
                setActive("AuthorsRanking")
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }}
              className="flex cursor-pointer w-full justify-center items-center gap-[10px] px-6 py-3 rounded-[9px] bg-[#3A6E63] text-white typo-desktop-cta font-semibold hover:bg-[#325e54] transition-colors duration-150"
            >
              View All Authors
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
