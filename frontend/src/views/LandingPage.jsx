import { Link } from 'react-router-dom'
import { ProductsAPI } from '../services/api'
import { useFetch } from '../hooks/useFetch'
import { formatCLP } from '../hooks/format'
import DynamicGrid from '../components/DynamicGrid'
import { useCart } from '../hooks/useCart'

const badges = [
  { code: 'SCL', city: 'Santiago' },
  { code: 'EZE', city: 'Buenos Aires' },
  { code: 'LIM', city: 'Lima' },
  { code: 'MEX', city: 'Ciudad de México' },
  { code: 'JFK', city: 'New York' },
  { code: 'BCN', city: 'Barcelona' },
  { code: 'NRT', city: 'Tokyo' },
  { code: 'SYD', city: 'Sydney' },
]

const perks = [
  {
    title: 'Curado por viajeros',
    body: 'Cada objeto del kit pasó por 6 meses de uso real. Sobrevive al carry-on, no al unboxing.',
  },
  {
    title: 'Pesa menos que tu laptop',
    body: '460g total. Cabe en la riñonera, sale con la mano del bolsillo trasero.',
  },
  {
    title: 'Garantía de por vida',
    body: 'Si algo falla, te lo cambiamos. Sin ticket, sin formulario de 14 pasos.',
  },
]

export default function LandingPage() {
  const { data, loading, error } = useFetch(() => ProductsAPI.list(), [])
  const { add } = useCart()
  const kit = data?.find((p) => p.is_kit)

  return (
    <div className="space-y-24">
      {/* =================== HERO =================== */}
      <section className="relative overflow-hidden bg-modo-paper">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-20 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8 lg:pt-28">
          <div className="lg:col-span-7 animate-fade-up">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/70">
                <span className="h-1.5 w-1.5 rounded-full bg-modo-orange animate-pulse-soft" />
                Edición Verano 2026
              </span>
            </div>

            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[0.95] tracking-tightest text-ink sm:text-6xl lg:text-7xl">
              MODO AVIÓN
              <span className="block text-ink/40">Tu mejor compañero</span>
              <span className="block">
                de <span className="text-modo-orange">aventuras.</span>
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-ink/70">
              Seis esenciales de viaje, una riñonera Cotopaxi. Pesa 460g, sobrevive
              al carry-on, y cabe donde no cabe nada. <span className="font-medium text-ink">$20.000</span> y se va contigo.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => kit && add(kit, 1)}
                className="group inline-flex items-center gap-2 rounded-full bg-modo-orange px-6 py-3.5 font-semibold text-modo-paper shadow-[0_18px_30px_-12px_rgba(232,84,26,0.5)] transition-all hover:-translate-y-0.5 active:translate-y-px"
              >
                Comprar ahora — {formatCLP(kit?.price || 20000)}
                <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </button>
              <Link
                to="/kit"
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-5 py-3.5 font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-modo-paper"
              >
                Ver qué incluye
              </Link>
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 text-sm">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-ink/40">Peso</dt>
                <dd className="mt-1 font-display text-2xl font-bold text-ink">460g</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-ink/40">Items</dt>
                <dd className="mt-1 font-display text-2xl font-bold text-ink">6</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-ink/40">Envío</dt>
                <dd className="mt-1 font-display text-2xl font-bold text-ink">24-48h</dd>
              </div>
            </dl>
          </div>

          {/* Hero image / visual */}
          <div className="relative lg:col-span-5">
            <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-modo-yellow/60 blur-2xl" aria-hidden />
            <div className="absolute -bottom-10 -right-6 h-32 w-32 rounded-full bg-modo-orange/40 blur-3xl" aria-hidden />

            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-bone-200 shadow-[0_50px_100px_-30px_rgba(15,15,16,0.45)]">
              {kit?.image_url ? (
                <img src={kit.image_url} alt={kit.name} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center text-ink/30">Sin imagen</div>
              )}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 rounded-2xl bg-modo-paper/95 p-4 backdrop-blur">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-ink/40">Equipaje de mano</p>
                  <p className="font-display text-base font-bold text-ink">{kit?.name || 'KIT MODO AVIÓN'}</p>
                </div>
                <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs font-bold text-modo-paper">
                  {formatCLP(kit?.price || 20000)}
                </span>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -left-4 top-10 hidden rotate-[-8deg] rounded-2xl border border-ink bg-modo-paper px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-ink shadow-lg sm:block">
              <span className="block text-ink/40">Gate B12</span>
              <span className="block font-bold">Boarding now</span>
            </div>
          </div>
        </div>

        {/* Marquee of airports — single horizontal strip, ≤1 marquee per page */}
        <div className="overflow-hidden border-y border-ink/10 bg-ink py-3 text-modo-paper">
          <div className="flex w-max animate-marquee gap-10 px-6 font-mono text-xs uppercase tracking-[0.3em]">
            {[...badges, ...badges].map((b, i) => (
              <span key={i} className="flex items-center gap-3">
                <span className="text-modo-yellow">●</span>
                {b.code}
                <span className="text-modo-paper/40">— {b.city}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* =================== DYNAMIC GRID =================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tightest text-ink sm:text-4xl">
              El kit completo
            </h2>
            <p className="mt-2 max-w-xl text-ink/60">
              Cada pieza es funcional por sí sola. Juntas, reemplazan el 80% de tu maleta.
            </p>
          </div>
          <Link
            to="/shop"
            className="self-start text-sm font-semibold text-ink underline decoration-modo-orange decoration-2 underline-offset-4 hover:text-modo-orange sm:self-auto"
          >
            Comprar por separado →
          </Link>
        </div>

        <DynamicGrid products={data || []} mode="kit" loading={loading} error={error} />
      </section>

      {/* =================== PERKS =================== */}
      <section className="bg-ink py-20 text-modo-paper">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {perks.map((p, i) => (
              <div key={p.title} className="border-l border-modo-paper/15 pl-6">
                <span className="font-mono text-xs text-modo-yellow">0{i + 1}</span>
                <h3 className="mt-2 font-display text-2xl font-bold tracking-tightest">{p.title}</h3>
                <p className="mt-3 text-modo-paper/60">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
