'use client'

import React, { useState } from 'react'
import { cn } from '../../../design-system/utils'
import { useTenantForm } from './TenantFormContext'
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'

const IconInput: React.FC<{
  icon: React.ReactNode
  type?: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
}> = ({ icon, type = 'text', placeholder, value, onChange, error, required }) => {
  const [show, setShow] = useState(false)
  const inputType = type === 'password' && show ? 'text' : type

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <span className="h-5 w-5">{icon}</span>
        </div>
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={cn(
            'block w-full pl-10 pr-12 py-3 border rounded-lg bg-white dark:bg-gray-800',
            'text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-property237-primary focus:border-transparent',
            error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
          )}
        />
        {type === 'password' && (
          <button
            type="button"
            aria-label={show ? 'Hide password' : 'Show password'}
            onClick={() => setShow(!show)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <span className="h-5 w-5">{show ? <EyeSlashIcon /> : <EyeIcon />}</span>
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

const validateEmail = (email: string) => {
  const r = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) return 'Email is required'
  if (!r.test(email)) return 'Enter a valid email'
}

const validatePhone = (phone: string) => {
  const r = /^[+]?\d{6,16}$/
  if (!phone) return 'Phone number is required'
  if (!r.test(phone)) return 'Enter a valid phone number'
}

const validatePassword = (pwd: string) => {
  if (!pwd) return 'Password is required'
  if (pwd.length < 8) return 'Must be at least 8 characters'
  if (!/[a-z]/.test(pwd)) return 'Include a lowercase letter'
  if (!/[A-Z]/.test(pwd)) return 'Include an uppercase letter'
  if (!/\d/.test(pwd)) return 'Include a number'
}

const validateUsername = (u: string) => {
  const r = /^[a-zA-Z0-9_]{3,20}$/
  if (!u) return 'Username is required'
  if (!r.test(u)) return '3-20 chars: letters, numbers, _'
}

export const Step1PersonalInfo: React.FC = () => {
  const { state, updatePersonalInfo } = useTenantForm()
  const p = state.personalInfo
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const onField = (field: keyof typeof p, value: string) => {
    updatePersonalInfo({ [field]: value })
    setTouched((t) => ({ ...t, [field]: true }))
    let err: string | undefined
    if (field === 'username') err = validateUsername(value)
    if (field === 'full_name') err = !value ? 'Full name is required' : undefined
    if (field === 'email') err = validateEmail(value)
    if (field === 'phone_number') err = validatePhone(value)
    if (field === 'password') err = validatePassword(value)
    if (field === 'confirm_password') err = value !== p.password ? 'Passwords do not match' : undefined
    setErrors((e) => ({ ...e, [field]: err }))
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-h2 font-display">Create Your Account</h2>
        <p className="text-body font-display">Start with your personal information.</p>
      </div>

      <IconInput icon={<UserIcon />} placeholder="Username" value={p.username} onChange={(v)=>onField('username',v)} error={touched.username?errors.username:undefined} required />
      <IconInput icon={<UserIcon />} placeholder="Full name" value={p.full_name} onChange={(v)=>onField('full_name',v)} error={touched.full_name?errors.full_name:undefined} required />
      <IconInput icon={<EnvelopeIcon />} type="email" placeholder="Email" value={p.email} onChange={(v)=>onField('email',v)} error={touched.email?errors.email:undefined} required />
      <IconInput icon={<PhoneIcon />} type="tel" placeholder="Phone number" value={p.phone_number} onChange={(v)=>onField('phone_number',v)} error={touched.phone_number?errors.phone_number:undefined} required />
      <IconInput icon={<LockClosedIcon />} type="password" placeholder="Password" value={p.password} onChange={(v)=>onField('password',v)} error={touched.password?errors.password:undefined} required />
      <IconInput icon={<LockClosedIcon />} type="password" placeholder="Confirm password" value={p.confirm_password} onChange={(v)=>onField('confirm_password',v)} error={touched.confirm_password?errors.confirm_password:undefined} required />

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Password Requirements</h4>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>At least 8 characters</li>
          <li>One lowercase and one uppercase letter</li>
          <li>One number</li>
        </ul>
      </div>
    </div>
  )
}

export default Step1PersonalInfo
