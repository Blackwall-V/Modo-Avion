import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isFirebaseConfigured } from '../services/firebase'

export default function Login() {
  const { signIn, resetPassword, error } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [localError, setLocalError] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setLocalError(null)
    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (err) {
      setLocalError(prettyAuthError(err))
    } finally {
      setSubmitting(false)
    }
  }

  const onReset = async () => {
    if (!email) {
      setLocalError('Ingresa tu email para enviarte el enlace de recuperación.')
      return
    }
    setLocalError(null)
    try {
      await resetPassword(email)
      setResetSent(true)
    } catch (err) {
      setLocalError(prettyAuthError(err))
    }
  }

  return (
    <div className="mx-auto grid min-h-[80vh] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="hidden bg-ink p-12 text-modo-paper lg:block lg:rounded-3xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-modo-yellow">Acceso</span>
        <h1 className="mt-3 font-display text-5xl font-extrabold leading-[0.95] tracking-tightest">
          Bienvenido de vuelta al <span className="text-modo-orange">modo avión.</span>
        </h1>
        <p className="mt-4 max-w-md text-modo-paper/60">
          Inicia sesión para ver tus pedidos, modificar tus datos de envío y
          desbloquear despacho express.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <h2 className="font-display text-3xl font-extrabold tracking-tightest text-ink">Ingresar</h2>

        {!isFirebaseConfigured && (
          <div className="rounded-2xl border border-modo-orange/30 bg-modo-orange/5 p-4 text-sm text-ink/80">
            Firebase no está configurado. Copia <code>.env.example</code> a <code>.env</code> y completa las variables <code>VITE_FIREBASE_*</code>.
          </div>
        )}

        {(localError || error) && (
          <div className="rounded-2xl border border-modo-orange/30 bg-modo-orange/5 p-3 text-sm text-modo-orange">
            {localError || error}
          </div>
        )}
        {resetSent && (
          <div className="rounded-2xl border border-modo-teal/30 bg-modo-teal/5 p-3 text-sm text-modo-teal">
            Te enviamos un enlace para restablecer tu contraseña.
          </div>
        )}

        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="tu@correo.cl" required />
        <Field label="Contraseña" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />

        <div className="flex items-center justify-between text-sm">
          <button type="button" onClick={onReset} className="text-ink/60 underline-offset-4 hover:text-ink hover:underline">
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-ink px-5 py-3 font-semibold text-modo-paper transition-transform active:translate-y-px disabled:opacity-50"
        >
          {submitting ? 'Ingresando…' : 'Ingresar'}
        </button>

        <p className="text-center text-sm text-ink/60">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="font-semibold text-ink underline decoration-modo-orange decoration-2 underline-offset-4">
            Regístrate
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
    'auth/invalid-email': 'El email no es válido.',
    'auth/user-not-found': 'No encontramos una cuenta con ese email.',
    'auth/wrong-password': 'Contraseña incorrecta.',
    'auth/too-many-requests': 'Demasiados intentos. Intenta en unos minutos.',
    'auth/network-request-failed': 'Error de red. Revisa tu conexión.',
  }
  return map[code] || err?.message || 'No pudimos completar la operación.'
}
