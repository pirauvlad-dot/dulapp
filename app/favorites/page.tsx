'use client'

import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductGrid } from '@/components/product-grid'
import { useAuth } from '@/lib/auth-context'

export default function FavoritesPage() {
  const { isAuthenticated, getFavoriteListings } = useAuth()
  const favoriteListings = getFavoriteListings()

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <Heart className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="mt-6 text-2xl font-bold text-foreground">Save your favorites</h1>
        <p className="mt-2 text-muted-foreground">
          Sign in to save items you love and get notified about price drops
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild>
            <Link href="/login?redirect=/favorites">Log in</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/register?redirect=/favorites">Sign up</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Favorites</h1>
        <p className="mt-2 text-muted-foreground">
          {favoriteListings.length} item{favoriteListings.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {favoriteListings.length > 0 ? (
        <ProductGrid listings={favoriteListings} />
      ) : (
        <div className="rounded-lg bg-muted/50 py-16 text-center">
          <Heart className="mx-auto h-16 w-16 text-muted-foreground" />
          <h2 className="mt-6 text-xl font-semibold text-foreground">No favorites yet</h2>
          <p className="mt-2 text-muted-foreground">
            Start browsing and save items you love by tapping the heart icon
          </p>
          <Button className="mt-6" asChild>
            <Link href="/search">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Start shopping
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
