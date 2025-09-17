import { Link, NavLink } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Scale, PlusCircle, User2 } from 'lucide-react'

interface DropdownItem {
  label: string
  to: string
}
interface DropdownMenu {
  id: string
  label: string
  items: DropdownItem[]
}

const dropdowns: DropdownMenu[] = [
  {
    id: 'listing',
    label: 'Listing',
    items: [
      { label: 'Buy', to: '/buy' },
      { label: 'Rent', to: '/rent' },
      { label: 'Sell', to: '/sell' }
    ]
  },
  {
    id: 'property',
    label: 'Property',
    items: [
      { label: 'Featured', to: '/buy' },
      { label: 'Popular Cities', to: '/buy' }
    ]
  }
]

export function Header() {
  const [open, setOpen] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [lang, setLang] = useState<'EN' | 'FR'>('EN')
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(null)
      }
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  // ESC to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function toggle(id: string) {
    setOpen(o => (o === id ? null : id))
  }

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="site-header-inner" ref={containerRef}>
        <div className="site-left">
          <Link to="/" className="brand" aria-label="Property237 Home">Property<span>237</span></Link>
          <nav aria-label="Main" className="primary-nav">
            <NavLink to="/" end className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Home</NavLink>
            {dropdowns.map(dd => (
              <div key={dd.id} className="nav-dropdown">
                <button
                  type="button"
                  className={'nav-link dropdown-trigger' + (open === dd.id ? ' active' : '')}
                  aria-haspopup="true"
                  aria-expanded={open === dd.id}
                  onClick={() => toggle(dd.id)}
                >
                  {dd.label} <ChevronDown size={16} />
                </button>
                {open === dd.id && (
                  <div className="dropdown-panel" role="menu">
                    {dd.items.map(item => (
                      <NavLink
                        key={item.to + item.label}
                        to={item.to}
                        role="menuitem"
                        className={({isActive}) => 'dropdown-link' + (isActive ? ' active' : '')}
                        onClick={() => setOpen(null)}
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <NavLink to="/agents" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Find an Agent</NavLink>
          </nav>
        </div>
        <div className="site-right">
          <NavLink to="/compare" className={({isActive}) => 'nav-link util' + (isActive ? ' active' : '')}><Scale size={16}/> Compare</NavLink>
          <NavLink to="/login" className={({isActive}) => 'nav-link login' + (isActive ? ' active' : '')}><User2 size={16}/> Login / Signup</NavLink>
          <NavLink to="/dashboard/add-property" className="add-btn"><PlusCircle size={18}/> Add Listing</NavLink>
          <button
            type="button"
            className="icon-btn lang-toggle"
            aria-label={`Switch language. Current ${lang}`}
            onClick={() => setLang(l => (l === 'EN' ? 'FR' : 'EN'))}
          >
            {lang}
          </button>
        </div>
      </div>
    </header>
  )
}
export default Header
