'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, MapPin, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Listing } from '@/lib/types'
import { CONDITION_LABELS } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  listing: Listing
  className?: string
}

export function ProductCard({ listing, className }: ProductCardProps) {
  const { isAuthenticated, isFavorite, toggleFavorite } = useAuth()
  const favorited = isFavorite(listing.id)

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isAuthenticated) toggleFavorite(listing.id)
  }

  return (
    <Link
      href={`/listing/${listing.id}`}
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl bg-card transition-all hover:shadow-sm active:scale-[0.98]',
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Image
          src={listing.images[0]}
          alt={listing.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Boost badge */}
        {listing.isBoosted && (
          <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
            <Zap className="h-2.5 w-2.5" />
            Promovat
          </div>
        )}

        {/* Favorite */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'absolute right-2 top-2 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm transition-colors hover:bg-card',
            favorited && 'text-red-500',
            !isAuthenticated && 'opacity-0 group-hover:opacity-100'
          )}
          onClick={handleFavorite}
        >
          <Heart className={cn('h-4 w-4', favorited && 'fill-current')} />
        </Button>

        {/* Size badge */}
        {listing.size && (
          <div className="absolute bottom-2 left-2 rounded-md bg-card/80 px-1.5 py-0.5 text-[11px] font-medium backdrop-blur-sm">
            {listing.size}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-2.5">
        <div className="flex items-center justify-between gap-1">
          <span className="text-base font-semibold text-foreground">
            {listing.price} lei
          </span>
          <span className="text-[11px] text-muted-foreground">
            {CONDITION_LABELS[listing.condition]}
          </span>
        </div>

        <p className="line-clamp-2 text-xs text-muted-foreground leading-snug">{listing.title}</p>

        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-1.5">
            <Avatar className="h-4 w-4">
              <AvatarImage src={listing.seller.avatar} alt={listing.seller.username} />
              <AvatarFallback className="text-[8px]">
                {listing.seller.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-[11px] text-muted-foreground truncate max-w-[80px]">
              {listing.seller.shopName || listing.seller.username}
            </span>
            {listing.seller.isVerified && (
              <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-primary text-[8px] text-primary-foreground">✓</span>
            )}
          </div>
          <div className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
            <MapPin className="h-2.5 w-2.5" />
            {listing.location}
          </div>
        </div>
      </div>
    </Link>
  )
}
