type Props = {
    titulo: string
    data: string
    onClick?: () => void
  }
  
  export default function ListaCard({ titulo, data, onClick }: Props) {
    return (
      <div
        className="bg-[#E3F0FF] text-[#171717] p-4 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
        onClick={onClick}
      >
        <h2 className="text-lg font-semibold">{titulo}</h2>
        <p className="text-sm mt-1">{data}</p>
      </div>
    )
  }
  