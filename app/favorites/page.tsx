'use client'
import { Heart } from 'lucide-react'

export default function FavoritesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-4">
      <Heart className="h-16 w-16 text-muted-foreground" />
      <h1 className="text-xl font-bold text-foreground">Salvate</h1>
      <p className="text-muted-foreground">Produsele salvate vor apărea aici.</p>
    </div>
  )
}
