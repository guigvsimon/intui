type Props = {
    children: React.ReactNode
    onClick?: () => void
    type?: 'button' | 'submit' | 'reset'
  }
  
  export default function Botao({ children, onClick, type = 'button' }: Props) {
    return (
      <button
        type={type}
        onClick={onClick}
        className="bg-[#2D81F7] text-white px-4 py-2 rounded hover:opacity-90 transition-colors"
      >
        {children}
      </button>
    )
  }
  