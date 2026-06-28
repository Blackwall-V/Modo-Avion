import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { signUp, syncProfile } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await signUp(email, password, name)
      // Best-effort profile sync — we have the user now.
      try {
        await syncProfile({ first_name: name.split(' ')[0] || '', last_name: name.split(' ').slice(1).join(' ') })
      } catch (_) { /* non-fatal */ }
      navigate('/dashboard')
    } catch (err) {
      setError(prettyAuthError(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto grid min-h-[80vh] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="hidden bg-ink p-12 text-modo-paper lg:block lg:rounded-3xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-modo-yellow">Nuevo pasajero</span>
        <h1 className="mt-3 font-display text-5xl font-extrabold leading-[0.95] tracking-tightest">
          Crea tu <span className="text-modo-orange">boarding pass.</span>
        </h1>
        <p className="mt-4 max-w-md text-modo-paper/60">
          Regístrate para comprar más rápido, seguir tus pedidos y recibir
          ofertas que valen la pena (no las típicas).
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <h2 className="font-display text-3xl font-extrabold tracking-tightest text-ink">Crear cuenta</h2>

        {error && (
          <div className="rounded-2xl border border-modo-orange/30 bg-modo-orange/5 p-3 text-sm text-modo-orange">{error}</div>
        )}

        <Field label="Nombre" value={name} onChange={setName} placeholder="Sofía Pérez" required />
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="tu@correo.cl" required />
        <Field label="Contraseña" type="password" value={password} onChange={setPassword} placeholder="Mínimo 8 caracteres" required minLength={8} />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-ink px-5 py-3 font-semibold text-modo-paper transition-transform active:translate-y-px disabled:opacity-50"
        >
          {submitting ? 'Creando…' : 'Crear cuenta'}
        </button>

        <p className="text-center text-sm text-ink/60">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-semibold text-ink underline decoration-modo-orange decoration-2 underline-offset-4">
            Ingresa
          </Link>
        </p>
      </form>
    </div>
  )
}

function Field({ label, type = 'text', value, onChange, ...rest }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-ink outline-none transition-colors focus:border-ink focus:ring-2 focus:ring-modo-orange/20"
        {...rest}
      />
    </label>
  )
}

function prettyAuthError(err) {
  const code = err?.code || ''
  const map = {
    'auth/email-already-in-use': 'Ya existe una cuenta con ese email.',
    'auth/invalid-email': 'El email no es válido.',
    'auth/weak-password': 'La contraseña debe tener al menos 8 caracteres.',
    'auth/network-request-failed': 'Error de red. Revisa tu conexión.',
  }
  return map[code] || err?.message || 'No pudimos crear la cuenta.'
}
