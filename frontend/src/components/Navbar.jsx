import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../hooks/useCart'

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/kit', label: 'El Kit' },
  { to: '/shop', label: 'Tienda' },
  { to: '/contacto', label: 'Contacto' },
]

export default function Navbar() {
  const { isAuthenticated, user, signOut } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-modo-paper/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tightest text-ink">
          <span aria-hidden className="grid h-8 w-8 place-items-center rounded-full bg-modo-orange text-modo-paper">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" transform="rotate(-45 12 12)" />
            </svg>
          </span>
          <span>MODO AVIÓN</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-ink' : 'text-ink/60 hover:text-ink'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/checkout"
            className="relative grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-ink/80 transition-colors hover:bg-ink hover:text-modo-paper"
            aria-label={`Carrito (${count})`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-modo-orange px-1 text-[10px] font-bold text-modo-paper">
                {count}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="hidden rounded-full border border-ink/15 px-3 py-1.5 text-sm font-medium text-ink/80 transition-colors hover:bg-ink hover:text-modo-paper sm:inline-flex"
              >
                Hola, {user?.displayName?.split(' ')[0] || user?.email?.split('@')[0]}
              </Link>
              <button
                onClick={async () => { await signOut(); navigate('/') }}
                className="rounded-full bg-ink px-3 py-1.5 text-sm font-semibold text-modo-paper transition-transform active:translate-y-px"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-ink px-3 py-1.5 text-sm font-semibold text-modo-paper transition-transform active:translate-y-px"
            >
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
