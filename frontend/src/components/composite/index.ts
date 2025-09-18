// Composite Components
// These components are built using primitive components and implement
// complex functionality for specific use cases.

export { PropertyCard } from './PropertyCard'
export type { PropertyCardProps } from './PropertyCard'

// NavigationBar Component
export { NavigationBar } from './NavigationBar'
export type { NavigationBarProps } from './NavigationBar'

// DataTable Component
export { DataTable } from './DataTable'
export type { DataTableProps, DataTableColumn, RowAction, SortConfig, FilterConfig, PaginationConfig } from './DataTable'

// SearchBar Component
export { SearchBar } from './SearchBar'
export type { SearchBarProps, SearchSuggestion, FilterGroup, SearchResult } from './SearchBar'

// Modal System Components
export { Modal } from './Modal'
export type { ModalProps } from './Modal'

export {
  DialogHeader,
  DialogContent,
  DialogFooter,
  ModalDialog
} from './DialogComponents'
export type {
  DialogHeaderProps,
  DialogContentProps,
  DialogFooterProps,
  ModalDialogProps
} from './DialogComponents'

export {
  ConfirmDialog,
  AlertDialog,
  ImageModal,
  FormModal
} from './ModalVariants'
export type {
  ConfirmDialogProps,
  AlertDialogProps,
  ImageModalProps,
  FormModalProps
} from './ModalVariants'

// FormBuilder Component
export { FormBuilder } from './FormBuilder'
export type { FormBuilderProps, FormField, FormFieldType, FormFieldOption } from './FormBuilder'

// Re-export related types
export type {
  PropertyListing,
  PropertyViewMode,
  PropertyFilters
} from '../../types/property'