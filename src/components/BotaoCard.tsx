export function BotaoCard({ titulo, icone, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#D0E3FF] rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition cursor-pointer flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="text-[#2D81F7] text-3xl mb-2">{icone}</div>
      <p className="text-[#171717] font-semibold">{titulo}</p>
    </div>
  )
}
