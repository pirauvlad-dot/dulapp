'use client'

import { use, useState } from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MapPin, Star, Package, Users, UserPlus, UserMinus, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProductGrid } from '@/components/product-grid'
import { mockUsers, mockListings, mockReviews } from '@/lib/mock-data'
import { PLAN_LABELS } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const seller = mockUsers.find((u) => u.id === id)
  const { isAuthenticated, isFollowing, toggleFollow } = useAuth()
  const [followerCount, setFollowerCount] = useState(seller?.followers ?? 0)

  if (!seller) notFound()

  const sellerListings = mockListings.filter((l) => l.seller.id === seller.id)
  const hasBanner = seller.plan === 'pro' || seller.plan === 'unlimited'
  const following = isFollowing(seller.id)

  const handleFollow = () => {
    toggleFollow(seller.id)
    setFollowerCount(p => following ? p - 1 : p + 1)
  }

  return (
    <div className="min-h-screen">
      {/* Banner / Header */}
      <div className="relative">
        {hasBanner && seller.bannerImage ? (
          <div className="relative h-32 sm:h-44 overflow-hidden bg-muted">
            <Image src={seller.bannerImage} alt="Banner" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        ) : (
          <div className="h-20 sm:h-32 bg-gradient-to-br from-primary/20 to-accent/20" />
        )}

        {/* Avatar */}
        <div className="mx-auto max-w-4xl px-4">
          <div className="relative -mt-10 sm:-mt-12 flex items-end justify-between">
            <div className="relative">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-background">
                <AvatarImage src={seller.avatar} alt={seller.username} />
                <AvatarFallback className="text-2xl">
                  {seller.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {seller.isVerified && (
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground border-2 border-background">✓</span>
              )}
            </div>
            {isAuthenticated && (
              <Button
                variant={following ? 'outline' : 'default'}
                size="sm"
                className="mb-2 gap-1.5"
                onClick={handleFollow}
              >
                {following ? (
                  <><UserMinus className="h-4 w-4" /> Nu mai urmări</>
                ) : (
                  <><UserPlus className="h-4 w-4" /> Urmărește</>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Profile info */}
      <div className="mx-auto max-w-4xl px-4 mt-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-bold text-foreground">
            {seller.shopName || seller.username}
          </h1>
          {seller.isVerified && (
            <Badge variant="secondary" className="gap-1">
              <Shield className="h-3 w-3" /> Verificat
            </Badge>
          )}
          <Badge variant="outline" className="text-xs">
            {PLAN_LABELS[seller.plan]}
          </Badge>
        </div>
        {seller.shopName && (
          <p className="text-sm text-muted-foreground">@{seller.username}</p>
        )}

        {/* Stats row */}
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-foreground">{followerCount}</span>
            <span className="text-muted-foreground">urmăritori</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-foreground">{seller.following}</span>
            <span className="text-muted-foreground">urmărește</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-foreground">{seller.itemsSold}</span>
            <span className="text-muted-foreground">vânduți</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 text-amber-500" />
            <span className="font-medium text-foreground">{seller.rating}</span>
            <span className="text-muted-foreground">({seller.reviewCount} recenzii)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{seller.location}</span>
          </div>
        </div>

        {seller.bio && (
          <p className="mt-3 text-sm text-muted-foreground">{seller.bio}</p>
        )}

        <p className="mt-1 text-xs text-muted-foreground">
          Membru din {new Date(seller.memberSince).toLocaleDateString('ro-MD', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Tabs */}
      <div className="mx-auto max-w-4xl px-4 mt-6">
        <Tabs defaultValue="products">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="products" className="flex-1 sm:flex-none">
              Produse ({sellerListings.length})
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1 sm:flex-none">
              Recenzii ({seller.reviewCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-5">
            {sellerListings.length > 0 ? (
              <ProductGrid listings={sellerListings} />
            ) : (
              <p className="text-center text-muted-foreground py-10">Niciun produs listat încă</p>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="mt-5">
            <div className="space-y-3">
              {mockReviews.map((review) => (
                <div key={review.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={review.reviewer.avatar} />
                      <AvatarFallback className="text-xs">{review.reviewer.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{review.reviewer.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {'⭐'.repeat(review.rating)} · {new Date(review.createdAt).toLocaleDateString('ro-MD')}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                  {review.listingTitle && (
                    <p className="mt-1 text-xs text-muted-foreground">Produs: {review.listingTitle}</p>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
