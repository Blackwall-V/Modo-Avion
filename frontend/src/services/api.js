/**
 * Thin axios instance that talks to the Django backend.
 *
 * - baseURL comes from VITE_API_URL (defaults to "/api" which is proxied to
 *   http://localhost:8000 by vite.config.js during dev).
 * - Attach the current Firebase ID token to every request when present.
 * - On 401, surface a single source of truth for the UI to react to.
 */
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

let _getToken = () => null
export function bindTokenProvider(fn) {
  _getToken = fn
}

api.interceptors.request.use(async (config) => {
  const token = _getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Token invalid or expired — let the AuthContext react via window event.
      window.dispatchEvent(new CustomEvent('modo-avion:unauthorized'))
    }
    return Promise.reject(err)
  }
)

// -------------------------------------------------------------------
// High-level endpoints
// -------------------------------------------------------------------
export const ProductsAPI = {
  list: (params = {}) => api.get('/products/', { params }).then((r) => r.data),
  detail: (slug) => api.get(`/products/${slug}/`).then((r) => r.data),
}

export const OrdersAPI = {
  list: () => api.get('/orders/').then((r) => r.data),
  create: (payload) => api.post('/orders/', payload).then((r) => r.data),
  detail: (id) => api.get(`/orders/${id}/`).then((r) => r.data),
}

export const AuthAPI = {
  whoami: () => api.get('/auth/whoami/').then((r) => r.data),
  syncProfile: (data) => api.post('/auth/sync-profile/', data).then((r) => r.data),
}
