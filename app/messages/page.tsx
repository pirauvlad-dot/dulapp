'use client'
import { MessageCircle } from 'lucide-react'

export default function MessagesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-4">
      <MessageCircle className="h-16 w-16 text-muted-foreground" />
      <h1 className="text-xl font-bold text-foreground">Mesaje</h1>
      <p className="text-muted-foreground">Contactează un vânzător de pe pagina unui produs.</p>
    </div>
  )
}
