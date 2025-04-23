'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) =>
    path === '/'
      ? pathname === '/'
      : pathname.startsWith(path)

  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b border-[#E3F0FF] z-50">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Esquerda: logo + links */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-extrabold text-[#2D81F7] tracking-tight"
          >
            intui
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm font-medium text-[#171717]">
            <Link
              href="/dashboard"
              className={`${
                isActive('/dashboard') ? 'text-[#2D81F7] font-semibold' : 'hover:text-[#2D81F7]'
              }`}
            >
              Início
            </Link>
            <Link
              href="/criar-lista"
              className={`${
                isActive('/criar-lista') ? 'text-[#2D81F7] font-semibold' : 'hover:text-[#2D81F7]'
              }`}
            >
              Criar Lista
            </Link>
            <Link
              href="/historico"
              className={`${
                isActive('/historico') ? 'text-[#2D81F7] font-semibold' : 'hover:text-[#2D81F7]'
              }`}
            >
              Histórico
            </Link>
            <Link
              href="/conta"
              className={`${
                isActive('/conta') ? 'text-[#2D81F7] font-semibold' : 'hover:text-[#2D81F7]'
              }`}
            >
              Conta
            </Link>
          </div>
        </div>

        {/* Direita: avatar */}
        <Image
          src="https://i.pravatar.cc/40?u=perfil"
          alt="Perfil"
          width={32}
          height={32}
          className="rounded-full border border-[#E3F0FF] hover:opacity-90 cursor-pointer"
        />
      </nav>
    </header>
  )
}
