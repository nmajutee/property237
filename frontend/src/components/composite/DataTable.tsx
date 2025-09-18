import React, { useState, useMemo } from 'react'
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { Button } from '../primitives/Button'
import { Input } from '../primitives/Input'

// Column definition interface
export interface DataTableColumn<T = any> {
  /** Unique identifier for the column */
  id: string
  /** Column header label */
  header: string
  /** Accessor function or key for data extraction */
  accessor: keyof T | ((row: T) => any)
  /** Column width (CSS value) */
  width?: string
  /** Whether column is sortable */
  sortable?: boolean
  /** Whether column is filterable */
  filterable?: boolean
  /** Custom cell renderer */
  cell?: (value: any, row: T, index: number) => React.ReactNode
  /** Column alignment */
  align?: 'left' | 'center' | 'right'
  /** Whether column is hidden on mobile */
  hideOnMobile?: boolean
}

// Sort configuration
export interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

// Filter configuration
export interface FilterConfig {
  [key: string]: string
}

// Pagination configuration
export interface PaginationConfig {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

// Row action interface
export interface RowAction<T = any> {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick: (row: T, index: number) => void
  variant?: 'default' | 'primary' | 'danger'
  condition?: (row: T) => boolean
}

// DataTable component props
export interface DataTableProps<T = any> {
  /** Table data */
  data: T[]
  /** Column definitions */
  columns: DataTableColumn<T>[]
  /** Row actions */
  actions?: RowAction<T>[]
  /** Whether table is loading */
  loading?: boolean
  /** Loading text */
  loadingText?: string
  /** Empty state text */
  emptyText?: string
  /** Table title */
  title?: string
  /** Table description */
  description?: string
  /** Enable global search */
  searchable?: boolean
  /** Search placeholder */
  searchPlaceholder?: string
  /** Enable row selection */
  selectable?: boolean
  /** Selected row IDs */
  selectedRows?: string[]
  /** Row selection handler */
  onRowSelect?: (selectedRows: string[]) => void
  /** Row ID accessor */
  getRowId?: (row: T, index: number) => string
  /** Enable pagination */
  paginated?: boolean
  /** Pagination configuration */
  pagination?: PaginationConfig
  /** Page change handler */
  onPageChange?: (page: number) => void
  /** Page size change handler */
  onPageSizeChange?: (pageSize: number) => void
  /** Available page sizes */
  pageSizeOptions?: number[]
  /** Sort configuration */
  sortConfig?: SortConfig
  /** Sort change handler */
  onSortChange?: (sortConfig: SortConfig | null) => void
  /** Filter configuration */
  filterConfig?: FilterConfig
  /** Filter change handler */
  onFilterChange?: (filterConfig: FilterConfig) => void
  /** Row click handler */
  onRowClick?: (row: T, index: number) => void
  /** Custom row className */
  getRowClassName?: (row: T, index: number) => string
  /** Additional CSS classes */
  className?: string
}

// Default row ID accessor
const defaultGetRowId = <T,>(row: T, index: number): string => {
  if (typeof row === 'object' && row !== null && 'id' in row) {
    return String((row as any).id)
  }
  return String(index)
}

// Default page size options
const defaultPageSizeOptions = [10, 25, 50, 100]

export const DataTable = <T,>({
  data,
  columns,
  actions = [],
  loading = false,
  loadingText = 'Loading...',
  emptyText = 'No data available',
  title,
  description,
  searchable = true,
  searchPlaceholder = 'Search...',
  selectable = false,
  selectedRows = [],
  onRowSelect,
  getRowId = defaultGetRowId,
  paginated = true,
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = defaultPageSizeOptions,
  sortConfig,
  onSortChange,
  filterConfig = {},
  onFilterChange,
  onRowClick,
  getRowClassName,
  className = ''
}: DataTableProps<T>) => {
  // Internal state for client-side features
  const [internalSearchQuery, setInternalSearchQuery] = useState('')
  const [internalSortConfig, setInternalSortConfig] = useState<SortConfig | null>(null)
  const [internalFilterConfig, setInternalFilterConfig] = useState<FilterConfig>({})
  const [internalSelectedRows, setInternalSelectedRows] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // Use external state if provided, otherwise use internal state
  const searchQuery = internalSearchQuery
  const currentSortConfig = sortConfig || internalSortConfig
  const currentFilterConfig = { ...internalFilterConfig, ...filterConfig }
  const currentSelectedRows = selectedRows.length > 0 ? selectedRows : internalSelectedRows

  // Process data for client-side operations
  const processedData = useMemo(() => {
    let filtered = [...data]

    // Apply search filter
    if (searchable && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(row =>
        columns.some(column => {
          const value = typeof column.accessor === 'function'
            ? column.accessor(row)
            : (row as any)[column.accessor]
          return String(value).toLowerCase().includes(query)
        })
      )
    }

    // Apply column filters
    Object.entries(currentFilterConfig).forEach(([columnId, filterValue]) => {
      if (filterValue.trim()) {
        const column = columns.find(col => col.id === columnId)
        if (column) {
          filtered = filtered.filter(row => {
            const value = typeof column.accessor === 'function'
              ? column.accessor(row)
              : (row as any)[column.accessor]
            return String(value).toLowerCase().includes(filterValue.toLowerCase().trim())
          })
        }
      }
    })

    // Apply sorting
    if (currentSortConfig) {
      const column = columns.find(col => col.id === currentSortConfig.key)
      if (column) {
        filtered.sort((a, b) => {
          const aValue = typeof column.accessor === 'function'
            ? column.accessor(a)
            : (a as any)[column.accessor]
          const bValue = typeof column.accessor === 'function'
            ? column.accessor(b)
            : (b as any)[column.accessor]

          let comparison = 0
          if (aValue > bValue) comparison = 1
          if (aValue < bValue) comparison = -1

          return currentSortConfig.direction === 'asc' ? comparison : -comparison
        })
      }
    }

    return filtered
  }, [data, searchQuery, currentFilterConfig, currentSortConfig, columns, searchable])

  // Calculate pagination
  const totalItems = processedData.length
  const currentPage = pagination?.currentPage || 1
  const pageSize = pagination?.pageSize || 25
  const totalPages = Math.ceil(totalItems / pageSize)

  const paginatedData = paginated
    ? processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : processedData

  // Handle sorting
  const handleSort = (columnId: string) => {
    const column = columns.find(col => col.id === columnId)
    if (!column || !column.sortable) return

    let newSortConfig: SortConfig | null = null

    if (!currentSortConfig || currentSortConfig.key !== columnId) {
      newSortConfig = { key: columnId, direction: 'asc' }
    } else if (currentSortConfig.direction === 'asc') {
      newSortConfig = { key: columnId, direction: 'desc' }
    } else {
      newSortConfig = null
    }

    if (onSortChange) {
      onSortChange(newSortConfig)
    } else {
      setInternalSortConfig(newSortConfig)
    }
  }

  // Handle row selection
  const handleRowSelect = (rowId: string, checked: boolean) => {
    let newSelectedRows: string[]

    if (checked) {
      newSelectedRows = [...currentSelectedRows, rowId]
    } else {
      newSelectedRows = currentSelectedRows.filter(id => id !== rowId)
    }

    if (onRowSelect) {
      onRowSelect(newSelectedRows)
    } else {
      setInternalSelectedRows(newSelectedRows)
    }
  }

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    const allRowIds = paginatedData.map((row, index) => getRowId(row, index))
    const newSelectedRows = checked ? allRowIds : []

    if (onRowSelect) {
      onRowSelect(newSelectedRows)
    } else {
      setInternalSelectedRows(newSelectedRows)
    }
  }

