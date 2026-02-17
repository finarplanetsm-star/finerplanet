"use client"

import { useEffect, useState } from "react"
import { useArticleSearch } from "@/context/articleContext"
import { useNav } from "@/context/NavContext"
import { useFormik } from "formik"
import * as Yup from "yup"

import { FormIcon } from "../../public/articleSvg/article-svg"
import { Calendar } from "../../public/common-svg"
import CustomSelect from "./CustomSelect"

// 1. Define Static Options
const journalGroupOptions = [
  { label: "UT 50", value: "UT 50" },
  { label: "FinerPlanet 50", value: "FinerPlanet 50" },
]

const disciplineOptions = [
  { label: "Finance", value: "Finance" },
  { label: "Marketing", value: "Marketing" },
  { label: "Management", value: "Management" },
  { label: "Accounting", value: "Accounting" },
  { label: "Information Systems", value: "Information Systems" },
  // Add more disciplines here
]

export default function SearchByForm() {
  const { active } = useNav()
  const {
    fetchFirstNames,
    fetchLastNames,
    fetchJournals,
    fetchArticleNames,
    fetchArticles,
    setSearchClicked,
  } = useArticleSearch()

  const [yearOptions, setYearOptions] = useState<number[]>([])

  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let year = currentYear; year >= 1900; year--) {
      years.push(year)
    }
    setYearOptions(years)
  }, [])

  // 2. Define Interface for new fields
  interface FormValues {
    firstName: string[]
    lastName: string[]
    yearStart: string
    yearEnd: string
    journal: string[]
    articleName: string[]
    universityName: string[]
    authorsName: string[]
    // New Fields
    journalGroup: string
    discipline: string
  }

  // 3. Reusable Component for the new Selects
  const AdditionalFilters = () => (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      {/* Journal Group Select */}
      <div className="flex-1 text-left">
        <label className="form-label mb-2.5 block" htmlFor="journalGroup">
          Journal Group
        </label>
        <div className="flex items-center border rounded-lg overflow-hidden p-3 bg-[#F1F5FF]">
          <select
            id="journalGroup"
            name="journalGroup"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.journalGroup}
            className="w-full bg-transparent form-input outline-none cursor-pointer"
          >
            <option value="" label="Select Journal Group" />
            {journalGroupOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Discipline Select */}
      <div className="flex-1 text-left">
        <label className="form-label mb-2.5 block" htmlFor="discipline">
          Discipline
        </label>
        <div className="flex items-center border rounded-lg overflow-hidden p-3 bg-[#F1F5FF]">
          <select
            id="discipline"
            name="discipline"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.discipline}
            className="w-full bg-transparent form-input outline-none cursor-pointer"
          >
            <option value="" label="Select Discipline" />
            {disciplineOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )

  const YearComponent = () => (
    <div className="flex flex-col md:max-w-[55%] text-left flex-1 md:flex-[0.5] ">
      <label
        className="form-label mb-2.5 mt-[20px] lg:mt-0"
        htmlFor="yearRange"
      >
        Select the year range
      </label>

      <div className="flex items-center border rounded-lg overflow-hidden p-2.5 bg-[#F1F5FF]">
        {/* Start Year */}
        <div className="flex items-center md:px-3 py-2 gap-[10.5px] flex-1">
          <Calendar />
          <select
            id="yearStart"
            name="yearStart"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.yearStart}
            className="w-full bg-transparent form-input outline-none "
          >
            <option value="">1990</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="h-[65%] w-px bg-[#D1D5DB] mx-2" />

        {/* End Year */}
        <div className="flex items-center md:px-3 py-2 gap-[10.5px] flex-1">
          <Calendar />
          <select
            id="yearEnd"
            name="yearEnd"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.yearEnd}
            className="w-full bg-transparent form-input "
          >
            <option value="">2025</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2 mt-1">
        {formik.touched.yearStart && formik.errors.yearStart && (
          <div className="text-red-500 text-sm flex-1">
            {formik.errors.yearStart}
          </div>
        )}
        {formik.touched.yearEnd && formik.errors.yearEnd && (
          <div className="text-red-500 text-sm flex-1">
            {formik.errors.yearEnd}
          </div>
        )}
      </div>
    </div>
  )

  const validationSchemaMap: Record<string, Yup.ObjectSchema<any>> = {
    Author: Yup.object({
      firstName: Yup.array(),
      lastName: Yup.array(),
      yearStart: Yup.date().required("Start Year Required"),
      yearEnd: Yup.date().required("End Year Required"),
      journal: Yup.array(),
      journalGroup: Yup.string(),
      discipline: Yup.string(),
    }),
    Article: Yup.object({
      articleName: Yup.array(),
      yearStart: Yup.date().required("Start Year Required"),
      yearEnd: Yup.date().required("End Year Required"),
      journal: Yup.array(),
      journalGroup: Yup.string(),
      discipline: Yup.string(),
    }),
    AdvancedSearch: Yup.object({
      firstName: Yup.array()
        .min(1, "Select at least one first name")
        .required("Required"),
      lastName: Yup.array()
        .min(1, "Select at least one last name")
        .required("Required"),
      articleName: Yup.array()
        .min(1, "Select at least one article name")
        .required("Required"),
      yearStart: Yup.date().required("Start Year Required"),
      yearEnd: Yup.date().required("End Year Required"),
      journalGroup: Yup.string(),
      discipline: Yup.string(),
    }),
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      firstName: [],
      lastName: [],
      yearStart: "1990",
      yearEnd: "2025",
      journal: [],
      articleName: [],
      universityName: [],
      authorsName: [],
      // New Initial Values
      journalGroup: "",
      discipline: "",
    },
    validationSchema: validationSchemaMap[active],
    validateOnMount: true,

    onSubmit: async (values) => {
      setSearchClicked(true)
      await fetchArticles(values)
    },
  })

  const isButtonActive =
    active === "AdvancedSearch" ? formik.isValid && formik.dirty : true

  useEffect(() => {
    formik.resetForm({
      values: {
        firstName: [],
        lastName: [],
        yearStart: "1990",
        yearEnd: "2025",
        journal: [],
        articleName: [],
        universityName: [],
        authorsName: [],
        journalGroup: "",
        discipline: "",
      },
    })

    formik.setErrors({})
    formik.setTouched({})
    formik.validateForm()
  }, [active])

  return (
    <div className="w-full min-h-[289px] text-white  bg-white shadow-[0_0_10px_0_rgba(0,0,0,0.1)] rounded-[14px] mt-[20px]">
      <form
        onSubmit={formik.handleSubmit}
        className="relative p-[16px] md:p-[20px] pb-[80px]" // Added padding bottom for button space
      >
        {/* Authors form */}
        {active === "Author" && (
          <div className="flex flex-col gap-6">
            <div className="2xl:flex gap-6 ">
              <div className="text-left flex-1">
                <div className="flex gap-[9px]">
                  <label className="form-label mb-[9px]" htmlFor="firstName">
                    Author's First Name (You can select multiple Authors)
                  </label>
                  <span className="flex justify-end">
                    <FormIcon />
                  </span>
                </div>
                <CustomSelect
                  instanceId="firstName-select"
                  name="firstName"
                  inputId="firstName"
                  isMulti
                  placeholder="Enter First Name"
                  value={formik.values.firstName}
                  onChange={(value) => formik.setFieldValue("firstName", value)}
                  loadOptions={fetchFirstNames}
                />
              </div>

              <div className="text-left flex-1">
                <div className="flex gap-[9px]">
                  <label
                    className="form-label mt-[20px] lg:mt-0 mb-[10px]"
                    htmlFor="lastName"
                  >
                    Author's Last Name (You can select multiple Authors)
                  </label>
                  <span className="flex items-center">
                    <FormIcon />
                  </span>
                </div>
                <CustomSelect
                  instanceId="lastName-select"
                  inputId="lastName"
                  name="lastName"
                  loadOptions={fetchLastNames}
                  isMulti
                  placeholder="Enter Last name"
                  value={formik.values.lastName}
                  onChange={(value) => formik.setFieldValue("lastName", value)}
                />
              </div>

              <YearComponent />
            </div>

            <div className="text-left mb-3">
              <div className="flex">
                <label
                  className="form-label mr-[15px] mb-[10px]"
                  htmlFor="journals"
                >
                  Journals
                </label>
                <span className="text-black">
                  <FormIcon />
                </span>
              </div>
              <CustomSelect
                instanceId="journal-select"
                name="journal"
                inputId="journals"
                loadOptions={fetchJournals}
                isMulti
                placeholder="Select journal"
                value={formik.values.journal}
                onChange={(value) => formik.setFieldValue("journal", value)}
              />
            </div>

            {/*  Additional Filters here */}
            <AdditionalFilters />
          </div>
        )}

        {/* Article Form */}
        {active === "Article" && (
          <div className="flex flex-col gap-3">
            <div className="2xl:flex md:flex-row flex-col gap-6">
              <div className="text-left flex flex-col flex-2">
                <div className="flex gap-[9px]">
                  <label
                    className="form-label mb-[10px] "
                    htmlFor="articleName"
                  >
                    Start typing Article's Name (You can select multiple
                    Articles)
                  </label>
                  <span className="text-black flex-[0.1] flex ">
                    <FormIcon />
                  </span>
                </div>
                <CustomSelect
                  instanceId="articleName-select"
                  inputId="articleName"
                  name="articleName"
                  loadOptions={fetchArticleNames}
                  isMulti
                  placeholder="Enter article name"
                  value={formik.values.articleName}
                  onChange={(value) =>
                    formik.setFieldValue("articleName", value)
                  }
                />
              </div>
              <YearComponent />
            </div>

            <div className="text-left mb-3">
              <div className="flex">
                <label
                  className="form-label mr-[15px] mb-[10px]"
                  htmlFor="journal"
                >
                  Journals
                </label>
                <span className="text-black">
                  <FormIcon />
                </span>
              </div>
              <CustomSelect
                instanceId="journal-select"
                name="journal"
                inputId="journal"
                loadOptions={fetchJournals}
                isMulti
                placeholder="Select journal"
                value={formik.values.journal}
                onChange={(value) => formik.setFieldValue("journal", value)}
              />
            </div>

            {/* 4. Insert Additional Filters here */}
            <AdditionalFilters />
          </div>
        )}

        {/* Advanced Search Form */}
        {active === "AdvancedSearch" && (
          <div className="flex flex-col gap-3">
            <div className="2xl:flex md:flex-row flex-col gap-6">
              <div className="text-left flex-1">
                <div className="flex gap-[9px]">
                  <label className="form-label mb-[10px] " htmlFor="firstName">
                    Author's First Name (You can select multiple Authors)
                  </label>
                  <span className="text-black flex-[0.1] flex">
                    <FormIcon />
                  </span>
                </div>
                <CustomSelect
                  instanceId="firstName-select"
                  name="firstName"
                  inputId="firstName"
                  loadOptions={fetchFirstNames}
                  isMulti
                  placeholder="Enter First Name"
                  value={formik.values.firstName}
                  onChange={(value) => formik.setFieldValue("firstName", value)}
                />
              </div>

              <div className="text-left flex-1">
                <div className="flex gap-[9px]">
                  <label className="form-label mb-[10px] " htmlFor="lastName">
                    Author's Last Name (You can select multiple Authors)
                  </label>
                  <span className="text-black  flex-[0.1] flex">
                    <FormIcon />
                  </span>
                </div>
                <CustomSelect
                  instanceId="lastName-select"
                  inputId="lastName"
                  name="lastName"
                  loadOptions={fetchLastNames}
                  isMulti
                  placeholder="Enter Last name"
                  value={formik.values.lastName}
                  onChange={(value) => formik.setFieldValue("lastName", value)}
                />
              </div>
              <YearComponent />
            </div>

            <div className="text-left flex flex-col">
              <div className="flex gap-[9px]">
                <label className="form-label mb-[10px]" htmlFor="articleName">
                  Start typing Articles's Name (You can select multiple
                  Articles)
                </label>
                <span className="text-black flex-[0.1] flex ">
                  <FormIcon />
                </span>
              </div>
              <CustomSelect
                instanceId="articleName-select"
                inputId="articleName"
                name="articleName"
                loadOptions={fetchArticleNames}
                isMulti
                placeholder="Enter article name"
                value={formik.values.articleName}
                onChange={(value) => formik.setFieldValue("articleName", value)}
              />
            </div>

            {/* 4. Insert Additional Filters here */}
            <AdditionalFilters />
          </div>
        )}

        {/*Collaboration Form */}
        {active === "Collaboration" && (
          <div className="flex flex-col gap-3">
            <div className="2xl:flex md:flex-row flex-col gap-6">
              <div className="text-left flex flex-col flex-2">
                <div className="flex gap-[9px]">
                  <label
                    className="form-label mb-[10px] "
                    htmlFor="articleName"
                  >
                    Start typing University's Name (You can select multiple
                    Universities)
                  </label>
                  <span className="text-black flex-[0.1] flex ">
                    <FormIcon />
                  </span>
                </div>
                <CustomSelect
                  instanceId="articleName-select"
                  inputId="articleName"
                  name="articleName"
                  loadOptions={fetchArticleNames}
                  isMulti
                  placeholder="Enter article name"
                  value={formik.values.articleName}
                  onChange={(value) =>
                    formik.setFieldValue("articleName", value)
                  }
                />
              </div>
              <YearComponent />
            </div>

            <div className="text-left mb-3">
              <div className="flex">
                <label
                  className="form-label mr-[15px] mb-[10px]"
                  htmlFor="journal"
                >
                  Journals
                </label>
                <span className="text-black">
                  <FormIcon />
                </span>
              </div>
              <CustomSelect
                instanceId="journal-select"
                name="journal"
                inputId="journal"
                loadOptions={fetchJournals}
                isMulti
                placeholder="Select journal"
                value={formik.values.journal}
                onChange={(value) => formik.setFieldValue("journal", value)}
              />
            </div>

            {/* 4. Insert Additional Filters here */}
            <AdditionalFilters />
          </div>
        )}

        {/* University Form */}
        {active === "Universities" && (
          <div className="flex flex-col gap-6">
            {/* 1. University + Year */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="form-label mb-2">
                  Start typing University's Name
                </label>
                <CustomSelect
                  instanceId="articleName-select"
                  inputId="articleName"
                  name="articleName"
                  isMulti
                  loadOptions={fetchArticleNames}
                  placeholder="Enter article name"
                  value={formik.values.articleName}
                  onChange={(value) =>
                    formik.setFieldValue("articleName", value)
                  }
                />
              </div>
            </div>

            {/* 2. Author First + Last Name */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="form-label mb-2">Author's First Name</label>
                <CustomSelect
                  instanceId="firstName-select"
                  name="firstName"
                  isMulti
                  loadOptions={fetchFirstNames}
                  placeholder="Enter First Name"
                  value={formik.values.firstName}
                  onChange={(value) => formik.setFieldValue("firstName", value)}
                />
              </div>

              <div className="flex-1">
                <label className="form-label mb-2">Author's Last Name</label>
                <CustomSelect
                  instanceId="lastName-select"
                  name="lastName"
                  isMulti
                  loadOptions={fetchLastNames}
                  placeholder="Enter Last Name"
                  value={formik.values.lastName}
                  onChange={(value) => formik.setFieldValue("lastName", value)}
                />
              </div>
            </div>

            {/* 3. Year + Journal Group + Discipline in one line */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <YearComponent />
              </div>
              <div className="flex-1">
                <AdditionalFilters />
              </div>
            </div>

            {/* Additional Filters */}
          </div>
        )}

        <button
          type="submit"
          className={`article-search-btn absolute md:top-[94%] cursor-pointer left-1/2 -translate-x-1/2 
           rounded-[9px] hover:scale-110 transition duration-300 ease-in-out uppercase md:normal-case
           ${isButtonActive ? "bg-[#3B3098] text-white" : "bg-[#E1E3E8] text-[#1B212E]"}
           md:text-[20px] w-full md:w-[445px] text-[14px]  py-[16px]  px-[40px]`}
        >
          Search
        </button>
      </form>
    </div>
  )
}
