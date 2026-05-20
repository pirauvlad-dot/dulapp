'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth-context'
import {
  CATEGORY_LABELS, CONDITION_LABELS, SIZES, BRANDS, COLORS,
  MOLDOVA_CITIES, PLAN_LIMITS, type Category, type Condition,
} from '@/lib/types'
import Link from 'next/link'

export default function SellPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [published, setPublished] = useState(false)

  const planLimit = user ? PLAN_LIMITS[user.plan] : 3
  const activeCount = user?.activeListingsCount ?? 0
  const atLimit = activeCount >= planLimit

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-3">Trebuie să fii autentificat</h1>
        <p className="text-muted-foreground mb-6">Intră în cont sau creează un cont gratuit pentru a posta.</p>
        <div className="flex gap-3 justify-center">
          <Button asChild><Link href="/login">Intră în cont</Link></Button>
          <Button variant="outline" asChild><Link href="/register">Înregistrează-te</Link></Button>
        </div>
      </div>
    )
  }

  if (published) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Anunț publicat!</h1>
        <p className="text-muted-foreground mb-6">Produsul tău este acum vizibil pe Dulapp.</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => setPublished(false)}>Adaugă alt produs</Button>
          <Button variant="outline" asChild><Link href="/dashboard">Produsele mele</Link></Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Adaugă produs</h1>

      {/* Plan limit warning */}
      <div className={`rounded-xl p-4 mb-6 flex items-start gap-3 ${atLimit ? 'bg-red-50 border border-red-200' : 'bg-muted/50'}`}>
        <AlertCircle className={`h-5 w-5 shrink-0 mt-0.5 ${atLimit ? 'text-red-500' : 'text-muted-foreground'}`} />
        <div className="flex-1">
          <p className={`text-sm font-medium ${atLimit ? 'text-red-700' : 'text-foreground'}`}>
            {activeCount} din {planLimit === Infinity ? '∞' : planLimit} anunțuri active
          </p>
          {atLimit ? (
            <p className="text-sm text-red-600 mt-1">
              Ai atins limita planului tău. Șterge un anunț activ sau{' '}
              <Link href="/subscription" className="underline font-medium">upgrade la un plan mai mare</Link>.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground mt-0.5">
              Plan: {user?.plan} · <Link href="/subscription" className="underline">Upgrade</Link>
            </p>
          )}
        </div>
      </div>

      {atLimit ? null : (
        <SellForm onPublish={() => setPublished(true)} />
      )}
    </div>
  )
}

function SellForm({ onPublish }: { onPublish: () => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState<Category | ''>('')
  const [condition, setCondition] = useState<Condition | ''>('')
  const [size, setSize] = useState('')
  const [brand, setBrand] = useState('')
  const [color, setColor] = useState('')
  const [city, setCity] = useState('')

  const categories = Object.entries(CATEGORY_LABELS) as [Category, string][]
  const conditions = Object.entries(CONDITION_LABELS) as [Condition, string][]

  const canPublish = title && price && category && condition && city

  return (
    <div className="space-y-5">
      {/* Photos */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Fotografii *</label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary/50 transition-colors bg-muted/30"
            >
              <Upload className="h-5 w-5 text-muted-foreground" />
              {i === 0 && <span className="text-[10px] text-muted-foreground">Principal</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">Titlu *</label>
        <Input
          placeholder="ex: Palton Zara, măr. M, camel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={80}
        />
        <p className="text-xs text-muted-foreground mt-1">{title.length}/80 caractere</p>
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">Descriere *</label>
        <Textarea
          placeholder="Descrie produsul tău: stare, caracteristici, de ce îl vinzi..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground mt-1">{description.length}/500 caractere</p>
      </div>

      {/* Price */}
      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">Preț (lei) *</label>
        <div className="relative">
          <Input
            type="number"
            placeholder="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="pr-12"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">lei</span>
        </div>
      </div>

      {/* Row: Category + Condition */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Categorie *</label>
          <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
            <SelectTrigger><SelectValue placeholder="Alege" /></SelectTrigger>
            <SelectContent>
              {categories.map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Stare *</label>
          <Select value={condition} onValueChange={(v) => setCondition(v as Condition)}>
            <SelectTrigger><SelectValue placeholder="Alege" /></SelectTrigger>
            <SelectContent>
              {conditions.map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row: Size + Brand */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Mărime</label>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger><SelectValue placeholder="Opțional" /></SelectTrigger>
            <SelectContent>
              {SIZES.haine.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Brand</label>
          <Select value={brand} onValueChange={setBrand}>
            <SelectTrigger><SelectValue placeholder="Opțional" /></SelectTrigger>
            <SelectContent>
              {BRANDS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row: Color + City */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Culoare</label>
          <Select value={color} onValueChange={setColor}>
            <SelectTrigger><SelectValue placeholder="Opțional" /></SelectTrigger>
            <SelectContent>
              {COLORS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Localitate *</label>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger><SelectValue placeholder="Alege" /></SelectTrigger>
            <SelectContent>
              {MOLDOVA_CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          className="flex-1 h-12"
          disabled={!canPublish}
          onClick={onPublish}
        >
          Publică anunțul
        </Button>
        <Button variant="outline" className="h-12 px-5">Ciornă</Button>
      </div>

      {!canPublish && (
        <p className="text-xs text-muted-foreground text-center">
          * Câmpurile marcate cu * sunt obligatorii
        </p>
      )}
    </div>
  )
}