  // Handle column filter
  const handleColumnFilter = (columnId: string, value: string) => {
    const newFilterConfig = { ...currentFilterConfig, [columnId]: value }

    if (onFilterChange) {
      onFilterChange(newFilterConfig)
    } else {
      setInternalFilterConfig(newFilterConfig)
    }
  }

  // Get cell value
  const getCellValue = (row: T, column: DataTableColumn<T>) => {
    return typeof column.accessor === 'function'
      ? column.accessor(row)
      : (row as any)[column.accessor]
  }

  // Render sort icon
  const renderSortIcon = (column: DataTableColumn<T>) => {
    if (!column.sortable) return null

    const isSorted = currentSortConfig?.key === column.id
    if (!isSorted) {
      return <ChevronUpDownIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
    }

    return currentSortConfig?.direction === 'asc'
      ? <ChevronUpIcon className="h-4 w-4 text-blue-600" />
      : <ChevronDownIcon className="h-4 w-4 text-blue-600" />
  }

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Table Header */}
      {(title || description || searchable) && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Global Search */}
              {searchable && (
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInternalSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              )}

              {/* Filter Toggle */}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <AdjustmentsHorizontalIcon className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Column Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {columns.filter(col => col.filterable).map(column => (
                  <div key={column.id}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {column.header}
                    </label>
                    <Input
                      type="text"
                      placeholder={`Filter ${column.header.toLowerCase()}...`}
                      value={currentFilterConfig[column.id] || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleColumnFilter(column.id, e.target.value)
                      }
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{loadingText}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && processedData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500 dark:text-gray-400">{emptyText}</p>
        </div>
      )}

      {/* Table */}
      {!loading && processedData.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {/* Selection Column */}
                  {selectable && (
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={currentSelectedRows.length === paginatedData.length && paginatedData.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                  )}

                  {/* Data Columns */}
                  {columns.map(column => (
                    <th
                      key={column.id}
                      className={`
                        px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider
                        ${column.hideOnMobile ? 'hidden md:table-cell' : ''}
                        ${column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 group' : ''}
                      `}
                      style={{ width: column.width }}
                      onClick={() => column.sortable && handleSort(column.id)}
                    >
                      <div className="flex items-center gap-2">
                        <span>{column.header}</span>
                        {renderSortIcon(column)}
                      </div>
                    </th>
                  ))}

                  {/* Actions Column */}
                  {actions.length > 0 && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedData.map((row, index) => {
                  const rowId = getRowId(row, index)
                  const isSelected = currentSelectedRows.includes(rowId)
                  const customClassName = getRowClassName ? getRowClassName(row, index) : ''

                  return (
                    <tr
                      key={rowId}
                      className={`
                        hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                        ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                        ${onRowClick ? 'cursor-pointer' : ''}
                        ${customClassName}
                      `}
                      onClick={() => onRowClick && onRowClick(row, index)}
                    >
                      {/* Selection Cell */}
                      {selectable && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              e.stopPropagation()
                              handleRowSelect(rowId, e.target.checked)
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                      )}

                      {/* Data Cells */}
                      {columns.map(column => {
                        const cellValue = getCellValue(row, column)
                        const cellContent = column.cell
                          ? column.cell(cellValue, row, index)
                          : String(cellValue || '')

                        return (
                          <td
                            key={column.id}
                            className={`
                              px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white
                              ${column.hideOnMobile ? 'hidden md:table-cell' : ''}
                              ${column.align === 'center' ? 'text-center' : ''}
                              ${column.align === 'right' ? 'text-right' : ''}
                            `}
                          >
                            {cellContent}
                          </td>
                        )
                      })}

                      {/* Actions Cell */}
                      {actions.length > 0 && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            {actions.map(action => {
                              if (action.condition && !action.condition(row)) {
                                return null
                              }

                              const Icon = action.icon
                              return (
                                <Button
                                  key={action.id}
                                  variant={action.variant === 'danger' ? 'danger' : 'ghost'}
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    action.onClick(row, index)
                                  }}
                                  className="p-1.5"
                                >
                                  {Icon && <Icon className="h-4 w-4" />}
                                  <span className="sr-only">{action.label}</span>
                                </Button>
                              )
                            })}
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {paginated && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Page Size Selector */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                      Show
                    </label>
                    <select
                      value={pageSize}
                      onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
                      className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white text-sm"
                    >
                      {pageSizeOptions.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      entries
                    </span>
                  </div>

                  {/* Results Info */}
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} results
                  </div>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onPageChange && onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                    Previous
                  </Button>

                  <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                    Page {currentPage} of {totalPages}
                  </span>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onPageChange && onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="flex items-center gap-1"
                  >
                    Next
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}