"use client"

import { useCallback, useRef, useState } from "react"
import debounce from "lodash.debounce"
import Select, {
  InputActionMeta,
  MultiValue,
  SingleValue,
  StylesConfig,
} from "react-select"

// --- Interfaces ---
export interface Option {
  label: string
  value: string
}

// Matches the return type from your updated service/context
interface PaginatedResult {
  options: Option[]
  hasMore: boolean
}

export interface CustomSelectProps {
  name: string
  // 'options' is now mostly for fallback or static usage.
  options?: Option[]
  isMulti?: boolean
  className?: string
  inputId?: string
  placeholder?: string
  value: string[] | string
  onChange: (value: any) => void
  customStyles?: StylesConfig<Option, boolean>
  instanceId: string
  closeMenuOnSelect?: boolean
  // NEW: loadOptions now accepts a page number
  loadOptions?: (inputValue: string, page: number) => Promise<PaginatedResult>
}

// --- Component ---
const CustomSelect = ({
  customStyles,
  inputId,
  placeholder,
  name,
  options: staticOptions = [],
  isMulti = false,
  value,
  instanceId,
  onChange,
  loadOptions,
  closeMenuOnSelect = true,
}: CustomSelectProps) => {
  // --- State for Infinite Scroll & Search ---
  const [internalOptions, setInternalOptions] =
    useState<Option[]>(staticOptions)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [inputValue, setInputValue] = useState("")

  // Ref to keep track of the current search term during scroll events
  const latestQueryRef = useRef(inputValue)

  // 1. Initial Load (Page 1) on mount
  // useEffect(() => {
  //   if (loadOptions) {
  //     fetchData("", 1, true)
  //   } else {
  //     setInternalOptions(staticOptions)
  //   }

  // }, [])

  // 2. Main Fetch Function
  const fetchData = async (
    query: string,
    pageToFetch: number,
    isReset: boolean
  ) => {
    if (!loadOptions) return

    setIsLoading(true)
    try {
      const { options: newOptions, hasMore: moreAvailable } = await loadOptions(
        query,
        pageToFetch
      )

      setInternalOptions((prev) => {
        const uniqueMap = new Map()

        // If we are scrolling (not resetting), keep the old options
        if (!isReset) {
          prev.forEach((opt) => uniqueMap.set(opt.value, opt))
        }

        // Add the new page of options
        // (Map ensures we don't get duplicates if the API overlaps)
        newOptions.forEach((opt) => uniqueMap.set(opt.value, opt))

        return Array.from(uniqueMap.values())
      })

      setHasMore(moreAvailable)
      setPage(pageToFetch)
    } catch (error) {
      console.error("Error loading options", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 3. Debounced Search Handler
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      // User typed something new -> Reset to Page 1
      fetchData(query, 1, true)
    }, 400),
    [loadOptions]
  )

  const handleInputChange = (newValue: string, actionMeta: InputActionMeta) => {
    // Only trigger search on actual user input
    if (actionMeta.action !== "input-change") return

    setInputValue(newValue)
    latestQueryRef.current = newValue

    // --- FIX START: Prevent re-fetch when input is cleared after selection ---
    // If input is empty, but we already have default options (page 1) loaded,
    // do NOT trigger a new search. Let the existing options display.
    if (newValue === "" && internalOptions.length > 0 && page === 1) {
      return
    }
    debouncedSearch(newValue)
  }

  const handleMenuOpen = () => {
    // Only fetch if:
    // 1. We have a loadOptions prop
    // 2. We have NO options currently (first open)
    // 3. We aren't currently loading
    if (loadOptions && internalOptions.length === 0 && !isLoading) {
      fetchData("", 1, true)
    }
  }

  // 4. Infinite Scroll Handler
  const handleMenuScrollToBottom = () => {
    if (!loadOptions || isLoading || !hasMore) return

    // Load the next page
    const nextPage = page + 1
    fetchData(latestQueryRef.current, nextPage, false)
  }

  // 5. Value Handling (Convert strings back to Option objects)
  const getValue = () => {
    if (isMulti) {
      const selectedValues = Array.isArray(value) ? value : []
      return selectedValues.map(
        (val) =>
          internalOptions.find((opt) => opt.value === val) || {
            label: val,
            value: val,
          }
      )
    } else {
      if (internalOptions.length) {
        return internalOptions.find((opt) => opt.value === value) || null
      }
      return value ? { label: String(value), value: String(value) } : null
    }
  }

  // 6. Highlight Search Terms
  const formatOptionLabel = (option: Option) => {
    if (!inputValue) return option.label
    const escapedSearchInput = inputValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const parts = option.label.split(
      new RegExp(`(${escapedSearchInput})`, "gi")
    )
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === inputValue.toLowerCase() ? (
            <span key={i} className="bg-yellow-300 font-semibold">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    )
  }

  // Default Styles
  const defaultStyles: StylesConfig<Option, boolean> = {
    control: (base) => ({
      ...base,
      backgroundColor: "#F1F5FF",
      padding: "10px",
      border: "none",
      boxShadow: "none",
      minHeight: "auto",
      "&:hover": { border: "none" },
    }),
    valueContainer: (base) => ({ ...base, padding: "0" }),
    input: (base) => ({ ...base, margin: "0", padding: "0" }),
    placeholder: (base) => ({ ...base, color: "#979797" }),
    singleValue: (base) => ({ ...base, color: "#979797" }),
    multiValue: (base) => ({ ...base, backgroundColor: "#E0E7FF" }),
    multiValueLabel: (base) => ({ ...base, color: "#4B5563" }),
    menu: (base) => ({ ...base, backgroundColor: "#F1F5FF", zIndex: 9999 }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#E0E7FF" : "#F1F5FF",
      color: "#333",
      "&:active": { backgroundColor: "#C7D2FE" },
    }),
  }

  return (
    <Select
      inputId={inputId}
      name={name}
      isMulti={isMulti}
      value={getValue()}
      onChange={(option: MultiValue<Option> | SingleValue<Option>) => {
        onChange(
          isMulti
            ? (option as MultiValue<Option>).map((item) => item.value)
            : (option as Option)?.value || ""
        )
      }}
      placeholder={placeholder}
      styles={customStyles || defaultStyles}
      instanceId={instanceId}
      closeMenuOnSelect={false}
      blurInputOnSelect={false}
      onMenuOpen={handleMenuOpen}
      options={internalOptions}
      onInputChange={handleInputChange}
      onMenuScrollToBottom={handleMenuScrollToBottom}
      isLoading={isLoading}
      formatOptionLabel={formatOptionLabel}
      classNames={{
        input: () => "form-input",
      }}
    />
  )
}

export default CustomSelect
