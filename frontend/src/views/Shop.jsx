import DynamicGrid from '../components/DynamicGrid'
import { ProductsAPI } from '../services/api'
import { useFetch } from '../hooks/useFetch'

export default function Shop() {
  const { data, loading, error } = useFetch(() => ProductsAPI.list(), [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/40">Catálogo</span>
          <h1 className="mt-1 font-display text-4xl font-extrabold tracking-tightest text-ink sm:text-5xl">
            Todo el kit, pieza por pieza.
          </h1>
          <p className="mt-2 max-w-xl text-ink/60">
            Compra el bundle o solo lo que te falta. Stock en vivo, sin sorpresas.
          </p>
        </div>
      </header>
      <DynamicGrid products={data || []} mode="all" loading={loading} error={error} />
    </div>
  )
}
