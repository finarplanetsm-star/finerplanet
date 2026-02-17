"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { getFilterOptions } from "@/api/services/articles.service"
import { useFilters } from "@/context/filterArticleContext"
import { useNav } from "@/context/NavContext"
import { useFormik } from "formik"
import { filter } from "framer-motion/client"
import * as Yup from "yup"

import type { Article } from "@/api/services/articlesCache"

import { Calendar } from "../../public/common-svg"

// Define Static Options
const journalGroupOptions = [
  { label: "UTD24", value: "UTD24" },
  { label: "FT50", value: "FT50" },
]

// Discipline abbreviation to full name mapping
const DISCIPLINE_FULL_NAMES: Record<string, string> = {
  AC: "Accounting",
  ECON: "Economics",
  FIN: "Finance",
  IS: "Information Systems",
  MD: "Multidisciplinary",
  "M&O": "Management & Organizations",
  MKTG: "Marketing",
  OM: "Operations Management",
  PRACT: "Practitioner",
}

const JOURNAL_GROUP_FIELD_MAP: Record<string, keyof Article> = {
  UTD24: "utd24",
  FT50: "ft50",
}

interface FormValues {
  universityName: string
  authorName: string
  journalGroup: string
  articleName: string
  discipline: string
  journalName: string
  journals: string[]
  yearStart: string
  yearEnd: string
}

const validationSchema = Yup.object({
  universityName: Yup.string(),
  authorName: Yup.string(),
  journalGroup: Yup.string(),
  articleName: Yup.string(),
  journalName: Yup.string(),
  discipline: Yup.string(),
  journals: Yup.array(),
  yearStart: Yup.string(),
  yearEnd: Yup.string(),
})

interface SearchByFormProps {
  articles: Article[]
}

// CUSTOM DROPDOWN COMPONENT
interface CustomDropdownProps {
  label: string
  value: string
  options: Array<{ label: string; value: string }>
  onChange: (value: string) => void
  onClear: () => void
  placeholder?: string
}

