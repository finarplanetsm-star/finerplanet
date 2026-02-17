"use click"

import Link from "next/link"
import { useNav } from "@/context/NavContext"

export default function ResearchImpactSection() {
  const { setActive } = useNav()
  return (
    <section className="w-full mb-[95px]">
      <div className="w-full max-w-[1040px] mx-auto px-6 flex flex-col items-center text-center">
        {/* Heading */}
        <h2 className="typo-mobile-h5 md:typo-desktop-h2 text-[#101828]">
          How We Measure Research Impact
        </h2>

        {/* Body text */}
        <p
          className="mt-4 typo-mobile-body-sm md:typo-desktop-body-sm text-[#364D48] "
          style={{ fontWeight: 400, lineHeight: "1.6" }}
        >
          Our rankings are built on a transparent, data-driven methodology
          designed to fairly evaluate academic research performance across
          authors and institutions. We analyze peer-reviewed publications using
          globally recognized research databases, ensuring consistency,
          accuracy, and comparability across disciplines.
        </p>

        {/* CTA button */}
        <Link
          href="/methodology"
          onClick={() => setActive("Methodology")}
          className="mt-10 flex justify-center items-center px-8 py-3 rounded-[9px] bg-[#3A6E63] text-white typo-mobile-body-sm md:typo-desktop-body-lg font-bold hover:bg-[#325e54] transition-colors duration-150"
        >
          Explore Our Methodology
        </Link>
      </div>
    </section>
  )
}
