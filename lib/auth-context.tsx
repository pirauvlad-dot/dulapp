'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User, Locale } from './types'
import { currentUser } from './mock-data'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  locale: Locale
  setLocale: (l: Locale) => void
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isFavorite: (id: string) => boolean
  toggleFavorite: (id: string) => void
  isFollowing: (id: string) => boolean
  toggleFollow: (id: string) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [following, setFollowing] = useState<Set<string>>(new Set())
  const [locale, setLocale] = useState<Locale>('ro')

  const login = useCallback(async (email: string, _password: string) => {
    if (email) {
      setUser(currentUser)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setFavorites(new Set())
    setFollowing(new Set())
  }, [])

  const isFavorite = useCallback((id: string) => favorites.has(id), [favorites])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const isFollowing = useCallback((id: string) => following.has(id), [following])

  const toggleFollow = useCallback((id: string) => {
    setFollowing((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user, locale, setLocale,
      login, logout, isFavorite, toggleFavorite, isFollowing, toggleFollow,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
