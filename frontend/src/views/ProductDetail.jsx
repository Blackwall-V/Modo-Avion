import { Link, useParams } from 'react-router-dom'
import { ProductsAPI } from '../services/api'
import { useFetch } from '../hooks/useFetch'
import { formatCLP, stockMessage } from '../hooks/format'
import { useCart } from '../hooks/useCart'

const toneClasses = {
  ok:    'bg-modo-teal/10 text-modo-teal border-modo-teal/30',
  warn:  'bg-modo-yellow/20 text-ink border-modo-yellow/50',
  error: 'bg-modo-orange/10 text-modo-orange border-modo-orange/30',
  muted: 'bg-ink/5 text-ink/60 border-ink/10',
}

export default function ProductDetail() {
  const { slug } = useParams()
  const { add } = useCart()
  const { data: product, loading, error } = useFetch(() => ProductsAPI.detail(slug), [slug])

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">Cargando…</div>
  if (error || !product) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-extrabold tracking-tightest text-ink">Producto no encontrado</h1>
        <Link to="/" className="mt-6 inline-block rounded-full bg-ink px-5 py-3 font-semibold text-modo-paper">Volver</Link>
      </div>
    )
  }

  const stock = stockMessage(product.stock_status, product.stock)
  const available = product.stock_status === 'in_stock' || product.stock_status === 'low_stock'

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-bone-200">
          {product.image_url && (
            <img src={product.image_url} alt={product.name} className="aspect-square w-full object-cover" />
          )}
        </div>
        <div className="space-y-6">
          <div>
            {product.is_kit && (
              <span className="inline-block rounded-full bg-modo-orange px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-modo-paper">
                Bundle
              </span>
            )}
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tightest text-ink sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 max-w-lg text-ink/70">{product.description}</p>
          </div>

          <div className="flex items-end justify-between">
            <p className="font-display text-5xl font-extrabold tracking-tightest text-ink">{formatCLP(product.price)}</p>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${toneClasses[stock.tone]}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {stock.text}
            </span>
          </div>

          <button
            onClick={() => available && add(product, 1)}
            disabled={!available}
            className="w-full rounded-full bg-modo-orange px-6 py-4 font-semibold text-modo-paper shadow-[0_18px_30px_-12px_rgba(232,84,26,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {available ? 'Añadir al carrito' : 'No disponible'}
          </button>

          <ul className="space-y-2 border-t border-ink/10 pt-6 text-sm text-ink/70">
            <li>✓ Despacho 24-48h en RM</li>
            <li>✓ Envíos a todo Chile</li>
            <li>✓ Garantía de por vida</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
