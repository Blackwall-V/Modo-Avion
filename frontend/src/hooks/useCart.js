/**
 * Tiny localStorage-backed cart. The brief says "passing shipping and data
 * payloads directly to the backend order endpoint", so this only needs to
 * hold items + quantities between page loads — no remote sync.
 */
import { useCallback, useEffect, useState } from 'react'

const KEY = 'modo-avion:cart:v1'

function readInitial() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch (_) {
    return []
  }
}

export function useCart() {
  const [items, setItems] = useState(readInitial)

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(items))
    } catch (_) {
      // Quota or private mode — silently ignore, cart works for the session.
    }
  }, [items])

  const add = useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.id === product.id)
      if (i === -1) {
        return [...prev, { id: product.id, name: product.name, price: product.price, slug: product.slug, image_url: product.image_url, quantity }]
      }
      const next = [...prev]
      next[i] = { ...next[i], quantity: next[i].quantity + quantity }
      return next
    })
  }, [])

  const remove = useCallback((productId) => {
    setItems((prev) => prev.filter((p) => p.id !== productId))
  }, [])

  const setQuantity = useCallback((productId, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((p) => p.id !== productId)
      return prev.map((p) => (p.id === productId ? { ...p, quantity } : p))
    })
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const total = items.reduce((sum, p) => sum + p.price * p.quantity, 0)
  const count = items.reduce((sum, p) => sum + p.quantity, 0)

  return { items, add, remove, setQuantity, clear, total, count }
}
