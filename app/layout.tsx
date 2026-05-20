import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { AuthProvider } from '@/lib/auth-context'
import { Header } from '@/components/header'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

export const metadata: Metadata = {
  title: 'Dulapp — Modă second-hand din Moldova',
  description: 'Cumpără și vinde haine, accesorii și mai mult. Piața second-hand din Moldova.',
  keywords: ['second-hand', 'haine', 'moldova', 'vinde', 'cumpara', 'dulapp'],
}

export const viewport: Viewport = {
  themeColor: '#0d9488',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={geist.variable}>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-background">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border bg-card py-8 mt-auto">
            <div className="mx-auto max-w-7xl px-4">
              <div className="grid gap-8 grid-cols-2 sm:grid-cols-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
                      <span className="text-xs font-bold text-primary-foreground">D</span>
                    </div>
                    <span className="font-bold text-foreground">dulapp</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Piața second-hand din Moldova</p>
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-foreground">Dulapp</h3>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li><a href="#" className="hover:text-foreground">Despre noi</a></li>
                    <li><a href="#" className="hover:text-foreground">Cum funcționează</a></li>
                    <li><a href="/subscription" className="hover:text-foreground">Planuri & Prețuri</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-foreground">Ajutor</h3>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li><a href="#" className="hover:text-foreground">Centru de ajutor</a></li>
                    <li><a href="#" className="hover:text-foreground">Cum să vinzi</a></li>
                    <li><a href="#" className="hover:text-foreground">Siguranță</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-foreground">Legal</h3>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li><a href="#" className="hover:text-foreground">Politica de confidențialitate</a></li>
                    <li><a href="#" className="hover:text-foreground">Termeni și condiții</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
                <p>© {new Date().getFullYear()} Dulapp. Toate drepturile rezervate.</p>
                <p>🇲🇩 Făcut cu drag în Moldova</p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
