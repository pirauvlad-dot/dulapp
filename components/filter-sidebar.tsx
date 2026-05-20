'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { CATEGORY_LABELS, CONDITION_LABELS, SIZES, COLORS, BRANDS, type Category, type Condition } from '@/lib/types'
import { cn } from '@/lib/utils'

export interface FilterState {
  categories: Category[]
  conditions: Condition[]
  sizes: string[]
  colors: string[]
  brands: string[]
  priceRange: [number, number]
}

interface FilterSidebarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  className?: string
}

const defaultPriceRange: [number, number] = [0, 200]

export function FilterSidebar({ filters, onFiltersChange, className }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    condition: true,
    size: true,
    color: false,
    brand: false,
    price: true,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = <T,>(key: keyof FilterState, value: T) => {
    const currentArray = filters[key] as T[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((v) => v !== value)
      : [...currentArray, value]
    updateFilter(key, newArray as FilterState[typeof key])
  }

  const activeFilterCount =
    filters.categories.length +
    filters.conditions.length +
    filters.sizes.length +
    filters.colors.length +
    filters.brands.length +
    (filters.priceRange[0] !== defaultPriceRange[0] || filters.priceRange[1] !== defaultPriceRange[1] ? 1 : 0)

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      conditions: [],
      sizes: [],
      colors: [],
      brands: [],
      priceRange: defaultPriceRange,
    })
  }

  return (
    <aside className={cn('flex flex-col gap-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear all ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Active filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.categories.map((cat) => (
            <Badge key={cat} variant="secondary" className="gap-1">
              {CATEGORY_LABELS[cat]}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleArrayFilter('categories', cat)}
              />
            </Badge>
          ))}
          {filters.conditions.map((cond) => (
            <Badge key={cond} variant="secondary" className="gap-1">
              {CONDITION_LABELS[cond]}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleArrayFilter('conditions', cond)}
              />
            </Badge>
          ))}
          {filters.sizes.map((size) => (
            <Badge key={size} variant="secondary" className="gap-1">
              {size}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleArrayFilter('sizes', size)}
              />
            </Badge>
          ))}
          {filters.colors.map((color) => (
            <Badge key={color} variant="secondary" className="gap-1">
              {color}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleArrayFilter('colors', color)}
              />
            </Badge>
          ))}
          {filters.brands.map((brand) => (
            <Badge key={brand} variant="secondary" className="gap-1">
              {brand}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleArrayFilter('brands', brand)}
              />
            </Badge>
          ))}
        </div>
      )}

      <Separator />

      {/* Category */}
      <FilterSection
        title="Category"
        expanded={expandedSections.category}
        onToggle={() => toggleSection('category')}
      >
        <div className="flex flex-col gap-2">
          {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
            <FilterCheckbox
              key={cat}
              id={`category-${cat}`}
              label={CATEGORY_LABELS[cat]}
              checked={filters.categories.includes(cat)}
              onCheckedChange={() => toggleArrayFilter('categories', cat)}
            />
          ))}
        </div>
      </FilterSection>

      <Separator />

      {/* Condition */}
      <FilterSection
        title="Condition"
        expanded={expandedSections.condition}
        onToggle={() => toggleSection('condition')}
      >
        <div className="flex flex-col gap-2">
          {(Object.keys(CONDITION_LABELS) as Condition[]).map((cond) => (
            <FilterCheckbox
              key={cond}
              id={`condition-${cond}`}
              label={CONDITION_LABELS[cond]}
              checked={filters.conditions.includes(cond)}
              onCheckedChange={() => toggleArrayFilter('conditions', cond)}
            />
          ))}
        </div>
      </FilterSection>

      <Separator />

      {/* Size */}
      <FilterSection
        title="Size"
        expanded={expandedSections.size}
        onToggle={() => toggleSection('size')}
      >
        <div className="flex flex-wrap gap-2">
          {SIZES.clothing.map((size) => (
            <Button
              key={size}
              variant={filters.sizes.includes(size) ? 'default' : 'outline'}
              size="sm"
              className="h-8 px-3"
              onClick={() => toggleArrayFilter('sizes', size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </FilterSection>

      <Separator />

      {/* Color */}
      <FilterSection
        title="Color"
        expanded={expandedSections.color}
        onToggle={() => toggleSection('color')}
      >
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <FilterCheckbox
              key={color}
              id={`color-${color}`}
              label={color}
              checked={filters.colors.includes(color)}
              onCheckedChange={() => toggleArrayFilter('colors', color)}
            />
          ))}
        </div>
      </FilterSection>

      <Separator />

      {/* Brand */}
      <FilterSection
        title="Brand"
        expanded={expandedSections.brand}
        onToggle={() => toggleSection('brand')}
      >
        <div className="flex flex-col gap-2">
          {BRANDS.slice(0, 10).map((brand) => (
            <FilterCheckbox
              key={brand}
              id={`brand-${brand}`}
              label={brand}
              checked={filters.brands.includes(brand)}
              onCheckedChange={() => toggleArrayFilter('brands', brand)}
            />
          ))}
        </div>
      </FilterSection>

      <Separator />

      {/* Price */}
      <FilterSection
        title="Price"
        expanded={expandedSections.price}
        onToggle={() => toggleSection('price')}
      >
        <div className="space-y-4">
          <Slider
            min={0}
            max={200}
            step={5}
            value={filters.priceRange}
            onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}+</span>
          </div>
        </div>
      </FilterSection>
    </aside>
  )
}

function FilterSection({
  title,
  expanded,
  onToggle,
  children,
}: {
  title: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <Collapsible open={expanded} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex w-full items-center justify-between py-1">
        <span className="text-sm font-medium text-foreground">{title}</span>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3">{children}</CollapsibleContent>
    </Collapsible>
  )
}

function FilterCheckbox({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string
  label: string
  checked: boolean
  onCheckedChange: () => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <Label htmlFor={id} className="text-sm font-normal cursor-pointer">
        {label}
      </Label>
    </div>
  )
}
