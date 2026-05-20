'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { ProductGrid } from '@/components/product-grid'
import { mockListings } from '@/lib/mock-data'
import {
  CATEGORY_LABELS, CONDITION_LABELS, BRANDS, MOLDOVA_CITIES, SIZES,
  type Category, type Condition
} from '@/lib/types'
import { cn } from '@/lib/utils'

type SortOption = 'newest' | 'price_low' | 'price_high' | 'popular'

interface FilterState {
  categories: Category[]
  conditions: Condition[]
  sizes: string[]
  brands: string[]
  cities: string[]
  priceRange: [number, number]
}

const defaultFilters: FilterState = {
  categories: [],
  conditions: [],
  sizes: [],
  brands: [],
  cities: [],
  priceRange: [0, 2000],
}

function SearchContent() {
  const searchParams = useSearchParams()
  const queryParam = searchParams.get('q') || ''
  const categoryParam = searchParams.get('category') as Category | null
  const sortParam = searchParams.get('sort') as SortOption | null

  const [filters, setFilters] = useState<FilterState>(() => ({
    ...defaultFilters,
    categories: categoryParam ? [categoryParam] : [],
  }))
  const [sortBy, setSortBy] = useState<SortOption>(sortParam || 'newest')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (categoryParam) {
      setFilters((p) => ({ ...p, categories: [categoryParam] }))
    }
  }, [categoryParam])

  const filtered = useMemo(() => {
    let results = [...mockListings]

    if (queryParam) {
      const q = queryParam.toLowerCase()
      results = results.filter(
        (l) => l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.brand?.toLowerCase().includes(q)
      )
    }

    if (filters.categories.length > 0) {
      results = results.filter((l) => filters.categories.includes(l.category))
    }
    if (filters.conditions.length > 0) {
      results = results.filter((l) => filters.conditions.includes(l.condition))
    }
    if (filters.sizes.length > 0) {
      results = results.filter((l) => l.size && filters.sizes.includes(l.size))
    }
    if (filters.brands.length > 0) {
      results = results.filter((l) => l.brand && filters.brands.includes(l.brand))
    }
    if (filters.cities.length > 0) {
      results = results.filter((l) => filters.cities.includes(l.location))
    }

    results = results.filter(
      (l) => l.price >= filters.priceRange[0] && l.price <= filters.priceRange[1]
    )

    switch (sortBy) {
      case 'newest':
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'price_low':
        results.sort((a, b) => a.price - b.price)
        break
      case 'price_high':
        results.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        results.sort((a, b) => b.favorites - a.favorites)
        break
    }

    // Boosted first
    results.sort((a, b) => (b.isBoosted ? 1 : 0) - (a.isBoosted ? 1 : 0))

    return results
  }, [queryParam, filters, sortBy])

  const activeFilterCount = filters.categories.length + filters.conditions.length +
    filters.sizes.length + filters.brands.length + filters.cities.length

  const toggleFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K] extends (infer T)[] ? T : never
  ) => {
    setFilters((prev) => {
      const arr = prev[key] as any[]
      const exists = arr.includes(value)
      return { ...prev, [key]: exists ? arr.filter((v) => v !== value) : [...arr, value] }
    })
  }

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-foreground text-sm mb-3">Categorie</h3>
        <div className="space-y-2">
          {(Object.entries(CATEGORY_LABELS) as [Category, string][]).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.categories.includes(key)}
                onCheckedChange={() => toggleFilter('categories', key)}
              />
              <span className="text-sm text-foreground">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <h3 className="font-semibold text-foreground text-sm mb-3">Stare</h3>
        <div className="space-y-2">
          {(Object.entries(CONDITION_LABELS) as [Condition, string][]).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.conditions.includes(key)}
                onCheckedChange={() => toggleFilter('conditions', key)}
              />
              <span className="text-sm text-foreground">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <h3 className="font-semibold text-foreground text-sm mb-3">Mărime</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.haine.map((s) => (
            <button
              key={s}
              onClick={() => toggleFilter('sizes', s)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm border transition-colors',
                filters.sizes.includes(s)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="font-semibold text-foreground text-sm mb-3">
          Preț: {filters.priceRange[0]} – {filters.priceRange[1]} lei
        </h3>
        <Slider
          min={0}
          max={2000}
          step={10}
          value={filters.priceRange}
          onValueChange={(v) => setFilters((p) => ({ ...p, priceRange: v as [number, number] }))}
        />
      </div>

      {/* Brand */}
      <div>
        <h3 className="font-semibold text-foreground text-sm mb-3">Brand</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {BRANDS.map((b) => (
            <label key={b} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.brands.includes(b)}
                onCheckedChange={() => toggleFilter('brands', b)}
              />
              <span className="text-sm text-foreground">{b}</span>
            </label>
          ))}
        </div>
      </div>

      {/* City */}
      <div>
        <h3 className="font-semibold text-foreground text-sm mb-3">Localitate</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {MOLDOVA_CITIES.slice(0, 8).map((c) => (
            <label key={c} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.cities.includes(c)}
                onCheckedChange={() => toggleFilter('cities', c)}
              />
              <span className="text-sm text-foreground">{c}</span>
            </label>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setFilters(defaultFilters)}
        >
          Șterge filtrele ({activeFilterCount})
        </Button>
      )}
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-foreground truncate">
            {queryParam ? `Rezultate pentru "${queryParam}"` : 'Toate produsele'}
          </h1>
          <p className="text-sm text-muted-foreground">{filtered.length} produse</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="h-9 text-sm w-36 sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Cele mai noi</SelectItem>
              <SelectItem value="popular">Populare</SelectItem>
              <SelectItem value="price_low">Preț: mic → mare</SelectItem>
              <SelectItem value="price_high">Preț: mare → mic</SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile filter trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1.5 lg:hidden">
                <SlidersHorizontal className="h-4 w-4" />
                Filtre
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="h-4 w-4 p-0 text-[10px] flex items-center justify-center">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filtre</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <FiltersContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {filters.categories.map((c) => (
            <Badge key={c} variant="secondary" className="gap-1 cursor-pointer" onClick={() => toggleFilter('categories', c)}>
              {CATEGORY_LABELS[c]} <X className="h-3 w-3" />
            </Badge>
          ))}
          {filters.cities.map((c) => (
            <Badge key={c} variant="secondary" className="gap-1 cursor-pointer" onClick={() => toggleFilter('cities', c)}>
              {c} <X className="h-3 w-3" />
            </Badge>
          ))}
          {filters.brands.map((b) => (
            <Badge key={b} variant="secondary" className="gap-1 cursor-pointer" onClick={() => toggleFilter('brands', b)}>
              {b} <X className="h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-24">
            <FiltersContent />
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {filtered.length > 0 ? (
            <ProductGrid listings={filtered} />
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg font-medium mb-2">Niciun rezultat găsit</p>
              <p className="text-sm">Încearcă să modifici filtrele sau termenul de căutare</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  )
}
