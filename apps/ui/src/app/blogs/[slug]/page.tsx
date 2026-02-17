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
      <div className="lg:px-[100px] md:px-[50px] mt-9">
        <h1 className="blog-title md:text-[32.6px] lg:text-[36px] xl:text-[42px] 2xl:text-[48px]  font-bold text-[26px] mb-10 px-2.5 ">
          {blog.title}
        </h1>
        <p className="blog-desc text-[18px] md:text-[22px] lg:text-[25px] xl:text-[28px] 2xl:text-[34px] mb-3 px-2.5 ">
          {blog.description}
        </p>
        <p className=" mb-9 font-semibold px-2.5 text-[10px] md:text-[12px] lg:text-[15px] xl:text-[18px] 2xl:text-[20px] mt-7">
          <span className="blog-title">By: </span> {blog.author}
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
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8 mt-6">
              {/* Back to home */}
              <div className="flex items-center gap-2 self-start md:self-auto">
                <BackToHomeArrow />
                <Link
                  href="/blogs"
                  className="text-[18px] md:text-[20px] text-[#1D2A49] font-medium"
                >
                  Back to Home
                </Link>
              </div>

              {/* Share and Download */}
              <div className="w-full md:w-auto">
                <ShareAndDownloadButtons pdfUrl={`/blogpdfs/${blogPdf}.pdf`} />
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
                <p className="latest-blogs font-[500] md:py-3 md:px-4 py-[9px] px-3 mb-3 text-[16px] text-left rounded-[sm bg-[rgba(68,98,169,0.1)] inline-flex">
                  {blog.title}
                </p>
                <p className="latest-blogs text-[18px] md:text-[14px] font-[600]">
                  {blog.description}
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
      <CommentSection blogId={blog.documentId} />
      <SimilarBlogsSection activeBlog={blog.documentId} />
    </div>
  )
}
