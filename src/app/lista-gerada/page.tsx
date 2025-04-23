"use client"

import { useEffect, useState } from "react"

export default function ListaGerada() {
  const [questoes, setQuestoes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [objetivo, setObjetivo] = useState("")
  const [banca, setBanca] = useState("")

  useEffect(() => {
    const fetchQuestoes = async () => {
      try {
        const dadosSalvos = sessionStorage.getItem("dadosLista")
        if (!dadosSalvos) throw new Error("Nenhum dado encontrado no sessionStorage.")

        const parsed = JSON.parse(dadosSalvos)
        setObjetivo(parsed.objetivo || "")
        setBanca(parsed.banca || "")

        const res = await fetch("/api/gerar-lista", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: dadosSalvos
        })

        if (!res.ok) throw new Error("Erro na resposta da API")
        const data = await res.json()

        if (data && data.questoes) {
          setQuestoes(data.questoes)
        } else {
          throw new Error("Campo 'questoes' indefinido na resposta")
        }
      } catch (error) {
        console.error("Erro ao gerar lista:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestoes()
  }, [])

  const questoesPorMateria: Record<string, any[]> = {}
  questoes.forEach((q) => {
    if (!questoesPorMateria[q.materia]) questoesPorMateria[q.materia] = []
    questoesPorMateria[q.materia].push(q)
  })

  if (questoes.length === 0 && !loading) {
    return <p className="text-center text-gray-500">Nenhuma questão foi gerada com os parâmetros selecionados.</p>
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Lista Gerada</h1>

      {loading ? (
        <p className="text-gray-600">Carregando questões...</p>
      ) : (
        <div>
          <div className="bg-gray-100 border p-4 rounded mb-6">
            <p><strong>Objetivo:</strong> {objetivo}</p>
            {banca && <p><strong>Banca:</strong> {banca}</p>}
            <p><strong>Total de Questões:</strong> {questoes.length}</p>
            <div className="mt-4 flex gap-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded">Refazer Lista</button>
              <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded">Exportar PDF</button>
            </div>
          </div>

          {Object.entries(questoesPorMateria).map(([materia, questoes]) => (
            <div key={materia} className="mb-8">
              <h2 className="text-xl font-semibold mb-4">📘 {materia} — {questoes.length} questões</h2>
              {questoes.map((q, idx) => (
                <div key={idx} className="mb-6 p-4 border rounded">
                  <p className="mb-2">{idx + 1}. {q.enunciado}</p>
                  <ul className="list-disc pl-6">
                    {q.alternativas.map((alt: string, i: number) => (
                      <li key={i}>{alt}</li>
                    ))}
                  </ul>
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-blue-600">Mostrar Resposta</summary>
                    <p className="mt-1">Correta: <strong>{q.resposta}</strong></p>
                  </details>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
