import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, FileText, Users, Building2 } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Offer-Ops Dashboard',
  description: 'Professional offer management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 border-r bg-slate-50 dark:bg-slate-900 p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">Offer-Ops</h2>
              <p className="text-sm text-muted-foreground">Dashboard</p>
            </div>
            
            <nav className="space-y-2">
              <Link href="/">
                <Button variant="ghost" className="w-full justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link href="/offers">
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Offers
                </Button>
              </Link>
              <Link href="/buyers">
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Buyers
                </Button>
              </Link>
              <Link href="/publishers">
                <Button variant="ghost" className="w-full justify-start">
                  <Building2 className="mr-2 h-4 w-4" />
                  Publishers
                </Button>
              </Link>
              
              <div className="pt-4 mt-4 border-t">
                <p className="text-xs text-gray-500 px-3 mb-2">ADMIN ONLY</p>
                <Link href="/admin/offer-mapping">
                  <Button variant="ghost" className="w-full justify-start text-red-600">
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    ID Mapping
                  </Button>
                </Link>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
