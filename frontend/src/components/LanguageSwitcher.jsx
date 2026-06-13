import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हिंदी' },
]

export default function LanguageSwitcher({ variant = 'light' }) {
  const { i18n } = useTranslation()
  const isDark = variant === 'dark'

  return (
    <div
      className={`flex items-center gap-1 rounded-full p-1 ${
        isDark ? 'bg-slate-700/80' : 'bg-primary-50 border border-primary-100'
      }`}
    >
      <Languages className={`w-3.5 h-3.5 ml-1.5 ${isDark ? 'text-slate-400' : 'text-primary-500'}`} />
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => i18n.changeLanguage(code)}
          className={`px-2.5 py-1 rounded-full text-xs font-bold transition min-h-[32px] min-w-[40px] ${
            i18n.language === code
              ? isDark
                ? 'bg-accent-500 text-white shadow-sm'
                : 'bg-white text-primary-700 shadow-sm'
              : isDark
                ? 'text-slate-300 hover:text-white'
                : 'text-primary-600 hover:text-primary-800'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
