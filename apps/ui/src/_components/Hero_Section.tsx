"use client"

import { useRef } from "react"
import { useArticleSearch } from "@/context/articleContext"
import { useNav } from "@/context/NavContext"
import { motion } from "framer-motion"

import {
  PublicationLogo,
  ResearchLogo,
  UpdatedAtLogo,
} from "../../public/articleSvg/article-svg"
import ResultsSection from "./ResultsSection"
import SearchByForm from "./SearchByForm"

export default function Hero_Section() {
  const formRef = useRef(null)
  const { searchClicked } = useArticleSearch()
  const { active } = useNav()

  const heroDescriptions: Record<string, string> = {
    Author: "Coming Up...",
    Article: "Coming Up...",
    AdvancedSearch: "Coming Up...",
  }

  console.log(searchClicked)
  return (
    <div className="relative ">
      <div
        className="relative h-[668px] w-full bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url('/articleSvg/Hero_Frame.png')" }}
      >
        {/* <Image className="object-cover z-0 relative" src="/Hero_Frame.png" width={1920} height={568} alt="Hero Frame" /> */}
        <div className="absolute md:top-[150px] top-[100px] flex flex-col  items-center justify-center mx-auto">
          {!searchClicked && (
            <p className="rounded-[56px] bg-[linear-gradient(358deg,#9990E5_-30.8%,rgba(169,202,209,0.26)_96.38%)] article-hero-tag p-[12px]">
              By {active.split("S").join(" S")}
            </p>
          )}

          <h1 className="article-title text-[32px] md:text-[44px] lg:text-[64px] max-w-[95%]  md:max-w-[80%] md:mx-auto mt-[8.5px]">
            The Finerplanet Top 100 Business School Research Rankings™
          </h1>
          <div className="bg-gradient-to-r from-[#3B3098] to-[#00A649] w-[75px] h-[2.3px] mb-[20px] mt-[15px] mx-auto" />

          {!searchClicked && (
            <div className="flex w-full justify-between items-center lg:max-w-[60%]  mx-auto ">
              <div className="flex flex-1 flex-col lg:flex-row  gap-[10px] justify-center items-center text-center">
                <PublicationLogo />
                <p className="text-[14px] article-info md:text-[18px]">
                  15,000+ Publications
                </p>
              </div>
              <div className="flex flex-1 flex-col lg:flex-row  gap-3 justify-center items-center  text-center">
                <ResearchLogo />
                <p className="text-[14px] article-info md:text-[20px]">
                  500+ Researchers
                </p>
              </div>
              <div className="flex flex-1 flex-col lg:flex-row  gap-3 justify-center items-center text-center">
                <UpdatedAtLogo />
                <p className="text-[14px] article-info md:text-[20px]">
                  Updated 2024
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <motion.div
        animate={{ y: searchClicked ? -470 : 0 }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        ref={formRef}
        id="form-section"
        className="absolute md:mt-[-100px] mt-[-200px] w-full md:px-26 px-4 z-40"
      >
        <SearchByForm />
      </motion.div>

      {!searchClicked ? (
        <div className="flex flex-col justify-center items-center md:px-[60px] px-[16px] lg:mt-[30em] md:mt-[32em] mt-[30em] ">
          <h1 className="article-title md:text-[64px] text-[32px] mb-[26px]">
            By {active.split("S").join(" S")}
          </h1>

          <p className="md:text-[20px] article-desc text-[14px]  mb-[3em]">
            {heroDescriptions[active]}
          </p>
        </div>
      ) : (
        <ResultsSection />
      )}
    </div>
  )
}
