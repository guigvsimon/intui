"use client"

import { useEffect, useState } from "react"

interface Questao {
  id: string
  enunciado: string
  resposta: string
  alternativas?: string[]
  imagem_url?: string
}

interface QuestionCarouselProps {
  questoes: Questao[]
  onComplete?: (respostas: Record<string, { escolha: any; correta: boolean }>) => void
}

export default function QuestionCarousel({ questoes, onComplete }: QuestionCarouselProps) {
  const total = questoes.length
  const [index, setIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, { escolha: any; correta: boolean | null }>>({})

  // Carrega respostas salvas
  useEffect(() => {
    const raw = sessionStorage.getItem('usuario_respostas')
    if (raw) {
      try {
        const saved = JSON.parse(raw)
        setResponses(saved)
        const firstUnanswered = questoes.findIndex(q => !(q.id in saved))
        setIndex(firstUnanswered >= 0 ? firstUnanswered : total - 1)
      } catch {
        // ignore
      }
    }
  }, [questoes, total])

  // Salva respostas e dispara onComplete
  useEffect(() => {
    sessionStorage.setItem('usuario_respostas', JSON.stringify(responses))
    const answeredCount = Object.keys(responses).length
    const allAnswered = answeredCount === total && Object.values(responses).every(r => r.correta !== null)
    if (allAnswered && onComplete) {
      onComplete(responses as Record<string, { escolha: any; correta: boolean }>)
    }
  }, [responses, total, onComplete])

  if (total === 0) return <p>Nenhuma questão disponível.</p>

  const current = questoes[index]
  const userResp = responses[current.id] ?? { escolha: null, correta: null }

  const choose = (alt: any) => {
    setResponses(prev => ({
      ...prev,
      [current.id]: { escolha: alt, correta: prev[current.id]?.correta ?? null }
    }))
  }

  const confirm = () => {
    const isCorrect = userResp.escolha === current.resposta
    setResponses(prev => ({
      ...prev,
      [current.id]: { escolha: prev[current.id].escolha, correta: isCorrect }
    }))
  }

  const disabledConfirm = userResp.escolha == null || userResp.correta !== null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button onClick={() => setIndex(i => Math.max(i - 1, 0))} disabled={index === 0} className="px-2 py-1 bg-gray-200 rounded">Anterior</button>
        <span>{index + 1} / {total}</span>
        <button onClick={() => setIndex(i => Math.min(i + 1, total - 1))} disabled={index === total - 1} className="px-2 py-1 bg-gray-200 rounded">Próxima</button>
      </div>

      <div className="p-4 border rounded">
        <p className="mb-4 font-semibold">{current.enunciado}</p>
        {current.imagem_url && <img src={current.imagem_url} alt="Questão" className="mb-4 max-w-full" />}

        {current.alternativas ? (
          <ul className="space-y-2">
            {current.alternativas.map((alt, i) => (
              <li key={i}>
                <button
                  onClick={() => choose(alt)}
                  className={`w-full text-left px-4 py-2 border rounded ${userResp.escolha === alt ? 'bg-blue-100' : ''}`}
                >{alt}</button>
              </li>
            ))}
          </ul>
        ) : (
          <input
            type="text"
            value={userResp.escolha || ''}
            onChange={e => choose(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        )}

        <button
          onClick={confirm}
          disabled={disabledConfirm}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >Confirmar</button>

        {userResp.correta !== null && (
          <p className={`mt-2 font-semibold ${userResp.correta ? 'text-green-600' : 'text-red-600'}`}>  
            {userResp.correta ? 'Correto!' : `Incorreto! Resposta certa: ${current.resposta}`}  
          </p>
        )}
      </div>
    </div>
  )
}
