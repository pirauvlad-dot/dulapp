'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Settings, Package, Heart, MessageCircle, Star, MapPin, Calendar, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ProductGrid } from '@/components/product-grid'
import { ReviewCard, StarRating } from '@/components/review-card'
import { useAuth } from '@/lib/auth-context'
import { mockListings, mockReviews } from '@/lib/mock-data'

export default function ProfilePage() {
  const { isAuthenticated, user, getFavoriteListings } = useAuth()

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground">Sign in to view your profile</h1>
        <p className="mt-2 text-muted-foreground">
          Access your listings, favorites, and account settings
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild>
            <Link href="/login?redirect=/profile">Log in</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/register?redirect=/profile">Sign up</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Mock user's own listings
  const myListings = mockListings.slice(0, 4)
  const favoriteListings = getFavoriteListings()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Profile Header */}
      <div className="flex flex-col items-center gap-6 rounded-xl bg-card p-8 text-center sm:flex-row sm:text-left">
        <div className="relative">
          <Image
            src={user.avatar}
            alt={user.username}
            width={120}
            height={120}
            className="rounded-full object-cover"
          />
          {user.isVerified && (
            <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <CheckCircle className="h-5 w-5" />
            </span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-start">
            <h1 className="text-2xl font-bold text-foreground">{user.username}</h1>
            {user.isVerified && (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground sm:justify-start">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {user.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Member since {formatDate(user.memberSince)}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-center gap-1 sm:justify-start">
            <StarRating rating={user.rating} size="md" />
            <span className="text-sm text-muted-foreground">({user.reviewCount} reviews)</span>
          </div>

          {user.bio && (
            <p className="mt-4 text-muted-foreground">{user.bio}</p>
          )}

          {/* Stats */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-6 sm:justify-start">
            <div className="text-center sm:text-left">
              <p className="text-lg font-semibold text-foreground">{user.followers}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-lg font-semibold text-foreground">{user.following}</p>
              <p className="text-sm text-muted-foreground">Following</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-lg font-semibold text-foreground">{user.itemsSold}</p>
              <p className="text-sm text-muted-foreground">Items sold</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button asChild>
            <Link href="/sell">
              <Package className="mr-2 h-4 w-4" />
              Sell item
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="listings" className="mt-8">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="listings" className="gap-2">
            <Package className="h-4 w-4" />
            My Listings ({myListings.length})
          </TabsTrigger>
          <TabsTrigger value="favorites" className="gap-2">
            <Heart className="h-4 w-4" />
            Favorites ({favoriteListings.length})
          </TabsTrigger>
          <TabsTrigger value="reviews" className="gap-2">
            <Star className="h-4 w-4" />
            Reviews ({user.reviewCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="mt-6">
          {myListings.length > 0 ? (
            <ProductGrid listings={myListings} />
          ) : (
            <div className="rounded-lg bg-muted/50 p-12 text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium text-foreground">No listings yet</p>
              <p className="mt-1 text-muted-foreground">
                Start selling by listing your first item
              </p>
              <Button className="mt-4" asChild>
                <Link href="/sell">List an item</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          {favoriteListings.length > 0 ? (
            <ProductGrid listings={favoriteListings} />
          ) : (
            <div className="rounded-lg bg-muted/50 p-12 text-center">
              <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium text-foreground">No favorites yet</p>
              <p className="mt-1 text-muted-foreground">
                Save items you love by tapping the heart icon
              </p>
              <Button className="mt-4" asChild>
                <Link href="/search">Browse items</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-4">
            {mockReviews.slice(0, 5).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
