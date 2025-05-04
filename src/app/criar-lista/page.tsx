'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabaseClient'

export default function CriarLista() {
  const router = useRouter();

  // -- Novos estados --
  const usuarioId = "9e92716c-c71a-497c-9b40-70c860e6a231"; // substitua pelo UUID real do usuário
  const nomeLista = "Título da Lista";       // substitua pelo nome desejado

  // -- Estados principais --
  const [objetivo, setObjetivo] = useState<string>("");
  const [banca, setBanca] = useState<string>("");
  const [quantidade, setQuantidade] = useState<number>(15);
  const [personalizar, setPersonalizar] = useState<boolean>(false);
  const [quantidadesPorMateria, setQuantidadesPorMateria] = useState<Record<string, number>>({});
  const [materiasSelecionadas, setMateriasSelecionadas] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // -- Listas de opções --
  const vestibulares = ["Fuvest", "Unicamp", "UFRGS", "UFPR", "UFRJ"];
  const concursos   = ["INSS", "TJ", "PF", "PRF", "Receita Federal"];

  const materiasPorContexto: Record<string, string[]> = {
    ENEM: [
      "Língua Portuguesa", "Literatura", "Língua Estrangeira", "Artes",
      "Educação Física", "Tecnologias", "Matemática", "Biologia", "Química",
      "Física", "História", "Geografia", "Filosofia", "Sociologia"
    ],
    Vestibulares: [
      "Língua Portuguesa", "Literatura", "Língua Estrangeira", "Matemática",
      "Biologia", "Física", "Química", "História", "Geografia", "Filosofia", "Sociologia"
    ],
    INSS: [
      "Língua Portuguesa", "Ética no Serviço Público", "Direito Constitucional",
      "Direito Administrativo", "Informática", "Raciocínio Lógico-Matemático"
    ],
    TJ: [
      "Língua Portuguesa", "Matemática", "Direito Constitucional", "Direito Administrativo",
      "Direito Civil", "Direito Processual Civil", "Direito Penal",
      "Direito Processual Penal", "Informática", "Ética no Serviço Público"
    ],
    PF: [
      "Língua Portuguesa", "Direito Constitucional", "Direito Administrativo", "Direito Penal",
      "Direito Processual Penal", "Legislação Especial", "Raciocínio Lógico", "Informática",
      "Estatística", "Contabilidade Geral"
    ],
    PRF: [
      "Língua Portuguesa", "Legislação de Trânsito", "Direito Constitucional", "Direito Administrativo",
      "Direito Penal", "Direito Processual Penal", "Legislação Especial", "Raciocínio Lógico-Matemático",
      "Informática", "Física", "Ética e Cidadania", "Geopolítica", "Língua Estrangeira"
    ],
    "Receita Federal": [
      "Língua Portuguesa", "Língua Inglesa", "Raciocínio Lógico-Matemático", "Estatística",
      "Economia e Finanças Públicas", "Administração Geral", "Administração Pública",
      "Auditoria", "Contabilidade Geral e Pública", "Fluência em Dados", "Direito Constitucional",
      "Direito Administrativo", "Direito Tributário", "Legislação Aduaneira"
    ]
  };

  const contexto =
    objetivo === "ENEM" ? "ENEM"
    : objetivo === "Vestibulares" ? "Vestibulares"
    : banca;
  const materias = contexto ? materiasPorContexto[contexto] || [] : [];
  const contextoValido =
    objetivo === "ENEM" || objetivo === "Vestibulares" || Boolean(banca);

  // -- Helpers de seleção --
  function toggleItem(item: string, current: string, setter: (v: string) => void) {
    const novo = current === item ? "" : item;
    setter(novo);
    if (setter === setObjetivo) setBanca("");
    setMateriasSelecionadas([]);
    setQuantidadesPorMateria({});
  }

  function toggleMateria(materia: string) {
    setMateriasSelecionadas(prev => {
      const includes = prev.includes(materia);
      const next = includes ? prev.filter(m => m !== materia) : [...prev, materia];
      if (personalizar) {
        setQuantidadesPorMateria(old => {
          const copy = { ...old };
          if (includes) delete copy[materia];
          return copy;
        });
      }
      return next;
    });
  }

  function toggleTodasMaterias() {
    if (materiasSelecionadas.length === materias.length) {
      setMateriasSelecionadas([]);
    } else {
      setMateriasSelecionadas([...materias]);
    }
    setQuantidadesPorMateria({});
  }

  function handleQuantidadePersonalizada(materia: string, value: string) {
    const input = parseInt(value) || 0;
    const totalSemAtual = Object.entries(quantidadesPorMateria)
      .filter(([m]) => m !== materia)
      .reduce((acc, [, val]) => acc + val, 0);
    const maxPermitido = Math.max(0, 90 - totalSemAtual);
    setQuantidadesPorMateria(prev => ({ ...prev, [materia]: Math.min(input, maxPermitido) }));
  }

  const totalQuestoes = Object.values(quantidadesPorMateria).reduce((a, b) => a + b, 0);
  const totalValido =
    contextoValido && materiasSelecionadas.length > 0 && (
      personalizar
        ? materiasSelecionadas.every(m => quantidadesPorMateria[m] > 0) && totalQuestoes <= 90
        : quantidade > 0 && quantidade <= 90
    );

  // Dentro do seu componente CriarLista, substitua o handleGerarLista por este:

  const handleGerarLista = async () => {
    if (!totalValido || loading) return;
    setLoading(true);
  
    // 1) monta quantidades por matéria
    let finalQuantidades = { ...quantidadesPorMateria };
    if (!personalizar) {
      const porMat = Math.floor(quantidade / materiasSelecionadas.length);
      finalQuantidades = {};
      materiasSelecionadas.forEach(m => {
        finalQuantidades[m] = porMat;
      });
    }
  
    // 2) payload usando o UUID fixo
    const payload = {
      usuario_id: usuarioId,       // seu UUID que já existe no DB
      nome:       nomeLista,
      objetivo,
      banca:      banca || null,
      materias:   materiasSelecionadas,
      quantidadePorMateria: finalQuantidades
    };
  
    try {
      // 3) dispara o fetch para sua API
      const res = await fetch("/api/gerar-lista", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Status ${res.status}: ${text}`);
      }
  
      // 4) lê a resposta e redireciona
      const data = await res.json();
      sessionStorage.setItem("resultadoLista", JSON.stringify(data));
      router.push("/lista-gerada");
    } catch (err: any) {
      console.error("Erro ao gerar lista:", err);
      alert("Falha ao gerar lista: " + err.message);
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">Crie sua lista personalizada</h1>

      {/* Objetivo */}
      <div className="mb-6">
        <p className="font-semibold mb-2">Objetivo</p>
        <div className="flex gap-3 flex-wrap">
          {['ENEM', 'Vestibulares', 'Concursos'].map(item => (
            <button
              key={item}
              onClick={() => toggleItem(item, objetivo, setObjetivo)}
              className={`px-4 py-2 rounded-full border ${
                objetivo === item ? 'bg-blue-600 text-white' : 'bg-white text-black'
              }`}
            >{item}</button>
          ))}
        </div>
      </div>

      {/* Banca */}
      {(objetivo === 'Vestibulares' || objetivo === 'Concursos') && (
        <div className="mb-6">
          <p className="font-semibold mb-2">Banca</p>
          <div className="flex gap-3 flex-wrap">
            {(objetivo === 'Vestibulares' ? vestibulares : concursos).map(item => (
              <button
                key={item}
                onClick={() => toggleItem(item, banca, setBanca)}
                className={`px-4 py-2 rounded-full border ${
                  banca === item ? 'bg-blue-600 text-white' : 'bg-white text-black'
                }`}
              >{item}</button>
            ))}
          </div>
        </div>
      )}

      {/* Seleção de matérias */}
      {contextoValido && materias.length > 0 && (
        <div className="mb-6">
          <p className="font-semibold mb-2">Matérias</p>
          <button onClick={toggleTodasMaterias} className="text-sm underline text-blue-600 mb-2">
            {materiasSelecionadas.length === materias.length ? 'Desmarcar todas' : 'Selecionar todas'}
          </button>
          <div className="flex flex-wrap gap-2">
            {materias.map(m => (
              <button
                key={m}
                onClick={() => toggleMateria(m)}
                className={`px-3 py-1 border rounded-full ${
                  materiasSelecionadas.includes(m) ? 'bg-blue-600 text-white' : 'bg-white text-black'
                }`}
              >{m}</button>
            ))}
          </div>
        </div>
      )}

      {/* Quantidade / Personalizar */}
      {contextoValido && materiasSelecionadas.length > 0 && (
        <div className="mb-6">
          <p className="font-semibold mb-2">Total de questões</p>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min={1} max={90}
              disabled={personalizar}
              value={quantidade}
              onChange={e => setQuantidade(Math.min(Number(e.target.value), 90))}
              className="border rounded px-3 py-1"
            />
            <button
              onClick={() => setPersonalizar(prev => !prev)}
              className="text-sm underline text-blue-600"
            >{personalizar ? 'Cancelar' : 'Personalizar'}</button>
          </div>
          {!personalizar && (
            <p className="text-sm text-gray-500 mt-1">
              ~ {Math.floor(Math.min(quantidade, 90) / materiasSelecionadas.length)} por matéria
            </p>
          )}
        </div>
      )}

      {/* Inputs de personalização */}
      {personalizar && materiasSelecionadas.length > 0 && (
        <div className="mb-6 space-y-2">
          {materiasSelecionadas.map(materia => (
            <div key={materia} className="flex justify-between items-center">
              <span>{materia}</span>
              <input
                type="number"
                min={0} max={90}
                value={quantidadesPorMateria[materia] || ''}
                onChange={e => handleQuantidadePersonalizada(materia, e.target.value)}
                className="border rounded px-2 py-1 w-20"
              />
            </div>
          ))}
          <p className="text-sm text-gray-500">Total: {totalQuestoes} de até 90</p>
        </div>
      )}

      {/* Botão de enviar */}
      {contextoValido && materiasSelecionadas.length > 0 && (
        <button
          onClick={handleGerarLista}
          disabled={!totalValido || loading}
          className={`w-full px-6 py-3 rounded text-white ${
            totalValido
              ? loading
                ? 'bg-gray-500 cursor-wait'
                : 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >{loading ? 'Gerando...' : 'Gerar Lista'}</button>
      )}
    </div>
  );
}
