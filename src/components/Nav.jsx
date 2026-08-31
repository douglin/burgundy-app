import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Map', end: true },
  { to: '/log', label: 'Tasting Log' },
  { to: '/cellar', label: 'Cellar' },
  { to: '/vintages', label: 'Vintages' },
  { to: '/quiz', label: 'Quiz' },
  { to: '/producers', label: 'Producers' },
  { to: '/decode', label: 'Decode' },
  { to: '/learn', label: 'Learn' },
]

function linkCls({ isActive }) {
  return `text-xs tracking-widest uppercase transition-colors pb-0.5 ${
    isActive
      ? 'text-[#6B0F1A] font-semibold border-b border-[#C9A84C]'
      : 'text-[#6B5244] hover:text-[#6B0F1A]'
  }`
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Close drawer on navigation
  function handleNavClick() {
    setOpen(false)
  }

  return (
    <header className="bg-[#F5F0E8] border-b border-[#D4C5A9] relative z-30">
      <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col items-center gap-3">
        <div className="w-full flex items-center justify-center relative">
          {/* Hamburger — mobile only */}
          <button
            className="sm:hidden absolute left-0 flex flex-col gap-1.5 p-1 text-[#6B5244] hover:text-[#6B0F1A] transition-colors"
            aria-label="Menu"
            onClick={() => setOpen(o => !o)}
          >
            {open ? (
              /* X icon */
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="4" x2="18" y2="18" />
                <line x1="18" y1="4" x2="4" y2="18" />
              </svg>
            ) : (
              /* Hamburger icon */
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="19" y2="6" />
                <line x1="3" y1="11" x2="19" y2="11" />
                <line x1="3" y1="16" x2="19" y2="16" />
              </svg>
            )}
          </button>

          {/* Wordmark */}
          <div className="flex items-center gap-3">
            <span className="text-[#C9A84C] text-lg">✦</span>
            <span
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-[#6B0F1A] text-2xl font-bold tracking-[0.15em] uppercase"
            >
              Burgundy
            </span>
            <span className="text-[#C9A84C] text-lg">✦</span>
          </div>
        </div>

        <div className="h-px w-48 bg-[#C9A84C] opacity-60" />

        {/* Desktop nav */}
        <nav className="hidden sm:flex gap-6">
          {links.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={linkCls}>
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="sm:hidden absolute top-full left-0 right-0 bg-[#F5F0E8] border-b border-[#D4C5A9] shadow-md">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `block px-6 py-3.5 text-xs tracking-widest uppercase border-b border-[#EDE6D6] transition-colors ${
                  isActive
                    ? 'text-[#6B0F1A] font-semibold bg-[#EDE6D6]'
                    : 'text-[#6B5244] hover:text-[#6B0F1A] hover:bg-[#EDE6D6]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
