import DynamicGrid from '../components/DynamicGrid'
import { ProductsAPI } from '../services/api'
import { useFetch } from '../hooks/useFetch'
import { formatCLP } from '../hooks/format'
import { useCart } from '../hooks/useCart'

export default function KitPage() {
  const { data, loading, error } = useFetch(() => ProductsAPI.list(), [])
  const { add } = useCart()
  const kit = data?.find((p) => p.is_kit)
  const parts = (data || []).filter((p) => !p.is_kit)

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/40">El Kit</span>
          <h1 className="mt-2 font-display text-5xl font-extrabold leading-[0.95] tracking-tightest text-ink sm:text-6xl">
            Seis objetos. <span className="text-modo-orange">Una mochila.</span>
          </h1>
          <p className="mt-4 max-w-lg text-ink/70">
            La riñonera Cotopaxi + los seis esenciales que vas a necesitar
            entre que sales de tu casa y llegas al hotel. Nada más.
          </p>
          <p className="mt-6 font-display text-4xl font-extrabold tracking-tightest text-ink">
            {formatCLP(kit?.price || 20000)}
          </p>
          <button
            onClick={() => kit && add(kit, 1)}
            className="mt-6 rounded-full bg-modo-orange px-6 py-3.5 font-semibold text-modo-paper shadow-[0_18px_30px_-12px_rgba(232,84,26,0.5)]"
          >
            Añadir el kit completo al carrito
          </button>
        </div>
        {kit?.image_url && (
          <div className="overflow-hidden rounded-3xl bg-bone-200">
            <img src={kit.image_url} alt={kit.name} className="aspect-square w-full object-cover" />
          </div>
        )}
      </section>

      <section className="mt-20">
        <h2 className="font-display text-3xl font-extrabold tracking-tightest text-ink">Lo que trae</h2>
        <p className="mt-2 max-w-xl text-ink/60">Cada pieza se vende por separado si solo te falta una.</p>
        <div className="mt-8">
          <DynamicGrid products={parts} mode="all" loading={loading} error={error} />
        </div>
      </section>
    </div>
  )
}
