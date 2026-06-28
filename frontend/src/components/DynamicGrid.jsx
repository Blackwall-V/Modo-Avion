import ProductCard from './ProductCard'

/**
 * Renders a responsive product grid. Three layout modes:
 * - kit      → 1 hero card (the bundle) + standard cards beneath
 * - all      → everything (default)
 * - related  → filter by excluding the current product (slug)
 */
export default function DynamicGrid({ products = [], mode = 'all', currentSlug, loading = false, error = null }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-ink/5" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-modo-orange/30 bg-modo-orange/5 p-6 text-sm text-ink/80">
        No pudimos cargar el catálogo. {error}
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/15 p-10 text-center text-ink/50">
        Aún no hay productos disponibles.
      </div>
    )
  }

  let items = products
  if (mode === 'kit') {
    const kit = products.find((p) => p.is_kit)
    const rest = products.filter((p) => !p.is_kit)
    items = kit ? [kit, ...rest] : rest
  }
  if (mode === 'related' && currentSlug) {
    items = products.filter((p) => p.slug !== currentSlug)
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} accent={mode === 'kit' && p.is_kit} />
      ))}
    </div>
  )
}
