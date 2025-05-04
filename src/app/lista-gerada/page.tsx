"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import QuestionCarousel from "@/components/QuestionCarousel"

interface Questao {
  id: string
  enunciado: string
  resposta: string
  alternativas?: string[]
  imagem_url?: string
}

export default function ListaGerada() {
  const router = useRouter()
  const [questoes, setQuestoes] = useState<Questao[]>([])
  const [listaId, setListaId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [responses, setResponses] = useState<Record<string, { escolha: any; correta: boolean }>>({})
  const [completed, setCompleted] = useState(false)

  // Carrega questões e ID da lista
  useEffect(() => {
    const raw = sessionStorage.getItem("resultadoLista")
    if (!raw) {
      setErro("Nenhum dado de lista encontrado. Gere uma lista primeiro.")
      setLoading(false)
      return
    }
    try {
      const data = JSON.parse(raw)
      if (!Array.isArray(data.questoes) || !data.lista_id) {
        setErro("Formato inválido: dados incompletos.")
      } else {
        setQuestoes(data.questoes)
        setListaId(data.lista_id)
      }
    } catch {
      setErro("Falha ao ler os dados salvos.")
    } finally {
      setLoading(false)
    }
  }, [])

  // Estatísticas em tempo real
  const total = questoes.length
  const totalResp = Object.keys(responses).length
  const acertos = Object.values(responses).filter(r => r.correta).length
  const errosCount = totalResp - acertos
  const percentual = total > 0 ? Math.round((totalResp / total) * 100) : 0
  const allAnswered = totalResp === total

  // Salva progresso atual
  const salvarProgresso = async () => {
    if (!listaId) return
    try {
      const res = await fetch('/api/estatisticas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lista_id: listaId,
          total_questoes: total,
          respondidas: totalResp,
          acertos,
          erros: errosCount,
          percentual
        })
      })
      if (!res.ok) {
        let msg = `Status ${res.status}`
        try {
          const errJson = await res.json()
          msg = errJson.error || msg
        } catch {}
        console.error('Erro ao salvar progresso:', msg)
        alert('Erro ao salvar progresso: ' + msg)
        return
      }
      const data = await res.json()
      console.log('Progresso salvo:', data)
      alert('Progresso salvo com sucesso!')
    } catch (err: any) {
      console.error('Falha ao salvar progresso:', err)
      alert('Erro ao salvar progresso: ' + err.message)
    }
  }

  // Finaliza lista somente se todas respondidas
  const finalizarLista= () => {
    if (allAnswered) setCompleted(true)
  }

  // Callback quando todas respondidas no carousel
  const handleComplete = (res: Record<string, { escolha: any; correta: boolean }>) => {
    setResponses(res)
    setCompleted(true)
  }

  if (loading) return <p className="text-center py-10">Carregando questões...</p>
  if (erro) return <p className="text-red-500 text-center py-10">{erro}</p>
  if (questoes.length === 0) return <p className="text-center py-10">Nenhuma questão encontrada.</p>

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Lista Prática</h1>

      {/* Controles de progresso */}
      <div className="flex justify-end gap-2 mb-6">
        <button
          onClick={salvarProgresso}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >Salvar Progresso</button>
        <button
          onClick={finalizarLista}
          disabled={!allAnswered}
          className={`px-4 py-2 rounded ${allAnswered ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
        >Finalizar Lista</button>
      </div>

      {/* Painel de estatísticas em tempo real */}
      <div className="mb-6 p-4 bg-gray-100 border rounded">
        <p>
          <strong>Respondidas:</strong> {totalResp}/{total} ({percentual}%) •
          <strong> Acertos:</strong> {acertos} •
          <strong> Erros:</strong> {errosCount}
        </p>
      </div>

      {/* Carousel de Questões */}
      <QuestionCarousel questoes={questoes} onComplete={handleComplete} />

      {/* Resumo final */}
      {completed && (
        <div className="mt-8 p-4 bg-gray-100 border rounded">
          <p><strong>Progresso final:</strong> {totalResp}/{total} ({percentual}%)</p>
          <p><strong>Acertos:</strong> {acertos}</p>
          <p><strong>Erros:</strong> {errosCount}</p>
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={() => router.push('/criar-lista')}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >Nova Lista</button>
            <button
              onClick={() => window.print()}
              className="border border-blue-600 text-blue-600 px-4 py-2 rounded"
            >Exportar PDF</button>
          </div>
        </div>
      )}
    </div>
  )
}