function CustomDropdown({
  label,
  value,
  options,
  onChange,
  onClear,
  placeholder = "Select option",
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const selectedLabel = options.find((opt) => opt.value === value)?.label

  return (
    <div ref={dropdownRef} className="relative">
      <div
        className="relative bg-[#E5F3F0] rounded-lg px-3 py-2.5 h-[48px] flex items-center justify-between cursor-pointer hover:bg-[#d9eae7] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value ? (
          <div className="flex items-center justify-between flex-1 bg-white rounded-md px-3 py-1 mr-2 border border-gray-100 pointer-events-none">
            <span className="text-sm text-[#1F2937] font-medium">
              {selectedLabel}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onClear()
              }}
              className="text-gray-500 hover:text-gray-700 font-bold text-lg ml-2 pointer-events-auto"
            >
              ×
            </button>
          </div>
        ) : (
          <span className="text-md text-[#9CA3AF]">{placeholder}</span>
        )}

        <div className="flex items-center gap-2 pointer-events-none">
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {isOpen && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-white rounded-md shadow-lg border border-gray-200 text-sm z-50 max-h-48 overflow-y-auto">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className="px-3 py-2 hover:bg-[#E5F3F0] cursor-pointer text-[#1F2937] transition-colors"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// CUSTOM YEAR PICKER COMPONENT
interface CustomYearPickerProps {
  value: string
  onChange: (year: string) => void
  yearList: number[]
  placeholder?: string
}

function CustomYearPicker({
  value,
  onChange,
  yearList,
  placeholder = "YYYY",
}: CustomYearPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <div ref={pickerRef} className="flex-1 flex flex-col relative">
      <div
        className="relative w-full cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          readOnly
          value={value}
          className="w-full bg-transparent border-none outline-none text-[#1F2937] text-md pl-8 pr-6 placeholder:text-[#9CA3AF] cursor-pointer"
          placeholder={placeholder}
        />
      </div>
      {isOpen && (
        <ul className="absolute top-full left-0 mt-2 w-full max-h-48 overflow-y-auto bg-white rounded-[6px] shadow-lg border border-gray-200 text-sm z-50">
          {yearList.map((year) => (
            <li
              key={year}
              onClick={() => {
                onChange(String(year))
                setIsOpen(false)
              }}
              className="px-3 py-1 hover:bg-[#E5F3F0] cursor-pointer text-[#1F2937]"
            >
              {year}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function SearchByForm({ articles }: SearchByFormProps) {
  const journalScrollRef = useRef<HTMLDivElement>(null)
  const { active } = useNav()
  const { filters, setFilters } = useFilters()
  const [selectAllJournals, setSelectAllJournals] = useState(false)
  const isUpdatingFromGroup = useRef(false)
  const userManuallyUnselectAll = useRef(false)

  const isAuthorsPage = active === "AuthorsRanking"
  const isUniversityPage = active === "UniversityRanking"
  const isSearchByAuthorPage = active === "SearchByAuthor"
  const isSearchByArticlePage = active === "SearchByArticles"
  const isSearchByUniversityPage = active === "SearchByUniversity"
  const isJournalsPage = active === "Journals"

  const formik = useFormik<FormValues>({
    initialValues: {
      universityName: "",
      authorName: "",
      articleName: "",
      journalGroup: "",
      journalName: "",
      discipline: "",
      journals: [],
      yearStart: "",
      yearEnd: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form submitted:", values)
    },
  })

  const journalsBySelectedGroup = useMemo(() => {
    const group = formik.values.journalGroup
    if (!group) return []

    const field = JOURNAL_GROUP_FIELD_MAP[group]
    if (!field) return []

    return Array.from(
      new Set(
        articles
          .filter((article) => article[field])
          .map((article) => article.journalName)
          .filter(Boolean)
      )
    )
  }, [formik.values.journalGroup, articles])

  const journalsBySelectedDiscipline = useMemo(() => {
    const discipline = formik.values.discipline
    if (!discipline) return []

    return Array.from(
      new Set(
        articles
          .filter((article) => article.disciplineAbbr === discipline)
          .map((article) => article.journalName)
          .filter(Boolean)
      )
    )
  }, [formik.values.discipline, articles])

  const filterOptions = useMemo(() => {
    return getFilterOptions(articles)
  }, [articles])

  const journalOptions = filterOptions.journals
  const disciplineOptions = filterOptions.disciplines.map((d) => ({
    label: DISCIPLINE_FULL_NAMES[d] || d,
    value: d,
  }))

  const handleJournalToggle = (journal: string) => {
    const currentJournals = formik.values.journals
    if (currentJournals.includes(journal)) {
      formik.setFieldValue(
        "journals",
        currentJournals.filter((j) => j !== journal)
      )
    } else {
      formik.setFieldValue("journals", [...currentJournals, journal])
    }
  }

  const handleReset = () => {
    formik.resetForm()
    setSelectAllJournals(false)
  }

  const clearJournalGroup = () => formik.setFieldValue("journalGroup", "")
  const clearDiscipline = () => formik.setFieldValue("discipline", "")

  const yearList = useMemo(() => {
    if (!articles || articles.length === 0) {
      return Array.from({ length: 10 }, (_, i) => 2016 + i)
    }
    const years = articles.map((a) => a.year).filter(Boolean)
    const minYear = Math.min(...years)
    const maxYear = Math.max(...years)
    return Array.from(
      { length: maxYear - minYear + 1 },
      (_, i) => minYear + i
    ).sort((a, b) => b - a)
  }, [articles])

  useEffect(() => {
    const availableJournals = journalOptions.length
    const selectedJournals = formik.values.journals.length
    setSelectAllJournals(
      availableJournals > 0 && selectedJournals === availableJournals
    )
  }, [formik.values.journals, journalOptions])

  useEffect(() => {
    formik.resetForm({
      values: {
        universityName: "",
        authorName: "",
        journalGroup: "",
        articleName: "",
        discipline: "",
        journalName: "",
        journals: [],
        yearStart: "",
        yearEnd: "",
      },
    })
    setSelectAllJournals(false)
    userManuallyUnselectAll.current = false
    prevJournalGroup.current = ""
    prevDiscipline.current = ""

    journalScrollRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [active])

  useEffect(() => {
    setFilters({
      universityName:
        isUniversityPage || isSearchByUniversityPage
          ? formik.values.universityName
          : "",
      authorName:
        isAuthorsPage || isSearchByAuthorPage ? formik.values.authorName : "",
      title: isSearchByArticlePage ? formik.values.articleName : "",
      journalName: isJournalsPage ? formik.values.journalName : "",
      journalGroup: formik.values.journalGroup,
      discipline: formik.values.discipline,
      journals: formik.values.journals,
      yearStart: formik.values.yearStart,
      yearEnd: formik.values.yearEnd,
    })
  }, [
    formik.values,
    active,
    setFilters,
    isAuthorsPage,
    isUniversityPage,
    isSearchByAuthorPage,
    isSearchByArticlePage,
    isSearchByUniversityPage,
    isJournalsPage,
  ])

  const prevJournalGroup = useRef(formik.values.journalGroup)
  const prevDiscipline = useRef(formik.values.discipline)

  useEffect(() => {
    const wasCleared = prevJournalGroup.current && !formik.values.journalGroup
    prevJournalGroup.current = formik.values.journalGroup
    if (wasCleared && (isUniversityPage || isAuthorsPage)) {
      userManuallyUnselectAll.current = false
      formik.setFieldValue("journals", journalOptions)
      return
    }

    if (!formik.values.journalGroup) {
      return
    }
    const journalsToSet = journalsBySelectedGroup
    const currentJournals = [...formik.values.journals]
    const sortedCurrent = [...currentJournals].sort()
    const sortedNew = [...journalsToSet].sort()

    if (JSON.stringify(sortedCurrent) !== JSON.stringify(sortedNew)) {
      isUpdatingFromGroup.current = true
      formik.setFieldValue("journals", journalsToSet)
      setTimeout(() => {
        isUpdatingFromGroup.current = false
      }, 0)
    }
  }, [
    formik.values.journalGroup,
    journalsBySelectedGroup,
    isUniversityPage,
    isAuthorsPage,
    journalOptions,
  ])

  useEffect(() => {
    const wasCleared = prevDiscipline.current && !formik.values.discipline
    prevDiscipline.current = formik.values.discipline

    if (wasCleared && (isUniversityPage || isAuthorsPage)) {
      userManuallyUnselectAll.current = false
      if (formik.values.journalGroup) {
        formik.setFieldValue("journals", journalsBySelectedGroup)
      } else {
        formik.setFieldValue("journals", journalOptions)
      }
      return
    }

    if (!formik.values.discipline) {
      return
    }

    let journalsToSet = journalsBySelectedDiscipline
    if (formik.values.journalGroup) {
      journalsToSet = journalsToSet.filter((j) =>
        journalsBySelectedGroup.includes(j)
      )
    }

    const currentJournals = [...formik.values.journals]
    const sortedCurrent = [...currentJournals].sort()
    const sortedNew = [...journalsToSet].sort()

    if (JSON.stringify(sortedCurrent) !== JSON.stringify(sortedNew)) {
      formik.setFieldValue("journals", journalsToSet)
    }
  }, [
    formik.values.discipline,
    journalsBySelectedDiscipline,
    journalsBySelectedGroup,
    formik.values.journalGroup,
    isUniversityPage,
    isAuthorsPage,
    journalOptions,
  ])

  useEffect(() => {
    if ((isUniversityPage || isAuthorsPage) && journalOptions.length > 0) {
      if (
        formik.values.journals.length === 0 &&
        !formik.values.journalGroup &&
        !formik.values.discipline &&
        !userManuallyUnselectAll.current
      ) {
        formik.setFieldValue("journals", journalOptions)
      }
    }
  }, [
    isUniversityPage,
    isAuthorsPage,
    journalOptions,
    formik.values.journalGroup,
    formik.values.discipline,
    formik.values.journals.length,
  ])

  return (
    <div className="w-full bg-white rounded-[14px] p-5 h-auto">
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
        {/* --- Author Search --- */}
        {isAuthorsPage && (
          <div className="text-left">
            <label className="text-[#1F2937] text-lg font-medium mb-2 flex items-center gap-2">
              Search by Author Name{" "}
            </label>
            <div className="relative mb-[9px]">
              <input
                type="text"
                name="authorName"
                placeholder="Enter Author Name..."
                value={formik.values.authorName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-[#E5F3F0] rounded-lg border-none outline-none text-gray-700 text-sm md:text-base placeholder:text-[#9CA3AF]"
              />
            </div>
            {/* Filter by Journal Group/Discipline */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 text-left">
                <label className="text-[#1F2937] text-lg font-medium mb-2 flex items-center gap-2">
                  Filter by Journal Group{" "}
                </label>
                <CustomDropdown
                  label="Journal Group"
                  value={formik.values.journalGroup}
                  options={journalGroupOptions}
                  onChange={(value) =>
                    formik.setFieldValue("journalGroup", value)
                  }
                  onClear={clearJournalGroup}
                  placeholder="Select Journal Group"
                />
              </div>
              <div className="flex-1 text-left">
                <label className="text-[#1F2937] text-lg font-medium mb-2 flex items-center gap-2">
                  Filter by Discipline{" "}
                </label>
                <CustomDropdown
                  label="Discipline"
                  value={formik.values.discipline}
                  options={disciplineOptions}
                  onChange={(value) =>
                    formik.setFieldValue("discipline", value)
                  }
                  onClear={clearDiscipline}
                  placeholder="Select Discipline"
                />
              </div>
            </div>
          </div>
        )}

        {/* --- University Search --- */}
        {isUniversityPage && (
          <div className="text-left">
            <label className="text-[#1F2937] text-lg font-medium mb-2 flex items-center gap-2">
              Search by University Name{" "}
            </label>
            <div className="relative mb-[9px]">
              <input
                type="text"
                name="universityName"
                placeholder="Enter University Name..."
                value={formik.values.universityName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-[#E5F3F0] rounded-lg border-none outline-none text-gray-700 text-sm md:text-base placeholder:text-[#9CA3AF]"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 text-left">
                <label className="text-[#1F2937] text-lg font-medium mb-2 flex items-center gap-2">
                  Filter by Journal Group{" "}
                </label>
                <CustomDropdown
                  label="Journal Group"
                  value={formik.values.journalGroup}
                  options={journalGroupOptions}
                  onChange={(value) =>
                    formik.setFieldValue("journalGroup", value)
                  }
                  onClear={clearJournalGroup}
                  placeholder="Select Journal Group"
                />
              </div>
              <div className="flex-1 text-left">
                <label className="text-[#1F2937] text-lg font-medium mb-2 flex items-center gap-2">
                  Filter by Discipline{" "}
                </label>
                <CustomDropdown
                  label="Discipline"
                  value={formik.values.discipline}
                  options={disciplineOptions}
                  onChange={(value) =>
                    formik.setFieldValue("discipline", value)
                  }
                  onClear={clearDiscipline}
                  placeholder="Select Discipline"
                />
              </div>
            </div>
          </div>
        )}

        {/* --- Search By Author / Article / University (with Year) --- */}
        {(isSearchByAuthorPage ||
          isSearchByArticlePage ||
          isSearchByUniversityPage) && (
          <div className="text-left">
            <label className="text-[#1F2937] text-lg font-medium mb-2 flex items-center gap-2">
              Search by{" "}
              {isSearchByAuthorPage
                ? "Author Name"
                : isSearchByArticlePage
                  ? "Article Title"
                  : "University Name"}{" "}
            </label>
            <div className="relative mb-[16px]">
              <input
                type="text"
                name={
                  isSearchByAuthorPage
                    ? "authorName"
                    : isSearchByArticlePage
                      ? "articleName"
                      : "universityName"
                }
                placeholder={`Enter ${isSearchByAuthorPage ? "Author Name" : isSearchByArticlePage ? "Article Title" : "University Name"} ...`}
                value={
                  isSearchByAuthorPage
                    ? formik.values.authorName
                    : isSearchByArticlePage
                      ? formik.values.articleName
                      : formik.values.universityName
                }
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-[#E5F3F0] rounded-lg border-none outline-none text-gray-700 text-sm md:text-base placeholder:text-[#9CA3AF]"
              />
            </div>

            {/* Year Range - Using Custom Year Picker */}
            <div className="text-left w-full">
              <label className="text-[#1F2937] text-lg font-medium mb-2 block">
                Select the year range
              </label>
              <div className="flex gap-3 bg-[#E5F3F0] rounded-lg p-3 items-start">
                <CustomYearPicker
                  value={formik.values.yearStart}
                  onChange={(year) => formik.setFieldValue("yearStart", year)}
                  yearList={yearList}
                  placeholder={`${Math.min(...yearList)}`}
                />

                <div className="w-px h-6 bg-[#D1D5DB]" />
                <CustomYearPicker
                  value={formik.values.yearEnd}
                  onChange={(year) => formik.setFieldValue("yearEnd", year)}
                  yearList={yearList}
                  placeholder={`${Math.max(...yearList)}`}
                />
              </div>
            </div>
          </div>
        )}

        {/* --- Journal Checkboxes --- */}
        {(isAuthorsPage ||
          isUniversityPage ||
          isSearchByArticlePage ||
          isSearchByAuthorPage ||
          isSearchByUniversityPage) && (
          <div className="text-left flex flex-col">
            <label className="text-[#1F2937] text-lg font-medium mb-2 flex items-center gap-2">
              Filter by Journal{" "}
            </label>
            <div className="bg-[#F0F9F7] rounded-lg overflow-hidden flex-1 flex flex-col max-h-[200px] md:max-h-[280px]">
              <div
                className="overflow-y-auto flex-1 p-3 md:p-4 pb-0"
                ref={journalScrollRef}
              >
                {journalOptions.map((journal) => (
                  <label
                    key={journal}
                    className="flex items-start gap-3 mb-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={formik.values.journals.includes(journal)}
                      onChange={() => handleJournalToggle(journal)}
                      className="flex-shrink-0 w-5 h-5 rounded border-2 border-[#D1D5DB] accent-[#3A6E63] cursor-pointer"
                      style={{ marginTop: "2px" }}
                    />

                    <span className="text-sm text-[#1F2937] group-hover:text-[#3A6E63]">
                      {journal}
                    </span>
                  </label>
                ))}
              </div>
              <div className="sticky bottom-0 bg-[#F0F9F7] flex gap-6 px-4 py-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    userManuallyUnselectAll.current = false
                    formik.setFieldValue("journals", journalOptions)
                    setSelectAllJournals(true)
                  }}
                  className="text-[#00A649] font-medium text-sm hover:underline cursor-pointer"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() => {
                    userManuallyUnselectAll.current = true
                    formik.setFieldValue("journals", [])
                    setSelectAllJournals(false)
                  }}
                  className="text-[#253430] font-medium text-sm hover:underline cursor-pointer"
                >
                  Unselect All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- Year Range for Rankings Page --- */}
        {(isAuthorsPage || isUniversityPage) && (
          <div className="text-left w-full">
            <label className="text-[#1F2937] text-lg font-medium mb-2 block">
              Select the year range
            </label>
            <div className="flex gap-3 bg-[#E5F3F0] rounded-lg p-3 items-start">
              <CustomYearPicker
                value={formik.values.yearStart}
                onChange={(year) => formik.setFieldValue("yearStart", year)}
                yearList={yearList}
                placeholder={`${Math.min(...yearList)}`}
              />
              <div className="w-px h-6 bg-[#D1D5DB]" />
              <CustomYearPicker
                value={formik.values.yearEnd}
                onChange={(year) => formik.setFieldValue("yearEnd", year)}
                yearList={yearList}
                placeholder={`${Math.max(...yearList)}`}
              />
            </div>
          </div>
        )}

        {/* --- Journals Page Form --- */}
        {isJournalsPage && (
          <div className="text-left">
            <label className="form-label text-[#1F2937] mb-2 flex items-center gap-2">
              Search by Journal Name{" "}
            </label>
            <div className="relative mb-5">
              <input
                type="text"
                name="journalName"
                placeholder="Enter Journal Name..."
                value={formik.values.journalName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-[#E5F3F0] rounded-lg border-none outline-none text-gray-700 text-sm md:text-base placeholder:text-[#9CA3AF]"
              />
            </div>
            <div className="text-left w-full">
              <label className="text-[#1F2937] text-lg font-medium mb-2 block">
                Select the year range
              </label>

              <div className="flex gap-3 bg-[#E5F3F0] rounded-lg p-3 items-start">
                <CustomYearPicker
                  value={formik.values.yearStart}
                  onChange={(year) => formik.setFieldValue("yearStart", year)}
                  yearList={yearList}
                  placeholder={`${Math.min(...yearList)}`}
                />
                <div className="w-px h-6 bg-[#D1D5DB]" />
                <CustomYearPicker
                  value={formik.values.yearEnd}
                  onChange={(year) => formik.setFieldValue("yearEnd", year)}
                  yearList={yearList}
                  placeholder={`${Math.max(...yearList)}`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Reset Button */}
        <button
          type="button"
          onClick={handleReset}
          className="w-full py-3 rounded-lg bg-[#3A6E63] text-white cursor-pointer font-medium hover:bg-[#325e54] transition-colors duration-150"
        >
          Reset all filters
        </button>
      </form>
    </div>
  )
}
