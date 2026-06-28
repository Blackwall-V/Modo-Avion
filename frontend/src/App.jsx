import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LandingPage from './views/LandingPage'
import Login from './views/Login'
import Register from './views/Register'
import Dashboard from './views/Dashboard'
import Checkout from './views/Checkout'
import Shop from './views/Shop'
import ProductDetail from './views/ProductDetail'
import KitPage from './views/KitPage'
import Contacto from './views/Contacto'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/kit" element={<KitPage />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/producto/:slug" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <h1 className="font-display text-6xl font-extrabold tracking-tightest text-ink">404</h1>
      <p className="mt-3 text-ink/60">Esa ruta no está en nuestro mapa.</p>
    </div>
  )
}
