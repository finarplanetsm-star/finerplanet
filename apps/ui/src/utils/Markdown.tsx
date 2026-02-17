import React from "react"
import ReactMarkdown, { Components } from "react-markdown"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"

// 1. We modify props to accept an optional 'components' override
export function BlogMarkdown({
  content,
  components,
}: {
  content: string
  components?: Components
}) {
  // 2. These are YOUR exact original styles
  const defaultComponents: Components = {
    h1: (props) => {
      const { children, ...rest } = props
      return (
        <h1
          className="blog-title md:text-[32.6px] lg:text-[36px] xl:text-[42px] 2xl:text-[48px] font-bold text-[26px] pt-2"
          {...rest}
        >
          {children ?? <span className="sr-only">Heading</span>}
        </h1>
      )
    },
    h2: (props) => {
      const { children, ...rest } = props
      return (
        <h2
          className="blog-title md:text-[29.6px] lg:text-[34px] xl:text-[39px] 2xl:text-[45px]  font-bold text-[23px] pt-2"
          {...rest}
        >
          {children ?? <span className="sr-only">Heading</span>}
        </h2>
      )
    },
    h3: (props) => {
      const { children, ...rest } = props
      return (
        <h3
          className="blog-title md:text-[26.6px] lg:text-[30px] xl:text-[36px] 2xl:text-[40px]  font-bold text-[19px] pt-2"
          {...rest}
        >
          {children ?? <span className="sr-only">Heading</span>}
        </h3>
      )
    },
    h4: (props) => {
      const { children, ...rest } = props
      return (
        <h4
          className="blog-title md:text-[24.6px] lg:text-[28px] xl:text-[34px] 2xl:text-[38px]  font-bold text-[17px] pt-2"
          {...rest}
        >
          {children ?? <span className="sr-only">Heading</span>}
        </h4>
      )
    },
    h5: (props) => {
      const { children, ...rest } = props
      return (
        <h5
          className="blog-title md:text-[22.6px] lg:text-[26px] xl:text-[32px] 2xl:text-[36px]  font-bold text-[15px] pt-2"
          {...rest}
        >
          {children ?? <span className="sr-only">Heading</span>}
        </h5>
      )
    },
    h6: (props) => {
      const { children, ...rest } = props
      return (
        <h6
          className="blog-title md:text-[26.6px] lg:text-[30px] xl:text-[36px] 2xl:text-[40px]  font-bold text-[19px] pt-2"
          {...rest}
        >
          {children ?? <span className="sr-only">Heading</span>}
        </h6>
      )
    },
    span: (props) => <span className="pt-2" {...props} />,
    p: (props) => (
      <p
        // EXACT match: 0.7rem mobile, 1rem md, 1.2rem xl
        className="flex-1 blog-content text-[0.7rem] md:text-[1rem] xl:text-[1.2rem] mt-5 wrap-break-word"
        {...props}
      />
    ),
    ul: (props) => (
      <ul
        className="mt-4 mb-4 pl-6 list-disc list-inside blog-description"
        {...props}
      />
    ),
    ol: (props) => (
      <ol
        className="mt-4 mb-4 pl-6 list-decimal list-inside blog-description"
        {...props}
      />
    ),
    li: (props) => <li className="mb-1 pl-1" {...props} />,
    table: (props) => (
      <div className="overflow-x-auto w-full my-6 rounded-3xl border bg-white border-[#EAEAEA]">
        <table
          className="w-full rounded-3xl border bg-white border-[#EAEAEA]"
          {...props}
        />
      </div>
    ),
    tr: (props) => <tr className="" {...props} />,
    thead: (props) => <thead className="bg-[#BF8B50]" {...props} />,
    th: (props) => (
      <th
        className="blog-subTitle text-start md:min-h-16 py-4 px-6 border-2 border-[#EAEBF0] text-white"
        {...props}
      />
    ),
    td: (props) => (
      <td
        className="blog-description text-start px-6 h-full md:min-h-18.5 py-3 border-2 border-[#EAEBF0] font-instrument-sans-500 text-[#5F6D7E]"
        {...props}
      />
    ),
    img: (props) => (
      <img
        className="blog-image w-full"
        alt={props.alt || ""}
        src={props.src || ""}
      />
    ),
    a: (props) => (
      <a
        className="text-blue-600 font-medium underline decoration-blue-400 underline-offset-4 hover:text-blue-800 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
  }

  return (
    <div className="w-full h-full">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        // Merge defaults with any overrides passed in props
        components={{ ...defaultComponents, ...components }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
