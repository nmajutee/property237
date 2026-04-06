'use client'

import { useTranslation } from '@/lib/i18n'

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation()

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}
      className="px-2 py-1 text-sm font-medium rounded border border-gray-300 hover:bg-gray-100 transition-colors"
      title={locale === 'en' ? 'Passer en français' : 'Switch to English'}
    >
      {locale === 'en' ? 'FR' : 'EN'}
    </button>
  )
}
