import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import CommentSection from "@/_components/CommentSection"
import ShareAndDownloadButtons from "@/_components/ShareAndDownloadBtns"
import SimilarBlogsSection from "@/_components/SimilarBlogsSection"
import { searchBlogs } from "@/api/services/blogs.service"

import { BlogMarkdown } from "@/utils/Markdown"

import {
  ArrowRightUp,
  BackToHomeArrow,
} from "../../../../public/blogsSvg/blog-svg"

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params
  const blogs = await searchBlogs()

  const blogTitle = decodeURIComponent(resolvedParams.slug)

  const blog = blogs?.find((blog) => blog?.title === blogTitle)

  if (!blog) return notFound()

  const sortedLatestBlogs = blogs
    ?.filter((b) => b.documentId !== blog.documentId) // exclude current blog
    .sort(
      (a, b) =>
        new Date(b.date_of_publishing).getTime() -
        new Date(a.date_of_publishing).getTime()
    )

  const blogPdf = blog?.title?.split(" ")[0].toLowerCase()

  if (!blog) return notFound()

  return (
    <div className="md:p-10">
      <div className="lg:px-[50px] md:px-[50px] mt-9">
        <h1 className="text-[#101828] md:text-[32.6px] lg:text-[36px] xl:text-[42px] 2xl:text-[48px] font-Forma-DJR-700 text-[26px] mb-10 px-2.5 ">
          {blog.title}
        </h1>
        <p className="blog-desc text-[18px] md:text-[22px] lg:text-[25px] xl:text-[28px] 2xl:text-[34px] mb-3 px-2.5 ">
          {blog.description}
        </p>
        <p className=" mb-9 font-semibold px-2.5 text-[10px] md:text-[12px] lg:text-[15px] xl:text-[18px] 2xl:text-[20px] mt-7">
          <span className="text-[#101828]">By: </span> {blog.author}
        </p>
        <Image
          src={blog?.thumbnail?.url}
          width={1200}
          height={725}
          alt="blog-image"
          className="rounded-sm max-h-[674px]"
        />
        <div className="flex md:flex-row flex-col gap-14 md:mt-[100px] mt-2.5 px-2.5">
          <div className="flex flex-col gap-5">
            <BlogMarkdown content={blog?.content} />
            {/* <p className="flex-1 blog-content text-[0.4rem] md:text-[0.6rem] xl:text-[0.9rem] mt-5 wrap-break-word">
              {blog.content}
            </p> */}

            {/* Updated responsive wrapper for 320px/375px screens */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mt-10">
              {/* Share and Download - order-1 forces it above on mobile */}
              <div className="w-full md:w-auto order-1 md:order-2">
                <ShareAndDownloadButtons pdfUrl={`/blogpdfs/${blogPdf}.pdf`} />
              </div>

              {/* Back to home - order-2 forces it below on mobile */}
              <div className="flex flex gap-2 order-2 md:order-1 items-center">
                <BackToHomeArrow />
                <Link
                  href="/blogs"
                  className="text-[18px] md:text-[20px] text-[#1D2A49] font-medium whitespace-nowrap"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>

          <div className="flex-1 hidden xl:block xl:sticky xl:top-24 xl:self-start">
            <h1 className="latest-blogs text-[#1D2A49] text-[24px] md:text-[36px] xl:text-[42px] font-[500]">
              Latest Blogs
            </h1>
            {sortedLatestBlogs?.slice(0, 2).map((blog, index) => (
              <div
                key={index}
                className="rounded-[10px] p-2 md:p-5 mt-2 border md:h-[225px] md:w-[461px] border-[rgba(68,98,169,0.2)] shadow-[0_4px_20px_0_rgba(153,86,236,0.08)]"
              >
                <p className="latest-blogs font-[500] md:py-3 md:px-4 py-[9px] px-3 mb-3 text-[16px] text-left rounded-[12px] bg-[rgba(68,98,169,0.1)] inline-flex">
                  {blog.tags
                    ? (() => {
                        const tags = blog.tags
                          .split(",")
                          .map((tag) => tag.trim())
                        const filteredTags = tags.filter(
                          (tag) => tag.toLowerCase() !== "all"
                        )
                        return filteredTags.length > 0
                          ? filteredTags
                              .map(
                                (tag) =>
                                  tag.charAt(0).toUpperCase() +
                                  tag.slice(1).toLowerCase()
                              )
                              .join(", ")
                          : null
                      })()
                    : null}
                </p>

                <p className="latest-blogs text-[18px] md:text-[14px] font-[600]">
                  {blog.title}
                </p>
                <Link
                  href={`/blogs/${encodeURIComponent(blog.title)}`}
                  className="flex items-center gap-1.5 mt-2"
                >
                  <p className="latest-blogs-read-more md:text-[16px]  text-[12px]">
                    Read more
                  </p>
                  <ArrowRightUp />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <CommentSection blogId={blog.documentId} />{" "}
      <SimilarBlogsSection activeBlog={blog.documentId} />
    </div>
  )
}
