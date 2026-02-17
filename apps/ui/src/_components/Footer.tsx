"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useNav } from "@/context/NavContext"

import { LinkIcon } from "../../public/common-svg"

const footerLinks = {
  quickLinks: [
    {
      label: "Author Ranking",
      navKey: "AuthorsRanking",
      href: "/",
    },
    {
      label: "University Ranking",
      navKey: "UniversityRanking",
      href: "/",
    },
    { label: "Journals", navKey: "Journals", href: "/" },
    { label: "Methodology", navKey: "Methodology", href: "/methodology" },
    { label: "Blog", navKey: "Blogs", href: "/blogs" },
  ],
  searchBy: [
    { label: "Authors", navKey: "SearchByAuthor", href: "/" },
    { label: "Universities", navKey: "SearchByUniversity", href: "/" },
    { label: "Articles", navKey: "SearchByArticles", href: "/" },
  ],
}

export default function Footer() {
  const router = useRouter()
  const pathname = usePathname()
  const { setActive } = useNav()

  const externalPages = ["Methodology", "Blogs"]

  const handleFooterClick = (navKey: string, href: string) => {
    setActive(navKey)
    window.scrollTo({ top: 0, behavior: "smooth" })

    // Navigate to the href if we're not already on that page
    if (pathname !== href) {
      setTimeout(() => {
        router.push(href)
      }, 0)
    }
  }
  return (
    <footer className="w-full bg-[#D9FFEB] text-[#02463B]">
      <div className="max-w-[1311.29px] mx-auto px-6 py-10 flex flex-col gap-10">
        {/* Main Grid: 1 column on mobile, 12 columns on MD+ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* 1. Logo + description */}
          <div className="flex flex-col gap-4 md:col-span-4 lg:col-span-3">
            <Image
              src="/Adobe%20Express%20-%20file%202.svg"
              alt="Finerplanet"
              width={159}
              height={44.476}
              priority
            />
            <p className="text-[14px] md:typo-desktop-body-md leading-normal text-[#02463B] max-w-[280px]">
              The Research Rankings provide measures of research productivity
              and impact.
            </p>
          </div>

          {/* 2. Links Section (Divided into two headers) */}
          <div className="md:col-span-5 lg:col-span-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Quick Links Column */}
              <div className="flex flex-col gap-4">
                <h4 className="typo-mobile-h4 md:typo-desktop-h4">
                  Quick Links
                </h4>
                <nav className="flex flex-col gap-2 text-[14px] md:typo-desktop-body-md">
                  {footerLinks.quickLinks.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => handleFooterClick(link.navKey, link.href)}
                      className="hover:opacity-80 text-left cursor-pointer bg-transparent border-none p-0"
                    >
                      {link.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Search By Column */}
              <div className="flex flex-col gap-4">
                <h4 className="typo-mobile-h4 md:typo-desktop-h4">Search by</h4>
                <nav className="flex flex-col gap-2 text-[14px] md:typo-desktop-body-md">
                  {footerLinks.searchBy.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => handleFooterClick(link.navKey, link.href)}
                      className="hover:opacity-80 text-left cursor-pointer bg-transparent border-none p-0"
                    >
                      {link.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* 3. Social Section */}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.google.com/forms/d/e/1FAIpQLSfVwX7Yff1nSb0dIK75cT1vryZMCx2g-w1bnD1KkQ77sA9wWg/viewform?pli=1"
            className="md:col-span-3 flex items-center gap-2 cursor-pointer duration-300 ease-in-out"
          >
            <h2 className="typo-mobile-h4 md:typo-desktop-h4"> Contact Us</h2>
            <LinkIcon />
          </a>
        </div>

        {/* Divider */}
        <hr className="h-[1px] w-full bg-white/20 border-0" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-6 text-[14px] md:typo-desktop-body-md">
          <span className="order-2 md:order-1 opacity-80">
            © 2026 Finerplanet. All rights reserved.
          </span>
          <div className="flex gap-6 order-1 md:order-2">
            <Link href="privacy-policy" className="hover:opacity-80">
              Privacy Policy
            </Link>
            <Link href="terms-of-service" className="hover:opacity-80">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
