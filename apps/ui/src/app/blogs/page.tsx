import Image from "next/image"
import Link from "next/link"
import Searchbar from "@/_components/Searchbar"
import SimilarBlogsSection from "@/_components/SimilarBlogsSection"
import { getFeaturedBlogs } from "@/api/services/blogs.service"

import { FeaturedBlogLogo, MinuteRead } from "../../../public/blogsSvg/blog-svg"
import { PublishedTime } from "../../../public/common-svg"

function formatDateToLongFormat(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (error) {
    console.error("Error formatting date:", error)
    return dateString
  }
}

export default async function page() {
  const featuredBlogs = await getFeaturedBlogs()

  return (
    <div className="mb-3 mt-2 md:px-14 ">
      <div className="flex flex-col gap-4 md:p-10 lg:px-[30px] md:px-[50px]">
        <div className="px-4 md:px-0">
          <div className="flex flex-col md:flex-row md:gap-2 mt-5 md:items-center md:justify-between">
            <div className="flex gap-2 items-center">
              <FeaturedBlogLogo className="w-[18px] h-[15px] md:w-[21.6px] md:h-[19.6px]" />
              <h2 className="text-[14px] lg:text-[26px] blog-title">
                Featured Blog
              </h2>
            </div>
            <div className="w-full md:max-w-[400px] mt-3 md:mt-0">
              <Searchbar />
            </div>
          </div>
        </div>

        {featuredBlogs.length === 0 ? (
          <p>No featured blog available</p>
        ) : (
          featuredBlogs?.map((blog) => (
            <div
              key={blog.documentId}
              className="rounded-[14px] md:border px-0 md:border-[rgba(0,0,0,0.06)] flex flex-col xl:flex-row md:p-10 gap-5 "
              style={{
                backgroundImage: `url('/articleSvg/FeaturedBlogBgImg.svg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <Image
                src={blog?.thumbnail?.formats?.large?.url}
                alt="featured-img"
                width={695}
                height={637}
                className="w-full lg:w-[695px] h-auto lg:h-[637px] object-cover rounded-[14px]"
              />
              <div className="flex-1 flex flex-col gap-6 px-3">
                <div className="flex 2xl:gap-5 justify-start gap-5">
                  <p className="rounded-[8.514px] border-[1.261px] border-[#00A648] bg-white text-[#00A648] text-[10px] md:text-[13.2px] px-[6px] py-[2px] md:py-[3.216px] md:px-[9.838px] shrink-0">
                    {blog.tags.split(",")[1]}
                  </p>
                  <div className="flex items-center gap-2">
                    <PublishedTime />
                    <p className="text-[10px] blog-metadata md:text-[15px] whitespace-nowrap">
                      {/* ✅ FIXED: Format date from 2024-03-22 to March 22, 2024 */}
                      {formatDateToLongFormat(blog.date_of_publishing)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <MinuteRead />
                    <p className="text-[10px] blog-metadata md:text-[15px] whitespace-nowrap">
                      {blog.timeToRead} mins read
                    </p>
                  </div>
                </div>
                <h1 className="text-[#101828] text-[28px] md:text-[38px] lg:text-[28px] blog-title ">
                  {blog.title}
                </h1>
                <p className="blog-desc text-[14px] md:text-[22px] lg:text-[19px]">
                  {blog.description}
                </p>
                <div className="flex gap-3">
                  <Image
                    src="/featured-blogs-author-logo.svg"
                    alt="blogs-logo"
                    width={22}
                    height={22}
                  />
                  <div>
                    <p className="text-[#101828] font-semibold text-[14.66px] md:text-[17.5px]">
                      {blog.author}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/blogs/${encodeURIComponent(blog.title)}`}
                  role="button"
                  className="flex bg-[#2F7664] items-center justify-center cursor-pointer rounded-[11px] py-[8.072px] px-[13.244px] transform transition-all duration-300 ease-in-out hover:scale-105 h-[40px] w-[157px] md:w-[177px] gap-[8.8px] text-white text-[12px] md:text-[15.5px]"
                >
                  Read Blog →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      <SimilarBlogsSection />
    </div>
  )
}
