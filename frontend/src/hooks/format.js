/**
 * Format an integer CLP amount as "$20.000" (dot thousands separator, no
 * decimals — CLP is a zero-decimal currency).
 */
export function formatCLP(amount) {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return '$0'
  return `$${Number(amount).toLocaleString('es-CL')}`
}

export function stockMessage(stockStatus, stock) {
  switch (stockStatus) {
    case 'in_stock':
      return { text: 'En stock · Despacho 24-48h', tone: 'ok' }
    case 'low_stock':
      return { text: `¡Solo ${stock} disponibles!`, tone: 'warn' }
    case 'out_of_stock':
      return { text: 'Agotado', tone: 'error' }
    case 'discontinued':
      return { text: 'Descontinuado', tone: 'muted' }
    default:
      return { text: '', tone: 'muted' }
  }
}
