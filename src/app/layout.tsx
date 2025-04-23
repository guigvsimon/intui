import './globals.css'
import type { ReactNode } from 'react'
import { Navbar } from '@/components/Navbar'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '600', '700'] })


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${montserrat.className} bg-[#FFFFFF] text-[#171717]`}>
        <Navbar />
        <main className="max-w-6xl mx-auto p-4 mt-20">{children}</main>
      </body>
    </html>
  )
}

