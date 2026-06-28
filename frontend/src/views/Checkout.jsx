import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../context/AuthContext'
import { OrdersAPI } from '../services/api'
import { formatCLP } from '../hooks/format'

const REGIONS = [
  { value: 'RM',  label: 'Región Metropolitana' },
  { value: 'I',   label: 'Tarapacá' },
  { value: 'II',  label: 'Antofagasta' },
  { value: 'III',label: 'Atacama' },
  { value: 'IV', label: 'Coquimbo' },
  { value: 'V',  label: 'Valparaíso' },
  { value: 'VI', label: "O'Higgins" },
  { value: 'VII',label: 'Maule' },
  { value: 'VIII',label: 'Biobío' },
  { value: 'IX', label: 'La Araucanía' },
  { value: 'X',  label: 'Los Lagos' },
  { value: 'XI', label: 'Aysén' },
  { value: 'XII',label: 'Magallanes' },
]

const STEPS = ['Carrito', 'Envío', 'Pago', 'Confirmación']

export default function Checkout() {
  const { items, total, count, setQuantity, remove, clear } = useCart()
  const { isAuthenticated, user, profile } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(items.length > 0 ? 1 : 0)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState(null)
  const [orderResult, setOrderResult] = useState(null)

  const [form, setForm] = useState({
    customer_name: profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : '',
    customer_email: user?.email || '',
    customer_phone: '',
    shipping_region: 'RM',
    shipping_address: '',
    notes: '',
  })

  const update = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      navigate('/login?next=/checkout')
      return
    }
    setSubmitting(true)
    setServerError(null)
    try {
      const payload = {
        ...form,
        items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
      }
      const result = await OrdersAPI.create(payload)
      setOrderResult(result)
      clear()
      setStep(3)
    } catch (err) {
      const detail = err?.response?.data?.detail
      setServerError(typeof detail === 'string' ? detail : 'No pudimos procesar tu pedido. Intenta nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  // ============== Confirmation ==============
  if (step === 3 && orderResult) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-modo-teal/15 text-modo-teal">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tightest text-ink">¡Pedido confirmado!</h1>
        <p className="mt-2 text-ink/60">Tu pedido #{orderResult.id} por {formatCLP(orderResult.total_amount)} está en preparación.</p>
        <p className="mt-1 text-sm text-ink/50">Te enviamos los detalles a {orderResult.customer_email}.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/dashboard" className="rounded-full bg-ink px-5 py-3 font-semibold text-modo-paper">Ver mis pedidos</Link>
          <Link to="/" className="rounded-full border border-ink/15 bg-white px-5 py-3 font-semibold text-ink">Seguir comprando</Link>
        </div>
      </div>
    )
  }

  // ============== Empty cart ==============
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-extrabold tracking-tightest text-ink">Tu carrito está vacío</h1>
        <p className="mt-3 text-ink/60">Agrega el kit o cualquier esencial para continuar.</p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-ink px-5 py-3 font-semibold text-modo-paper">
          Explorar
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Stepper step={step} />

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Step 1 — review cart */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold tracking-tightest text-ink">Revisa tu pedido</h2>
              <ul className="divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white">
                {items.map((it) => (
                  <li key={it.id} className="flex items-center gap-4 p-4">
                    {it.image_url && <img src={it.image_url} alt="" className="h-16 w-16 rounded-xl object-cover" />}
                    <div className="flex-1">
                      <p className="font-semibold text-ink">{it.name}</p>
                      <p className="text-sm text-ink/50">{formatCLP(it.price)} c/u</p>
                    </div>
                    <input
                      type="number"
                      min="1"
                      value={it.quantity}
                      onChange={(e) => setQuantity(it.id, Number(e.target.value))}
                      className="w-16 rounded-lg border border-ink/15 px-2 py-1 text-center"
                    />
                    <button onClick={() => remove(it.id)} className="text-sm text-modo-orange hover:underline">Quitar</button>
                  </li>
                ))}
              </ul>
              <div className="flex justify-end">
                <button onClick={() => setStep(2)} className="rounded-full bg-ink px-6 py-3 font-semibold text-modo-paper">
                  Continuar al envío
                </button>
              </div>
            </div>
          )}

          {/* Step 2 — shipping + payment placeholder */}
          {step === 2 && (
            <form onSubmit={submit} className="space-y-4 rounded-2xl border border-ink/10 bg-white p-6">
              <h2 className="font-display text-2xl font-bold tracking-tightest text-ink">Datos de envío</h2>

              {!isAuthenticated && (
                <div className="rounded-2xl border border-modo-yellow/40 bg-modo-yellow/10 p-3 text-sm text-ink/80">
                  Debes{' '}
                  <Link to="/login?next=/checkout" className="font-semibold underline">
                    iniciar sesión
                  </Link>{' '}
                  para confirmar el pedido.
                </div>
              )}

              {serverError && (
                <div className="rounded-2xl border border-modo-orange/30 bg-modo-orange/5 p-3 text-sm text-modo-orange">
                  {serverError}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nombre completo" value={form.customer_name} onChange={update('customer_name')} required />
                <Field label="Teléfono" value={form.customer_phone} onChange={update('customer_phone')} required placeholder="+56 9 ..." />
                <Field label="Email" type="email" value={form.customer_email} onChange={update('customer_email')} required />
                <label className="block">
                  <span className="block text-sm font-medium text-ink">Región</span>
                  <select
                    value={form.shipping_region}
                    onChange={(e) => update('shipping_region')(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-ink outline-none focus:border-ink focus:ring-2 focus:ring-modo-orange/20"
                  >
                    {REGIONS.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </label>
              </div>

              <Field label="Dirección" value={form.shipping_address} onChange={update('shipping_address')} required placeholder="Av. Siempre Viva 742, Depto 4B" />

              <label className="block">
                <span className="block text-sm font-medium text-ink">Notas (opcional)</span>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => update('notes')(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-ink outline-none focus:border-ink focus:ring-2 focus:ring-modo-orange/20"
                />
              </label>

              <div className="rounded-2xl border border-dashed border-ink/15 p-4 text-sm text-ink/60">
                💳 El pago se confirma por correo tras validar stock. Te contactaremos por WhatsApp al número indicado.
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button type="button" onClick={() => setStep(1)} className="text-sm font-semibold text-ink/60 hover:text-ink">
                  ← Volver
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-modo-orange px-6 py-3 font-semibold text-modo-paper shadow-[0_18px_30px_-12px_rgba(232,84,26,0.5)] disabled:opacity-50"
                >
                  {submitting ? 'Procesando…' : `Confirmar pedido · ${formatCLP(total)}`}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Order summary sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-ink/10 bg-white p-6">
            <h3 className="font-display text-lg font-bold text-ink">Resumen</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-ink/70">
                <dt>Productos ({count})</dt>
                <dd>{formatCLP(total)}</dd>
              </div>
              <div className="flex justify-between text-ink/70">
                <dt>Envío</dt>
                <dd className="text-modo-teal">Calculado al confirmar</dd>
              </div>
              <div className="flex justify-between border-t border-ink/10 pt-3 text-base font-semibold text-ink">
                <dt>Total</dt>
                <dd>{formatCLP(total)}</dd>
              </div>
            </dl>
          </div>
          <p className="text-xs text-ink/50">
            Pago seguro vía Webpay, Mercado Pago o transferencia. Stock en tiempo real.
          </p>
        </aside>
      </div>
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

function Stepper({ step }) {
  return (
    <ol className="flex items-center gap-4 text-sm">
      {STEPS.map((s, i) => {
        const active = i === step
        const done = i < step
        return (
          <li key={s} className="flex items-center gap-2">
            <span
              className={`grid h-7 w-7 place-items-center rounded-full font-mono text-xs ${
                done ? 'bg-modo-teal text-modo-paper' :
                active ? 'bg-ink text-modo-paper' : 'bg-ink/10 text-ink/50'
              }`}
            >
              {done ? '✓' : i + 1}
            </span>
            <span className={active || done ? 'text-ink' : 'text-ink/50'}>{s}</span>
            {i < STEPS.length - 1 && <span className="mx-2 h-px w-8 bg-ink/15" />}
          </li>
        )
      })}
    </ol>
  )
}
