'use client'

import React, { useRef, useState } from 'react'
import { Button } from './Button'
import { cn } from '../../design-system/utils'
import {
  CloudArrowUpIcon,
  DocumentIcon,
  PhotoIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export interface UploadedFile {
  id: string
  file: File
  preview?: string
  status: 'uploading' | 'success' | 'error'
  error?: string
}

interface FileUploadProps {
  label?: string
  description?: string
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  maxFiles?: number
  files: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
  error?: string
  required?: boolean
  className?: string
}

const ALLOWED_TYPES = {
  'image/jpeg': { icon: PhotoIcon, name: 'JPEG Image' },
  'image/png': { icon: PhotoIcon, name: 'PNG Image' },
  'image/webp': { icon: PhotoIcon, name: 'WebP Image' },
  'application/pdf': { icon: DocumentIcon, name: 'PDF Document' },
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  description,
  accept = 'image/*,.pdf',
  multiple = true,
  maxSize = 8 * 1024 * 1024, // 8MB
  maxFiles = 5,
  files,
  onFilesChange,
  error,
  required,
  className
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const generateFileId = () => Math.random().toString(36).substring(2, 15)

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
    }

    // Check file type
    if (accept && !accept.includes('*')) {
      const acceptedTypes = accept.split(',').map(type => type.trim())
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase())
        }
        return file.type === type
      })

      if (!isAccepted) {
        return 'File type not supported'
      }
    }

    return null
  }

  const createFilePreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = () => resolve(undefined)
        reader.readAsDataURL(file)
      } else {
        resolve(undefined)
      }
    })
  }

  const processFiles = async (fileList: FileList) => {
    const newFiles: UploadedFile[] = []

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      const validation = validateFile(file)

      if (validation) {
        newFiles.push({
          id: generateFileId(),
          file,
          status: 'error',
          error: validation
        })
      } else {
        const preview = await createFilePreview(file)
        newFiles.push({
          id: generateFileId(),
          file,
          preview,
          status: 'success'
        })
      }
    }

    // Respect maxFiles limit
    const totalFiles = files.length + newFiles.length
    if (totalFiles > maxFiles) {
      const allowedNewFiles = maxFiles - files.length
      newFiles.splice(allowedNewFiles)
    }

    onFilesChange([...files, ...newFiles])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (fileList && fileList.length > 0) {
      processFiles(fileList)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const fileList = e.dataTransfer.files
    if (fileList && fileList.length > 0) {
      processFiles(fileList)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const removeFile = (id: string) => {
    onFilesChange(files.filter(file => file.id !== id))
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (file: File) => {
    const fileType = ALLOWED_TYPES[file.type as keyof typeof ALLOWED_TYPES]
    const Icon = fileType?.icon || DocumentIcon
    return Icon
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Label */}
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}

      {/* Upload Area */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
          dragOver && 'border-primary-500 bg-primary-50 dark:bg-primary-950',
          !dragOver && 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
          error && 'border-red-300 dark:border-red-600'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Drop files here or click to upload
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Supports: JPG, PNG, PDF (max {Math.round(maxSize / 1024 / 1024)}MB each)
          </p>
          {maxFiles > 1 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Maximum {maxFiles} files
            </p>
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((uploadedFile) => {
            const Icon = getFileIcon(uploadedFile.file)

            return (
              <div
                key={uploadedFile.id}
                className={cn(
                  'flex items-center space-x-3 p-3 rounded-lg border',
                  uploadedFile.status === 'success' && 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
                  uploadedFile.status === 'error' && 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
                  uploadedFile.status === 'uploading' && 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
                )}
              >
                {/* File Preview/Icon */}
                <div className="flex-shrink-0">
                  {uploadedFile.preview ? (
                    <img
                      src={uploadedFile.preview}
                      alt={uploadedFile.file.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <Icon className="w-10 h-10 text-gray-400" />
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(uploadedFile.file.size)}
                  </p>
                  {uploadedFile.error && (
                    <p className="text-xs text-red-600 dark:text-red-400 flex items-center mt-1">
                      <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                      {uploadedFile.error}
                    </p>
                  )}
                </div>

                {/* Status/Remove Button */}
                <div className="flex-shrink-0">
                  {uploadedFile.status === 'uploading' ? (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(uploadedFile.id)
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}