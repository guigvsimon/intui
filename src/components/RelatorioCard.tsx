type RelatorioCardProps = {
  totalListas: number
  totalQuestoes: number
  taxaAcertos: number
}

export function RelatorioCard({ totalListas, totalQuestoes, taxaAcertos }: RelatorioCardProps) {
  return (
    <div className="bg-white border border-[#E3F0FF] rounded-2xl px-8 pt-6 pb-8 shadow-sm text-[#171717] w-full flex flex-col justify-between">
      {/* Título fixo no topo */}
      <h2 className="text-sm font-medium mb-4">Seu relatório</h2>

      {/* Blocos centralizados verticalmente */}
      <div className="flex-1 flex items-center justify-between text-center">
        {/* Listas criadas */}
        <div className="flex-1">
          <p className="text-3xl font-extrabold mb-1">{totalListas}</p>
          <p className="text-sm text-[#555]">Total de listas criadas</p>
        </div>

        {/* Divisor */}
        <div className="w-px h-12 bg-[#E3F0FF] mx-6" />

        {/* Questões respondidas */}
        <div className="flex-1">
          <p className="text-3xl font-extrabold mb-1">{totalQuestoes}</p>
          <p className="text-sm text-[#555]">Questões respondidas</p>
        </div>

        {/* Divisor */}
        <div className="w-px h-12 bg-[#E3F0FF] mx-6" />

        {/* Taxa de acertos */}
        <div className="flex-1">
          <p className="text-3xl font-extrabold text-[#2D81F7] mb-1">{taxaAcertos}%</p>
          <p className="text-sm text-[#555]">Taxa de acertos</p>
        </div>
      </div>
    </div>
  )
}
