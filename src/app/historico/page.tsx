"use client"

import { useState, useMemo } from "react";
import Link from "next/link";
import { Download, Trash2 } from "lucide-react";

interface ListaItem {
  id: string;
  nome: string;
  data: string;
  objetivo: string;
  materia: string;
}

const dadosMock: ListaItem[] = [
  { id: "1", nome: "Simulado ENEM - Matemática", data: "2024-04-20", objetivo: "ENEM", materia: "Matemática" },
  { id: "2", nome: "Concurso - Direito", data: "2024-04-19", objetivo: "CESPE", materia: "Direito" },
  { id: "3", nome: "Vestibular - Física", data: "2024-04-18", objetivo: "Fuvest", materia: "Física" },
];

export default function HistoricoPage() {
  const [filtroData, setFiltroData] = useState("");
  const [filtroObjetivo, setFiltroObjetivo] = useState("");
  const [filtroMateria, setFiltroMateria] = useState("");

  const objetivos = useMemo(() => Array.from(new Set(dadosMock.map(d => d.objetivo))), []);
  const materias = useMemo(() => Array.from(new Set(dadosMock.map(d => d.materia))), []);

  const filtrado = useMemo(() => {
    return dadosMock.filter(item => {
      if (filtroData && item.data !== filtroData) return false;
      if (filtroObjetivo && item.objetivo !== filtroObjetivo) return false;
      if (filtroMateria && item.materia !== filtroMateria) return false;
      return true;
    });
  }, [filtroData, filtroObjetivo, filtroMateria]);

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
          placeholder="Data"
        />
        <select
          value={filtroObjetivo}
          onChange={e => setFiltroObjetivo(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Selecionar objetivo</option>
          {objetivos.map(obj => (
            <option key={obj} value={obj}>{obj}</option>
          ))}
        </select>
        <select
          value={filtroMateria}
          onChange={e => setFiltroMateria(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Selecionar matéria</option>
          {materias.map(mat => (
            <option key={mat} value={mat}>{mat}</option>
          ))}
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
              <th className="py-2 px-3">Matéria</th>
              <th className="py-2 px-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrado.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3">{item.nome}</td>
                <td className="py-2 px-3">{new Date(item.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                <td className="py-2 px-3">{item.objetivo}</td>
                <td className="py-2 px-3">{item.materia}</td>
                <td className="py-2 px-3 text-right flex justify-end items-center gap-4">
                  <Link href={`/historico/${item.id}`} className="text-blue-600 hover:underline">Visualizar</Link>
                  <button aria-label="Baixar PDF"><Download size={16} className="text-blue-600 hover:text-blue-800"/></button>
                  <button aria-label="Excluir"><Trash2 size={16} className="text-red-600 hover:text-red-800"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
