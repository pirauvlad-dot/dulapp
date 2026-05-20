import { ProductCard } from './product-card'
import type { Listing } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ProductGridProps {
  listings: Listing[]
  className?: string
  emptyMessage?: string
}

export function ProductGrid({ listings, className, emptyMessage = 'No items found' }: ProductGridProps) {
  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
        className
      )}
    >
      {listings.map((listing) => (
        <ProductCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}
