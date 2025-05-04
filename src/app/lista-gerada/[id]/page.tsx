"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Download, Trash2 } from "lucide-react"
import { supabase } from '@/lib/supabaseClient'

interface HistoricoItem {
  id: string;
  nome: string;
  data: string;
  objetivo: string;
  respondidas: number;
  total_questoes: number;
  acertos: number;
  erros: number;
  percentual: number;
}

export default function HistoricoPage() {
  const router = useRouter()
  const [items, setItems] = useState<HistoricoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtroData, setFiltroData] = useState("")
  const [filtroObjetivo, setFiltroObjetivo] = useState("")

  // Carrega histórico do usuário
  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const { data, error } = await supabase
          .from('estatisticas')
          .select(
            `
              id,
              total_questoes,
              respondidas,
              acertos,
              erros,
              percentual,
              criado_em,
              lista: listas(id, nome, objetivo)
            `
          )
          .order('criado_em', { ascending: false })
        if (error) throw error
        const parsed = (data || []).map((stat: any) => ({
          id: stat.id,
          nome: stat.lista.nome,
          data: stat.criado_em,
          objetivo: stat.lista.objetivo,
          respondidas: stat.respondidas,
          total_questoes: stat.total_questoes,
          acertos: stat.acertos,
          erros: stat.erros,
          percentual: stat.percentual
        }))
        setItems(parsed)
      } catch (err: any) {
        console.error('Erro ao buscar histórico:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchHistorico()
  }, [])

  // Exclui histórico
  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este registro permanentemente?')) return
    try {
      const { error } = await supabase
        .from('estatisticas')
        .delete()
        .eq('id', id)
      if (error) throw error
      setItems(prev => prev.filter(item => item.id !== id))
    } catch (err: any) {
      console.error('Erro ao excluir:', err)
      alert('Erro ao excluir: ' + err.message)
    }
  }

  const objetivos = useMemo(() => Array.from(new Set(items.map(i => i.objetivo))), [items])

  const filtrado = useMemo(() =>
    items.filter(item => {
      if (filtroData && item.data.slice(0, 10) !== filtroData) return false
      if (filtroObjetivo && item.objetivo !== filtroObjetivo) return false
      return true
    }),
    [items, filtroData, filtroObjetivo]
  )

  if (loading) return <p className="text-center py-10">Carregando histórico...</p>
  if (error) return <p className="text-red-500 text-center py-10">{error}</p>
  if (items.length === 0) return <p className="text-center py-10">Nenhum registro de histórico encontrado.</p>

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Histórico de Listas</h1>
      <p className="text-gray-600 mb-6">Acompanhe suas listas anteriores e continue estudando com eficiência</p>

      {/* Filtros */}
      <div className="flex gap-4 mb-6">
        <input
          type="date"
          value={filtroData}
          onChange={e => setFiltroData(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <select
          value={filtroObjetivo}
          onChange={e => setFiltroObjetivo(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Todos Objetivos</option>
          {objetivos.map(obj => <option key={obj} value={obj}>{obj}</option>)}
        </select>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-3">Nome</th>
              <th className="py-2 px-3">Data</th>
              <th className="py-2 px-3">Objetivo</th>
              <th className="py-2 px-3 text-right">Respondidas</th>
              <th className="py-2 px-3 text-right">Acertos</th>
              <th className="py-2 px-3 text-right">Erros</th>
              <th className="py-2 px-3 text-right">% Concluído</th>
              <th className="py-2 px-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrado.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3">{item.nome}</td>
                <td className="py-2 px-3">{new Date(item.data).toLocaleDateString('pt-BR')}</td>
                <td className="py-2 px-3">{item.objetivo}</td>
                <td className="py-2 px-3 text-right">{item.respondidas}/{item.total_questoes}</td>
                <td className="py-2 px-3 text-right">{item.acertos}</td>
                <td className="py-2 px-3 text-right">{item.erros}</td>
                <td className="py-2 px-3 text-right">{item.percentual}%</td>
                <td className="py-2 px-3 text-right flex justify-end items-center gap-4">
                  <button
                    onClick={() => router.push(`/lista/${item.id}`)}
                    className="text-blue-600 hover:underline"
                  >Visualizar</button>
                  <button aria-label="Baixar PDF"><Download size={16} className="text-blue-600 hover:text-blue-800"/></button>
                  <button onClick={() => handleDelete(item.id)} aria-label="Excluir"><Trash2 size={16} className="text-red-600 hover:text-red-800"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
    