import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as fbSignOut,
  updateProfile,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../services/firebase'
import { AuthAPI, bindTokenProvider } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [profile, setProfile] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [error, setError] = useState(null)

  // Wire the axios token provider to our current token.
  useEffect(() => {
    bindTokenProvider(() => token)
  }, [token])

  // React to 401s surfaced by the axios interceptor.
  useEffect(() => {
    const onUnauth = () => {
      setUser(null)
      setToken(null)
      setProfile(null)
    }
    window.addEventListener('modo-avion:unauthorized', onUnauth)
    return () => window.removeEventListener('modo-avion:unauthorized', onUnauth)
  }, [])

  // Subscribe to Firebase auth state.
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setStatus('error')
      setError('Firebase no está configurado. Revisa el archivo .env del frontend.')
      return
    }
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const idToken = await fbUser.getIdToken()
        setUser(fbUser)
        setToken(idToken)
        // Best-effort profile sync. Failure is non-fatal (e.g. offline).
        try {
          const p = await AuthAPI.whoami()
          setProfile(p)
        } catch (_) {
          setProfile({
            id: null,
            username: fbUser.email,
            email: fbUser.email,
            first_name: fbUser.displayName || '',
            last_name: '',
          })
        }
      } else {
        setUser(null)
        setToken(null)
        setProfile(null)
      }
      setStatus('ready')
    })
    return () => unsub()
  }, [])

  const signIn = useCallback(async (email, password) => {
    setError(null)
    const cred = await signInWithEmailAndPassword(auth, email, password)
    return cred.user
  }, [])

  const signUp = useCallback(async (email, password, displayName) => {
    setError(null)
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) {
      await updateProfile(cred.user, { displayName })
    }
    return cred.user
  }, [])

  const resetPassword = useCallback(async (email) => {
    setError(null)
    await sendPasswordResetEmail(auth, email)
  }, [])

  const signOut = useCallback(async () => {
    await fbSignOut(auth)
  }, [])

  const syncProfile = useCallback(async (data) => {
    const p = await AuthAPI.syncProfile(data)
    setProfile(p)
    return p
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      profile,
      status,
      error,
      isAuthenticated: Boolean(user),
      signIn,
      signUp,
      resetPassword,
      signOut,
      syncProfile,
    }),
    [user, token, profile, status, error, signIn, signUp, resetPassword, signOut, syncProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
