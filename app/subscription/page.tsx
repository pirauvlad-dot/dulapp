'use client'

import { Check, Zap, Shield, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { PLAN_LABELS, PLAN_LIMITS, PLAN_PRICES, type Plan } from '@/lib/types'
import { cn } from '@/lib/utils'

const plans: { key: Plan; features: string[]; highlighted?: boolean }[] = [
  {
    key: 'free',
    features: ['3 anunțuri active', 'Chat cu cumpărătorii', 'Profil public', 'Recenzii'],
  },
  {
    key: 'starter',
    features: ['20 anunțuri active', 'Toate din Gratuit', 'Statistici de bază', 'Suport prioritar'],
  },
  {
    key: 'pro',
    highlighted: true,
    features: ['100 anunțuri active', 'Toate din Starter', 'Banner de profil', 'Boost 1 produs/lună', 'Badge verificat inclus'],
  },
  {
    key: 'unlimited',
    features: ['Anunțuri nelimitate', 'Toate din Pro', 'Boost nelimitat', 'Suport dedicat', 'Cont magazin official'],
  },
]

export default function SubscriptionPage() {
  const { user, isAuthenticated } = useAuth()

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Planuri & Prețuri</h1>
        <p className="mt-2 text-muted-foreground">Alege planul potrivit pentru tine. Poți schimba oricând.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map(({ key, features, highlighted }) => (
          <div
            key={key}
            className={cn(
              'relative flex flex-col rounded-2xl border bg-card p-5',
              highlighted
                ? 'border-primary shadow-md ring-1 ring-primary'
                : 'border-border'
            )}
          >
            {highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                  Popular
                </span>
              </div>
            )}

            <div className="mb-4">
              <h3 className="font-semibold text-foreground">{PLAN_LABELS[key]}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">
                  {PLAN_PRICES[key] === 0 ? 'Gratuit' : `${PLAN_PRICES[key]} lei`}
                </span>
                {PLAN_PRICES[key] > 0 && (
                  <span className="text-sm text-muted-foreground">/lună</span>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {PLAN_LIMITS[key] === Infinity ? 'Anunțuri nelimitate' : `Până la ${PLAN_LIMITS[key]} anunțuri`}
              </p>
            </div>

            <ul className="flex-1 space-y-2 mb-5">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              variant={highlighted ? 'default' : 'outline'}
              className="w-full"
              disabled={isAuthenticated && user?.plan === key}
            >
              {isAuthenticated && user?.plan === key
                ? 'Plan curent'
                : key === 'free'
                ? 'Gratuit'
                : 'Selectează'}
            </Button>
          </div>
        ))}
      </div>

      {/* Extras */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-foreground mb-5">Extra servicii</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100">
                <Zap className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="font-semibold text-foreground">Boost anunț</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Anunțul tău apare în primele rezultate timp de 7 zile. Mai multe vizualizări, mai mulți cumpărători.
            </p>
            <p className="text-lg font-bold text-foreground">25 lei <span className="text-sm font-normal text-muted-foreground">/ 7 zile</span></p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-foreground">Badge verificat</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Contul tău apare cu badge ✓ de verificat. Mai multă încredere din partea cumpărătorilor.
            </p>
            <p className="text-lg font-bold text-foreground">100 lei <span className="text-sm font-normal text-muted-foreground">/ an</span></p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-foreground">Banner profil</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Adaugă un banner personalizat pe profilul tău. Inclus în planul Pro și Unlimited.
            </p>
            <p className="text-sm text-muted-foreground">Inclus în planul <strong>Pro</strong></p>
          </div>
        </div>
      </div>
    </div>
  )
}
