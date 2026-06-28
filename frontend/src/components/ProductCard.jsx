import { Link } from 'react-router-dom'
import { formatCLP, stockMessage } from '../hooks/format'
import { useCart } from '../hooks/useCart'

const toneClasses = {
  ok:    'bg-modo-teal/10 text-modo-teal border-modo-teal/30',
  warn:  'bg-modo-yellow/20 text-ink border-modo-yellow/50',
  error: 'bg-modo-orange/10 text-modo-orange border-modo-orange/30',
  muted: 'bg-ink/5 text-ink/60 border-ink/10',
}

export default function ProductCard({ product, accent = false }) {
  const { add } = useCart()
  const { text, tone } = stockMessage(product.stock_status, product.stock)
  const isAvailable = product.stock_status === 'in_stock' || product.stock_status === 'low_stock'

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(15,15,16,0.25)] ${
        accent ? 'border-modo-orange/40 ring-1 ring-modo-orange/20' : 'border-ink/10'
      }`}
    >
      {accent && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-modo-orange px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-modo-paper">
          Bundle
        </span>
      )}

      <Link to={`/producto/${product.slug}`} className="block aspect-square overflow-hidden bg-bone-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-ink/30 font-mono text-xs">Sin imagen</div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-lg font-bold leading-tight text-ink">
            <Link to={`/producto/${product.slug}`} className="hover:underline underline-offset-4">
              {product.name}
            </Link>
          </h3>
          {product.description && (
            <p className="mt-1 line-clamp-2 text-sm text-ink/60">{product.description}</p>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-ink/40">Precio</p>
            <p className="font-display text-2xl font-extrabold tracking-tightest text-ink">
              {formatCLP(product.price)}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${toneClasses[tone]}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                tone === 'ok' ? 'bg-modo-teal' :
                tone === 'warn' ? 'bg-modo-orange animate-pulse-soft' :
                tone === 'error' ? 'bg-modo-orange' : 'bg-ink/30'
              }`}
            />
            {text}
          </span>
        </div>

        <button
          type="button"
          onClick={() => isAvailable && add(product, 1)}
          disabled={!isAvailable}
          className={`w-full rounded-full px-4 py-2.5 text-sm font-semibold transition-transform active:translate-y-px ${
            isAvailable
              ? 'bg-ink text-modo-paper hover:bg-modo-orange'
              : 'cursor-not-allowed bg-ink/10 text-ink/40'
          }`}
        >
          {isAvailable ? 'Añadir al carrito' : 'No disponible'}
        </button>
      </div>
    </article>
  )
}
