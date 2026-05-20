'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search, Heart, MessageCircle, User, Plus, LogOut, Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/auth-context'
import { CATEGORY_LABELS, CATEGORY_LABELS_RU, type Category } from '@/lib/types'
import { translations } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const PRIMARY_CATEGORIES: Category[] = ['femei', 'barbati', 'copii', 'incaltaminte', 'accesorii']
const SECONDARY_CATEGORIES: Category[] = ['casa-decor', 'colectionabile', 'altele']

export function Header() {
  const router = useRouter()
  const { user, isAuthenticated, logout, locale, setLocale } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const t = translations[locale]
  const catLabels = locale === 'ro' ? CATEGORY_LABELS : CATEGORY_LABELS_RU

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      {/* Main bar */}
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">D</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">dulapp</span>
        </Link>

        {/* Search — desktop */}
        <form onSubmit={handleSearch} className="hidden flex-1 max-w-lg md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={`${t.search}...`}
              className="w-full pl-9 h-9 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1">
          {/* Language toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex h-8 px-2 text-xs font-medium text-muted-foreground"
            onClick={() => setLocale(locale === 'ro' ? 'ru' : 'ro')}
          >
            {locale === 'ro' ? 'RU' : 'RO'}
          </Button>

          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                <Link href="/favorites">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                <Link href="/messages">
                  <MessageCircle className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="sm" className="hidden sm:flex h-9 gap-1.5" asChild>
                <Link href="/sell">
                  <Plus className="h-4 w-4" />
                  {t.sell}
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user?.avatar} alt={user?.username} />
                      <AvatarFallback className="text-xs">
                        {user?.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile"><User className="mr-2 h-4 w-4" />{t.profile}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">{t.myProducts}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/subscription">{t.subscription}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">{t.settings}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />{t.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="h-9" asChild>
                <Link href="/login">{t.login}</Link>
              </Button>
              <Button size="sm" className="h-9" asChild>
                <Link href="/register">{t.register}</Link>
              </Button>
            </>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Category nav — desktop */}
      <div className="hidden md:block border-t border-border/50">
        <div className="mx-auto flex max-w-7xl items-center gap-0 px-4">
          {PRIMARY_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/search?category=${cat}`}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              {catLabels[cat]}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-auto px-3 py-2 text-sm text-muted-foreground font-normal gap-1">
                Mai mult <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {SECONDARY_CATEGORIES.map((cat) => (
                <DropdownMenuItem key={cat} asChild>
                  <Link href={`/search?category=${cat}`}>{catLabels[cat]}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile search + menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-card px-4 py-3 md:hidden space-y-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={`${t.search}...`}
                className="w-full pl-9 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          <div className="flex flex-wrap gap-2">
            {[...PRIMARY_CATEGORIES, ...SECONDARY_CATEGORIES].map((cat) => (
              <Link
                key={cat}
                href={`/search?category=${cat}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
              >
                {catLabels[cat]}
              </Link>
            ))}
          </div>
          {isAuthenticated && (
            <Button className="w-full" asChild>
              <Link href="/sell" onClick={() => setMobileMenuOpen(false)}>
                <Plus className="mr-2 h-4 w-4" />{t.sell}
              </Link>
            </Button>
          )}
        </div>
      )}
    </header>
  )
}
