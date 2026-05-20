'use client'

import { use, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Heart, MessageCircle, Share2, ChevronLeft, ChevronRight, MapPin, Eye, Shield, ArrowLeftRight, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { ProductGrid } from '@/components/product-grid'
import { mockListings, mockReviews } from '@/lib/mock-data'
import { CONDITION_LABELS, CATEGORY_LABELS } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

export default function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const listing = mockListings.find((l) => l.id === id)
  const [currentImage, setCurrentImage] = useState(0)
  const [showOffer, setShowOffer] = useState(false)
  const [offerAmount, setOfferAmount] = useState('')
  const [offerSent, setOfferSent] = useState(false)
  const { isAuthenticated, isFavorite, toggleFavorite } = useAuth()

  if (!listing) notFound()

  const favorited = isFavorite(listing.id)
  const relatedListings = mockListings
    .filter((l) => l.category === listing.category && l.id !== listing.id)
    .slice(0, 6)

  const handleSendOffer = () => {
    if (!offerAmount) return
    setOfferSent(true)
    setShowOffer(false)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Back */}
      <Link href="/search" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="h-4 w-4" /> Înapoi
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted sm:aspect-[4/5]">
            <Image
              src={listing.images[currentImage]}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
            {listing.isBoosted && (
              <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                <Zap className="h-3 w-3" /> Promovat
              </div>
            )}
            {listing.images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full h-9 w-9 bg-card/80 backdrop-blur-sm"
                  onClick={() => setCurrentImage(p => p === 0 ? listing.images.length - 1 : p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full h-9 w-9 bg-card/80 backdrop-blur-sm"
                  onClick={() => setCurrentImage(p => p === listing.images.length - 1 ? 0 : p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          {listing.images.length > 1 && (
            <div className="flex gap-2">
              {listing.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={cn(
                    'relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-colors',
                    i === currentImage ? 'border-primary' : 'border-transparent'
                  )}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-5">
          {/* Price & title */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <span className="text-3xl font-bold text-foreground">{listing.price} lei</span>
              <Button
                variant="ghost"
                size="icon"
                className={cn('h-10 w-10 rounded-full', favorited && 'text-red-500')}
                onClick={() => isAuthenticated && toggleFavorite(listing.id)}
              >
                <Heart className={cn('h-5 w-5', favorited && 'fill-current')} />
              </Button>
            </div>
            <h1 className="mt-1 text-xl font-semibold text-foreground">{listing.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{CONDITION_LABELS[listing.condition]}</Badge>
              <Badge variant="outline">{CATEGORY_LABELS[listing.category]}</Badge>
              {listing.size && <Badge variant="outline">Măr. {listing.size}</Badge>}
              {listing.brand && <Badge variant="outline">{listing.brand}</Badge>}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{listing.views} vizualizări</span>
            <span className="flex items-center gap-1"><Heart className="h-4 w-4" />{listing.favorites} salvări</span>
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{listing.location}</span>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button className="w-full h-11 gap-2" asChild>
              <Link href={`/messages?listing=${listing.id}`}>
                <MessageCircle className="h-5 w-5" /> Contactează vânzătorul
              </Link>
            </Button>

            {!offerSent ? (
              !showOffer ? (
                <Button variant="outline" className="w-full h-11 gap-2" onClick={() => setShowOffer(true)}>
                  <ArrowLeftRight className="h-4 w-4" /> Fă o ofertă
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Suma (lei)"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    className="h-11"
                  />
                  <Button className="h-11 px-4" onClick={handleSendOffer}>Trimite</Button>
                  <Button variant="ghost" className="h-11 px-3" onClick={() => setShowOffer(false)}>✕</Button>
                </div>
              )
            ) : (
              <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700 text-center">
                ✓ Oferta de {offerAmount} lei a fost trimisă!
              </div>
            )}
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">Descriere</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{listing.description}</p>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            {[
              { label: 'Stare', value: CONDITION_LABELS[listing.condition] },
              { label: 'Categorie', value: CATEGORY_LABELS[listing.category] },
              listing.size ? { label: 'Mărime', value: listing.size } : null,
              listing.brand ? { label: 'Brand', value: listing.brand } : null,
              listing.color ? { label: 'Culoare', value: listing.color } : null,
              { label: 'Localitate', value: listing.location },
            ].filter(Boolean).map((item) => (
              <div key={item!.label}>
                <span className="text-muted-foreground">{item!.label}: </span>
                <span className="font-medium text-foreground">{item!.value}</span>
              </div>
            ))}
          </div>

          <Separator />

          {/* Seller */}
          <Link href={`/user/${listing.seller.id}`} className="flex items-center gap-3 rounded-xl border border-border p-3 hover:bg-muted/50 transition-colors">
            <Avatar className="h-12 w-12">
              <AvatarImage src={listing.seller.avatar} alt={listing.seller.username} />
              <AvatarFallback>{listing.seller.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-semibold text-foreground truncate">
                  {listing.seller.shopName || listing.seller.username}
                </p>
                {listing.seller.isVerified && (
                  <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">✓</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                ⭐ {listing.seller.rating} · {listing.seller.reviewCount} recenzii · {listing.seller.itemsSold} vânduți
              </p>
              <p className="text-xs text-muted-foreground">{listing.seller.followers} urmăritori</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </Link>

          {/* Safety note */}
          <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
            <Shield className="h-4 w-4 shrink-0 mt-0.5" />
            <p>Plata se face direct între cumpărător și vânzător. Dulapp nu procesează tranzacțiile. Fii precaut la tranzacții și verifică produsul înainte de a plăti.</p>
          </div>
        </div>
      </div>

      {/* Related */}
      {relatedListings.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-foreground mb-5">Produse similare</h2>
          <ProductGrid listings={relatedListings} />
        </div>
      )}
    </div>
  )
}
