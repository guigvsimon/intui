'use client'

import { RelatorioCard } from '@/components/RelatorioCard'
import { UltimaListaCard } from '@/components/UltimaListaCard'
import { BotaoCard } from '@/components/BotaoCard'
import { Plus, Clock, Settings } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Linha superior: Relatório + Última Lista - Alterar para histórico real*/}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RelatorioCard totalListas={5} totalQuestoes={100} taxaAcertos={85} />
        <UltimaListaCard
          materia="Matemática"
          prova="UFRGS – 15 questões"
          data="15 de abril de 2025"
          progresso={75}
          onAcessar={() => alert('Abrir lista')}
        />
      </div>

      {/* Linha inferior: Ações rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <BotaoCard
          titulo="Criar nova lista"
          icone={<Plus size={28} />}
          onClick={() => alert('Criar nova lista')}
        />
        <BotaoCard
          titulo="Ver histórico"
          icone={<Clock size={28} />}
          onClick={() => alert('Ver histórico')}
        />
        <BotaoCard
          titulo="Configurações"
          icone={<Settings size={28} />}
          onClick={() => alert('Abrir configurações')}
        />
      </div>

      <footer className="text-xs text-[#7C7A7A] text-center mt-12">Versão 1.0</footer>
    </div>
  )
}
