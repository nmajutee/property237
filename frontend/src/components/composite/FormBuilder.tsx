import React, { useState } from 'react'
import type { ReactNode } from 'react'

export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'file'
  | 'email'
  | 'phone'
  | 'currency'
  | 'custom'

export interface FormFieldOption {
  id: string
  label: string
  value: any
  disabled?: boolean
}

export interface FormField {
  id: string
  name: string
  label: string
  type: FormFieldType
  required?: boolean
  options?: FormFieldOption[]
  placeholder?: string
  defaultValue?: any
  min?: number
  max?: number
  step?: number
  pattern?: string
  validate?: (value: any, values?: Record<string, any>) => string | null
  conditional?: {
    field: string
    value: any
  }
  customRender?: (props: {
    value: any
    onChange: (value: any) => void
    field: FormField
    values: Record<string, any>
    error?: string | null
  }) => ReactNode
}

export interface FormBuilderProps {
  fields: FormField[]
  initialValues?: Record<string, any>
  onSubmit?: (values: Record<string, any>) => void
  submitLabel?: string
  cancelLabel?: string
  onCancel?: () => void
  loading?: boolean
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
  renderFooter?: (props: {
    values: Record<string, any>
    errors: Record<string, string | null>
    isValid: boolean
    isSubmitting: boolean
  }) => ReactNode
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  fields,
  initialValues = {},
  onSubmit,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  onCancel,
  loading = false,
  disabled = false,
  className = '',
  style,
  renderFooter
}) => {
  const [values, setValues] = useState<Record<string, any>>(() => {
    const v: Record<string, any> = {}
    fields.forEach(f => {
      v[f.name] = initialValues[f.name] ?? f.defaultValue ?? (f.type === 'checkbox' ? false : f.type === 'multiselect' ? [] : '')
    })
    return v
  })
  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validation
  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (value === '' || value === undefined || value === null || (Array.isArray(value) && value.length === 0))) {
      return 'Required'
    }
    if (field.pattern && value && !new RegExp(field.pattern).test(value)) {
      return 'Invalid format'
    }
    if (field.min !== undefined && typeof value === 'number' && value < field.min) {
      return `Minimum: ${field.min}`
    }
    if (field.max !== undefined && typeof value === 'number' && value > field.max) {
      return `Maximum: ${field.max}`
    }
    if (field.validate) {
      return field.validate(value, values)
    }
    return null
  }

  // Conditional logic
  const isFieldVisible = (field: FormField): boolean => {
    if (!field.conditional) return true
    return values[field.conditional.field] === field.conditional.value
  }

  // Handle change
  const handleChange = (name: string, value: any) => {
    setValues(v => ({ ...v, [name]: value }))
    setErrors(e => ({ ...e, [name]: null }))
  }

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string | null> = {}
    fields.forEach(f => {
      if (isFieldVisible(f)) {
        newErrors[f.name] = validateField(f, values[f.name])
      }
    })
    setErrors(newErrors)
    const isValid = Object.values(newErrors).every(err => !err)
    if (isValid && onSubmit) {
      setIsSubmitting(true)
      Promise.resolve(onSubmit(values)).finally(() => setIsSubmitting(false))
    }
  }

  // Render field
  const renderField = (field: FormField) => {
    if (!isFieldVisible(field)) return null
    const value = values[field.name]
    const error = errors[field.name]
    const commonProps = {
      id: field.id,
      name: field.name,
      value,
      onChange: (e: any) => {
        if (field.type === 'checkbox') {
          handleChange(field.name, e.target.checked)
        } else if (field.type === 'file') {
          handleChange(field.name, e.target.files?.[0] ?? null)
        } else if (field.type === 'multiselect') {
          const selected = Array.from(e.target.selectedOptions || []).map((o: any) => o.value)
          handleChange(field.name, selected)
        } else if (field.type === 'number' || field.type === 'currency') {
          const num = e.target.value === '' ? '' : Number(e.target.value)
          handleChange(field.name, isNaN(num as number) ? '' : num)
        } else {
          handleChange(field.name, e.target.value)
        }
      },
      disabled: disabled || loading,
      placeholder: field.placeholder,
      className: `block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${error ? 'border-red-500' : 'border-gray-300'} ${field.type === 'checkbox' ? 'w-auto' : ''}`
    }
    if (field.customRender) {
      return (
        <div key={field.id} className="mb-4">
          <label htmlFor={field.id} className="block font-medium mb-1">{field.label}{field.required && <span className="text-red-500 ml-1">*</span>}</label>
          {field.customRender({ value, onChange: v => handleChange(field.name, v), field, values, error })}
          {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
        </div>
      )
    }
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'currency':
      case 'date':
      case 'number':
        return (
          <div key={field.id} className="mb-4">
            <label htmlFor={field.id} className="block font-medium mb-1">{field.label}{field.required && <span className="text-red-500 ml-1">*</span>}</label>
            <input type={field.type === 'currency' ? 'number' : field.type} {...commonProps} />
            {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
          </div>
        )
      case 'textarea':
        return (
          <div key={field.id} className="mb-4">
            <label htmlFor={field.id} className="block font-medium mb-1">{field.label}{field.required && <span className="text-red-500 ml-1">*</span>}</label>
            <textarea {...commonProps} rows={3} />
            {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
          </div>
        )
      case 'select':
        return (
          <div key={field.id} className="mb-4">
            <label htmlFor={field.id} className="block font-medium mb-1">{field.label}{field.required && <span className="text-red-500 ml-1">*</span>}</label>
            <select {...commonProps}>
              <option value="">Select...</option>
              {field.options?.map(opt => (
                <option key={opt.id} value={opt.value} disabled={opt.disabled}>{opt.label}</option>
              ))}
            </select>
            {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
          </div>
        )
      case 'multiselect':
        return (
          <div key={field.id} className="mb-4">
            <label htmlFor={field.id} className="block font-medium mb-1">{field.label}{field.required && <span className="text-red-500 ml-1">*</span>}</label>
            <select {...commonProps} multiple>
              {field.options?.map(opt => (
                <option key={opt.id} value={opt.value} disabled={opt.disabled}>{opt.label}</option>
              ))}
            </select>
            {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
          </div>
        )
      case 'checkbox':
        return (
          <div key={field.id} className="mb-4 flex items-center">
            <input type="checkbox" {...commonProps} checked={!!value} />
            <label htmlFor={field.id} className="ml-2 font-medium">{field.label}{field.required && <span className="text-red-500 ml-1">*</span>}</label>
            {error && <div className="text-xs text-red-500 ml-2">{error}</div>}
          </div>
        )
      case 'radio':
        return (
          <div key={field.id} className="mb-4">
            <label className="block font-medium mb-1">{field.label}{field.required && <span className="text-red-500 ml-1">*</span>}</label>
            <div className="flex flex-wrap gap-4">
              {field.options?.map(opt => (
                <label key={opt.id} className="flex items-center">
                  <input
                    type="radio"
                    name={field.name}
                    value={opt.value}
                    checked={value === opt.value}
                    onChange={() => handleChange(field.name, opt.value)}
                    disabled={disabled || loading || opt.disabled}
                  />
                  <span className="ml-2">{opt.label}</span>
                </label>
              ))}
            </div>
            {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
          </div>
        )
      case 'file':
        return (
          <div key={field.id} className="mb-4">
            <label htmlFor={field.id} className="block font-medium mb-1">{field.label}{field.required && <span className="text-red-500 ml-1">*</span>}</label>
            <input type="file" {...commonProps} />
            {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
          </div>
        )
      case 'custom':
        if (typeof field.customRender === 'function') {
          const renderFn = field.customRender as (props: {
            value: any
            onChange: (value: any) => void
            field: FormField
            values: Record<string, any>
            error?: string | null
          }) => ReactNode
          return renderFn({
            value,
            onChange: (v: any) => handleChange(field.name, v),
            field,
            values,
            error
          })
        }
        return null
      default:
        return null
    }
  }

  // Render form
  const isValid = Object.values(errors).every(err => !err)

  return (
    <form className={`w-full ${className}`} style={style} onSubmit={handleSubmit}>
      {fields.map(renderField)}
      {renderFooter ? (
        renderFooter({ values, errors, isValid, isSubmitting })
      ) : (
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:bg-gray-300"
            disabled={loading || disabled || isSubmitting}
          >
            {loading || isSubmitting ? 'Submitting...' : submitLabel}
          </button>
          {onCancel && (
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
              onClick={onCancel}
              disabled={loading || disabled || isSubmitting}
            >
              {cancelLabel}
            </button>
          )}
        </div>
      )}
    </form>
  )
}
