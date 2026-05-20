import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Recycle, ShieldCheck, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductGrid } from '@/components/product-grid'
import { mockListings, mockUsers } from '@/lib/mock-data'
import { CATEGORY_LABELS, CATEGORY_ICONS, type Category } from '@/lib/types'

const categories: { key: Category; image: string }[] = [
  { key: 'femei', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=500&fit=crop' },
  { key: 'barbati', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop' },
  { key: 'copii', image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&h=500&fit=crop' },
  { key: 'incaltaminte', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop' },
  { key: 'accesorii', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop' },
  { key: 'casa-decor', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop' },
]

const features = [
  {
    icon: Recycle,
    title: 'Modă sustenabilă',
    description: 'Dă hainelor o a doua viață și reduce risipa de modă.',
  },
  {
    icon: ShieldCheck,
    title: 'Comunitate de încredere',
    description: 'Profiluri verificate și recenzii reale de la cumpărători.',
  },
  {
    icon: MessageCircle,
    title: 'Chat direct',
    description: 'Vorbește direct cu vânzătorul. Fă o ofertă, pune întrebări.',
  },
]

export default function HomePage() {
  const newArrivals = [...mockListings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 10)

  const popularItems = [...mockListings]
    .sort((a, b) => b.favorites - a.favorites)
    .slice(0, 6)

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/8 via-background to-accent/8">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:py-20">
          <div className="flex flex-col items-center text-center">
            <h1 className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              Modă second-hand pentru toți
            </h1>
            <p className="mt-4 max-w-md text-pretty text-base text-muted-foreground sm:text-lg">
              Cumpără și vinde haine, accesorii și mai mult. Direct, simplu, local.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild>
                <Link href="/search">
                  Cumpără acum
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/sell">Vinde acum</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto w-full max-w-7xl px-4 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">Categorii</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/search">
              Vezi tot <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
        {/* Mobile: horizontal scroll */}
        <div className="flex gap-3 overflow-x-auto pb-2 sm:hidden scrollbar-none">
          {categories.map(({ key, image }) => (
            <Link
              key={key}
              href={`/search?category=${key}`}
              className="group relative flex-shrink-0 w-28 aspect-[3/4] overflow-hidden rounded-xl"
            >
              <Image src={image} alt={CATEGORY_LABELS[key]} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="112px" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <span className="text-xs font-semibold text-white leading-tight block">{CATEGORY_LABELS[key]}</span>
              </div>
            </Link>
          ))}
        </div>
        {/* Desktop: grid */}
        <div className="hidden sm:grid grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map(({ key, image }) => (
            <Link
              key={key}
              href={`/search?category=${key}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-xl"
            >
              <Image src={image} alt={CATEGORY_LABELS[key]} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 768px) 33vw, 16vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <span className="text-sm font-semibold text-white">{CATEGORY_LABELS[key]}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border bg-muted/40 py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-6 sm:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4 sm:flex-col sm:items-center sm:text-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="mx-auto w-full max-w-7xl px-4 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">Adăugate recent</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/search?sort=newest">
              Vezi tot <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
        <ProductGrid listings={newArrivals} />
      </section>

      {/* Popular */}
      <section className="bg-muted/30 py-10">
        <div className="mx-auto w-full max-w-7xl px-4">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">Populare acum</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/search?sort=popular">
                Vezi tot <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          <ProductGrid listings={popularItems} />
        </div>
      </section>

      {/* Top sellers */}
      <section className="mx-auto w-full max-w-7xl px-4 py-10">
        <h2 className="text-xl font-bold text-foreground sm:text-2xl mb-5">Top vânzători</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-5 sm:overflow-visible scrollbar-none">
          {mockUsers.map((user) => (
            <Link
              key={user.id}
              href={`/user/${user.id}`}
              className="flex flex-col items-center gap-2 rounded-xl bg-card p-4 text-center shrink-0 w-36 sm:w-auto hover:shadow-sm transition-shadow"
            >
              <div className="relative">
                <Image
                  src={user.avatar}
                  alt={user.username}
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
                {user.isVerified && (
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">✓</span>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground truncate max-w-[100px]">
                  {user.shopName || user.username}
                </p>
                <p className="text-xs text-muted-foreground">{user.itemsSold} vânduți</p>
                <p className="text-xs text-muted-foreground">{user.followers} urmăritori</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-14 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Gata să golești dulapul?</h2>
          <p className="mx-auto mt-3 max-w-md text-primary-foreground/80 text-sm sm:text-base">
            Listează gratuit primele 3 produse. Nu ai nevoie de card bancar.
          </p>
          <Button size="lg" variant="secondary" className="mt-6" asChild>
            <Link href="/sell">Începe să vinzi</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
