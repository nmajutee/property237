import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  ClockIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ChevronDownIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { Button } from '../primitives/Button'
import { Badge } from '../primitives/Badge'
import { useClickOutside } from '../../hooks/useClickOutside'

// Search suggestion interface
export interface SearchSuggestion {
  id: string
  title: string
  subtitle?: string
  type: 'property' | 'location' | 'tenant' | 'recent' | 'category'
  icon?: React.ComponentType<{ className?: string }>
  data?: any
}

// Filter option interface
export interface FilterOption {
  id: string
  label: string
  value: string | number
  count?: number
}

// Filter group interface
export interface FilterGroup {
  id: string
  label: string
  type: 'select' | 'multiselect' | 'range' | 'checkbox'
  options?: FilterOption[]
  min?: number
  max?: number
  step?: number
  value?: any
}

// Search filter interface
export interface SearchFilter {
  [key: string]: any
}

// Search result interface
export interface SearchResult {
  query: string
  filters: SearchFilter
  timestamp: Date
}

// SearchBar component props
export interface SearchBarProps {
  /** Current search query */
  value?: string
  /** Search query change handler */
  onChange?: (query: string) => void
  /** Search submission handler */
  onSearch?: (query: string, filters: SearchFilter) => void
  /** Placeholder text */
  placeholder?: string
  /** Search suggestions */
  suggestions?: SearchSuggestion[]
  /** Recent searches */
  recentSearches?: SearchResult[]
  /** Filter groups */
  filterGroups?: FilterGroup[]
  /** Current filters */
  filters?: SearchFilter
  /** Filter change handler */
  onFilterChange?: (filters: SearchFilter) => void
  /** Clear recent searches handler */
  onClearRecentSearches?: () => void
  /** Loading state */
  loading?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Show suggestions dropdown */
  showSuggestions?: boolean
  /** Show filters */
  showFilters?: boolean
  /** Auto-focus on mount */
  autoFocus?: boolean
  /** Debounce delay for search (ms) */
  debounceDelay?: number
  /** Maximum suggestions to show */
  maxSuggestions?: number
  /** Maximum recent searches to show */
  maxRecentSearches?: number
  /** Additional CSS classes */
  className?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onChange,
  onSearch,
  placeholder = 'Search properties, locations, tenants...',
  suggestions = [],
  recentSearches = [],
  filterGroups = [],
  filters = {},
  onFilterChange,
  onClearRecentSearches,
  loading = false,
  disabled = false,
  showSuggestions = true,
  showFilters = true,
  autoFocus = false,
  debounceDelay = 300,
  maxSuggestions = 8,
  maxRecentSearches = 5,
  className = ''
}) => {
  // Internal state
  const [internalQuery, setInternalQuery] = useState(value)
  const [internalFilters, setInternalFilters] = useState<SearchFilter>(filters)
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)

  // Use external state if provided, otherwise use internal state
  const currentQuery = value !== undefined ? value : internalQuery
  const currentFilters = Object.keys(filters).length > 0 ? filters : internalFilters

  // Close dropdowns when clicking outside
  useClickOutside(suggestionsRef, () => setSuggestionsOpen(false))
  useClickOutside(filtersRef, () => setFiltersOpen(false))

  // Auto-focus on mount
  useEffect(() => {
    if (autoFocus && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [autoFocus])

  // Debounced search
  const debouncedSearch = useCallback((query: string) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(query, currentFilters)
      }
    }, debounceDelay)

    setDebounceTimer(timer)
  }, [onSearch, currentFilters, debounceDelay, debounceTimer])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value

    if (onChange) {
      onChange(newQuery)
    } else {
      setInternalQuery(newQuery)
    }

    // Show suggestions when typing
    if (showSuggestions && newQuery.trim()) {
      setSuggestionsOpen(true)
      setFocusedSuggestionIndex(-1)
    } else {
      setSuggestionsOpen(false)
    }

    // Debounced search
    if (newQuery.trim()) {
      debouncedSearch(newQuery.trim())
    }
  }

  // Handle input focus
  const handleInputFocus = () => {
    if (showSuggestions && (currentQuery.trim() || recentSearches.length > 0)) {
      setSuggestionsOpen(true)
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedQuery = currentQuery.trim()

    if (trimmedQuery && onSearch) {
      onSearch(trimmedQuery, currentFilters)
    }

    setSuggestionsOpen(false)
    searchInputRef.current?.blur()
  }

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    const newQuery = suggestion.title

    if (onChange) {
      onChange(newQuery)
    } else {
      setInternalQuery(newQuery)
    }

    if (onSearch) {
      onSearch(newQuery, currentFilters)
    }

    setSuggestionsOpen(false)
    searchInputRef.current?.focus()
  }

  // Handle recent search selection
  const handleRecentSearchSelect = (recentSearch: SearchResult) => {
    const newQuery = recentSearch.query

    if (onChange) {
      onChange(newQuery)
    } else {
      setInternalQuery(newQuery)
    }

    if (onFilterChange) {
      onFilterChange(recentSearch.filters)
    } else {
      setInternalFilters(recentSearch.filters)
    }

    if (onSearch) {
      onSearch(newQuery, recentSearch.filters)
    }

    setSuggestionsOpen(false)
    searchInputRef.current?.focus()
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!suggestionsOpen) return

    const totalSuggestions = Math.min(suggestions.length, maxSuggestions) +
      (recentSearches.length > 0 ? Math.min(recentSearches.length, maxRecentSearches) : 0)

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedSuggestionIndex(prev =>
          prev < totalSuggestions - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedSuggestionIndex(prev =>
          prev > 0 ? prev - 1 : totalSuggestions - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (focusedSuggestionIndex >= 0) {
          const recentCount = Math.min(recentSearches.length, maxRecentSearches)
          if (focusedSuggestionIndex < recentCount) {
            // Select recent search
            handleRecentSearchSelect(recentSearches[focusedSuggestionIndex])
          } else {
            // Select suggestion
            const suggestionIndex = focusedSuggestionIndex - recentCount
            if (suggestionIndex < suggestions.length) {
              handleSuggestionSelect(suggestions[suggestionIndex])
            }
          }
        } else {
          // Submit form
          handleSubmit(e)
        }
        break
      case 'Escape':
        setSuggestionsOpen(false)
        setFocusedSuggestionIndex(-1)
        searchInputRef.current?.blur()
        break
    }
  }

  // Handle filter change
  const handleFilterChange = (filterId: string, value: any) => {
    const newFilters = { ...currentFilters, [filterId]: value }

    // Remove filter if value is empty/null
    if (value === null || value === undefined || value === '' ||
        (Array.isArray(value) && value.length === 0)) {
      delete newFilters[filterId]
    }

    if (onFilterChange) {
      onFilterChange(newFilters)
    } else {
      setInternalFilters(newFilters)
    }

    // Trigger search with new filters
    if (onSearch && currentQuery.trim()) {
      onSearch(currentQuery.trim(), newFilters)
    }
  }

  // Clear search
  const clearSearch = () => {
    if (onChange) {
      onChange('')
    } else {
      setInternalQuery('')
    }

    setSuggestionsOpen(false)
    searchInputRef.current?.focus()
  }

  // Get active filter count
  const activeFilterCount = Object.keys(currentFilters).length

  // Render filter input based on type
  const renderFilterInput = (group: FilterGroup) => {
    const value = currentFilters[group.id]

    switch (group.type) {
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleFilterChange(group.id, e.target.value)}
            className="w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white text-sm"
          >
            <option value="">All {group.label}</option>
            {group.options?.map(option => (
              <option key={option.id} value={option.value}>
                {option.label} {option.count !== undefined && `(${option.count})`}
              </option>
            ))}
          </select>
        )

      case 'multiselect':
        const selectedValues = Array.isArray(value) ? value : []
        return (
          <div className="space-y-2">
            {group.options?.map(option => (
              <label key={option.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter(v => v !== option.value)
                    handleFilterChange(group.id, newValues)
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {option.label} {option.count !== undefined && `(${option.count})`}
                </span>
              </label>
            ))}
          </div>
        )

      case 'range':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                min={group.min}
                max={group.max}
                step={group.step}
                value={value?.min || ''}
                onChange={(e) => handleFilterChange(group.id, {
                  ...value,
                  min: e.target.value ? Number(e.target.value) : undefined
                })}
                className="w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white text-sm"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                placeholder="Max"
                min={group.min}
                max={group.max}
                step={group.step}
                value={value?.max || ''}
                onChange={(e) => handleFilterChange(group.id, {
                  ...value,
                  max: e.target.value ? Number(e.target.value) : undefined
                })}
                className="w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white text-sm"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Render suggestion icon
  const renderSuggestionIcon = (suggestion: SearchSuggestion) => {
    const Icon = suggestion.icon ||
      (suggestion.type === 'property' ? BuildingOfficeIcon :
       suggestion.type === 'location' ? MapPinIcon :
       suggestion.type === 'tenant' ? UsersIcon :
       suggestion.type === 'recent' ? ClockIcon :
       MagnifyingGlassIcon)

    return <Icon className="h-4 w-4 text-gray-400" />
  }

  // Get visible suggestions
  const visibleSuggestions = suggestions.slice(0, maxSuggestions)
  const visibleRecentSearches = recentSearches.slice(0, maxRecentSearches)

  return (
    <div className={`relative w-full max-w-2xl ${className}`}>
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={currentQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full pl-12 pr-20 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />

          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            ) : (
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
            {/* Clear Button */}
            {currentQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="p-1.5"
              >
                <XMarkIcon className="h-4 w-4" />
              </Button>
            )}

            {/* Filters Button */}
            {showFilters && filterGroups.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`p-1.5 relative ${filtersOpen ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
              >
                <AdjustmentsHorizontalIcon className="h-4 w-4" />
                {activeFilterCount > 0 && (
                  <Badge
                    variant="primary"
                    size="sm"
                    className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center text-xs"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {suggestionsOpen && showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 max-h-96 overflow-y-auto"
        >
          {/* Recent Searches */}
          {visibleRecentSearches.length > 0 && (
            <div className="p-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Recent Searches
                </span>
                {onClearRecentSearches && (
                  <button
                    onClick={onClearRecentSearches}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-1">
                {visibleRecentSearches.map((recent, index) => (
                  <button
                    key={`recent-${index}`}
                    onClick={() => handleRecentSearchSelect(recent)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors
                      ${index === focusedSuggestionIndex
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <ClockIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {recent.query}
                      </div>
                      {Object.keys(recent.filters).length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <FunnelIcon className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {Object.keys(recent.filters).length} filters applied
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {visibleSuggestions.length > 0 && (
            <div className="p-3">
              {visibleRecentSearches.length > 0 && (
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                  Suggestions
                </span>
              )}
              <div className="space-y-1">
                {visibleSuggestions.map((suggestion, index) => {
                  const adjustedIndex = index + visibleRecentSearches.length
                  return (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors
                        ${adjustedIndex === focusedSuggestionIndex
                          ? 'bg-blue-50 dark:bg-blue-900/20'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      {renderSuggestionIcon(suggestion)}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {suggestion.title}
                        </div>
                        {suggestion.subtitle && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {suggestion.subtitle}
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* No suggestions */}
          {visibleSuggestions.length === 0 && visibleRecentSearches.length === 0 && currentQuery.trim() && (
            <div className="p-6 text-center">
              <MagnifyingGlassIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No suggestions found for "{currentQuery}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* Filters Dropdown */}
      {filtersOpen && showFilters && filterGroups.length > 0 && (
        <div
          ref={filtersRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 max-h-96 overflow-y-auto"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Filters
              </h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={() => {
                    if (onFilterChange) {
                      onFilterChange({})
                    } else {
                      setInternalFilters({})
                    }
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-4">
              {filterGroups.map(group => (
                <div key={group.id}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {group.label}
                  </label>
                  {renderFilterInput(group)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}