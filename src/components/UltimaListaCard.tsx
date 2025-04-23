type UltimaListaCardProps = {
  materia: string
  prova: string
  data: string
  progresso: number
  onAcessar: () => void
}

export function UltimaListaCard({
  materia,
  prova,
  data,
  progresso,
  onAcessar
}: UltimaListaCardProps) {
  return (
    <div className="bg-white border border-[#E3F0FF] rounded-2xl px-8 pt-6 pb-8 shadow-sm text-[#171717] w-full flex flex-col justify-between">
      {/* Título fixo */}
      <h2 className="text-sm font-medium mb-4">Última lista gerada</h2>

      {/* Conteúdo centralizado verticalmente */}
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="text-xl font-bold mb-1">{materia}</h3>
        <p className="text-sm text-[#444]">{prova}</p>
        <p className="text-xs text-[#888] mt-1">{data}</p>

        {/* Barra de progresso */}
        <div className="mt-4">
          <div className="w-full h-2 rounded bg-[#E3F0FF]">
            <div
              className="h-2 bg-[#2D81F7] rounded"
              style={{ width: `${progresso}%` }}
            />
          </div>
          <p className="text-xs mt-1 text-[#2D81F7] font-medium">Progresso {progresso}%</p>
        </div>

        {/* Botão */}
        <button
          onClick={onAcessar}
          className="mt-4 bg-[#2D81F7] text-white text-sm font-medium px-4 py-2 rounded hover:opacity-90"
        >
          Acessar
        </button>
      </div>
    </div>
  )
}
