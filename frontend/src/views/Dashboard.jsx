import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { OrdersAPI } from '../services/api'
import { useFetch } from '../hooks/useFetch'
import { formatCLP } from '../hooks/format'

const STATUS_TONE = {
  pending:   'bg-modo-yellow/20 text-ink border-modo-yellow/40',
  paid:      'bg-modo-teal/10 text-modo-teal border-modo-teal/30',
  shipped:   'bg-modo-orange/10 text-modo-orange border-modo-orange/30',
  delivered: 'bg-ink/5 text-ink/70 border-ink/15',
  cancelled: 'bg-ink/5 text-ink/40 border-ink/10',
}

export default function Dashboard() {
  const { user, profile, status } = useAuth()
  const { data: orders, loading, error, refresh } = useFetch(() => OrdersAPI.list(), [])

  if (status === 'loading') {
    return <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">Cargando…</div>
  }
  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-extrabold tracking-tightest text-ink">Necesitas iniciar sesión</h1>
        <p className="mt-3 text-ink/60">Ingresa para ver tu panel de pedidos y perfil.</p>
        <Link to="/login" className="mt-6 inline-block rounded-full bg-ink px-5 py-3 font-semibold text-modo-paper">
          Ingresar
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-2 border-b border-ink/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/40">Panel</span>
          <h1 className="mt-1 font-display text-4xl font-extrabold tracking-tightest text-ink">
            Hola, {profile?.first_name || user.displayName || user.email.split('@')[0]}.
          </h1>
          <p className="mt-2 text-ink/60">Acá ves tus pedidos y datos de envío.</p>
        </div>
        <button onClick={refresh} className="self-start text-sm font-semibold text-ink underline decoration-modo-orange decoration-2 underline-offset-4 sm:self-auto">
          Actualizar
        </button>
      </header>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold tracking-tightest text-ink">Tus pedidos</h2>

        {loading && <p className="mt-4 text-ink/60">Cargando pedidos…</p>}
        {error && <p className="mt-4 text-modo-orange">{error}</p>}

        {!loading && (orders?.length ?? 0) === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-ink/15 p-10 text-center">
            <p className="text-ink/60">Aún no tienes pedidos.</p>
            <Link to="/" className="mt-4 inline-block rounded-full bg-ink px-5 py-3 font-semibold text-modo-paper">
              Explorar el kit
            </Link>
          </div>
        )}

        <ul className="mt-6 space-y-4">
          {(orders || []).map((o) => (
            <li key={o.id} className="rounded-2xl border border-ink/10 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-ink/40">Pedido #{o.id}</p>
                  <p className="mt-1 font-display text-xl font-bold text-ink">{formatCLP(o.total_amount)}</p>
                  <p className="text-sm text-ink/60">{new Date(o.created_at).toLocaleString('es-CL')}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${STATUS_TONE[o.status] || STATUS_TONE.pending}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {o.status}
                </span>
              </div>

              <ul className="mt-4 divide-y divide-ink/10 border-t border-ink/10">
                {o.items.map((it) => (
                  <li key={it.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                    <span className="text-ink/80">{it.quantity} × {it.product_name}</span>
                    <span className="font-mono text-ink/70">{formatCLP(it.line_total)}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-3 text-xs text-ink/50">Envío a: {o.shipping_address} ({o.shipping_region})</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
