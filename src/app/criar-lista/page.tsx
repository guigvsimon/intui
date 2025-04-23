"use client"

import { useState } from "react";

export default function CriarLista() {
  const [objetivo, setObjetivo] = useState("");
  const [banca, setBanca] = useState("");
  const [quantidade, setQuantidade] = useState(15);
  const [personalizar, setPersonalizar] = useState(false);
  const [quantidadesPorMateria, setQuantidadesPorMateria] = useState<Record<string, number>>({});
  const handleGerarLista = async () => {
    let finalQuantidades = { ...quantidadesPorMateria }
  
    if (!personalizar) {
      const porMateria = Math.floor(quantidade / materiasSelecionadas.length)
      finalQuantidades = {}
      materiasSelecionadas.forEach((materia) => {
        finalQuantidades[materia] = porMateria
      })
    }
  
    const payload = JSON.stringify({ objetivo, banca, quantidadesPorMateria: finalQuantidades })
    sessionStorage.setItem('dadosLista', payload)
    window.location.href = '/lista-gerada'
  };

  const vestibulares = ["Fuvest", "Unicamp", "UFRGS", "UFPR", "UFRJ"];
  const concursos = ["INSS", "TJ", "PF", "PRF", "Receita Federal"];

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

  const [materiasSelecionadas, setMateriasSelecionadas] = useState<string[]>([]);
  const [dificuldade, setDificuldade] = useState("");

  const contexto = objetivo === "ENEM" ? "ENEM" : objetivo === "Vestibulares" ? "Vestibulares" : banca;
  const materias = contexto && (objetivo === "ENEM" || banca) ? materiasPorContexto[contexto] || [] : [];
  const contextoValido = objetivo === "ENEM" || banca;

  const toggleItem = (item: string, current: string, setter: (val: string) => void) => {
    const novoValor = current === item ? "" : item;
    setter(novoValor);
    if (setter === setObjetivo) setBanca("");
    setMateriasSelecionadas([]);
    setQuantidadesPorMateria({});
  };

  const toggleMateria = (materia: string) => {
    setMateriasSelecionadas((prev) => {
      const atualizadas = prev.includes(materia)
        ? prev.filter((m) => m !== materia)
        : [...prev, materia];

      if (personalizar) {
        setQuantidadesPorMateria((prevQuantidades) => {
          const novo = { ...prevQuantidades };
          if (prev.includes(materia)) delete novo[materia];
          return novo;
        });
      }

      return atualizadas;
    });
  };

  const toggleTodasMaterias = () => {
    if (materiasSelecionadas.length === materias.length) {
      setMateriasSelecionadas([]);
    } else {
      setMateriasSelecionadas([...materias]);
    }
    setQuantidadesPorMateria({});
  };

  const handleQuantidadePersonalizada = (materia: string, value: string) => {
    const input = parseInt(value) || 0;
    const totalSemAtual = Object.entries(quantidadesPorMateria)
      .filter(([m]) => m !== materia)
      .reduce((acc, [, val]) => acc + val, 0);

    const maxPermitido = Math.max(0, 90 - totalSemAtual);
    const valor = Math.min(input, maxPermitido);

    setQuantidadesPorMateria((prev) => ({ ...prev, [materia]: valor }));
  };

  const totalQuestoes = Object.values(quantidadesPorMateria).reduce((a, b) => a + b, 0);
  const totalValido = personalizar
    ? materiasSelecionadas.every((m) => quantidadesPorMateria[m] > 0) && totalQuestoes <= 90
    : quantidade > 0 && quantidade <= 90;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Crie sua lista personalizada</h1>
      <p className="text-gray-600 mb-6">
        Selecione o objetivo e personalize sua lista abaixo.
      </p>

      {/* Objetivo */}
      <div className="mb-6">
        <p className="font-semibold mb-2">Para qual objetivo você está se preparando?</p>
        <div className="flex gap-3 flex-wrap">
          {["ENEM", "Vestibulares", "Concursos"].map((item) => (
            <button
              key={item}
              onClick={() => toggleItem(item, objetivo, setObjetivo)}
              className={`px-4 py-2 rounded-full border ${
                objetivo === item ? "bg-blue-600 text-white" : "bg-white text-black"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Banca (se aplicável) */}
      {(objetivo === "Vestibulares" || objetivo === "Concursos") && (
        <div className="mb-6">
          <p className="font-semibold mb-2">Selecione a banca</p>
          <div className="flex gap-3 flex-wrap">
            {(objetivo === "Vestibulares" ? vestibulares : concursos).map((item) => (
              <button
                key={item}
                onClick={() => toggleItem(item, banca, setBanca)}
                className={`px-4 py-2 rounded-full border ${
                  banca === item ? "bg-blue-600 text-white" : "bg-white text-black"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Matérias checkboxes */}
      {contextoValido && materias.length > 0 && (
        <div className="mb-8">
          <p className="font-semibold mb-2">Selecione as matérias</p>
          <button
            onClick={toggleTodasMaterias}
            className="text-sm underline text-blue-600 mb-2"
          >
            {materiasSelecionadas.length === materias.length ? "Desmarcar todas" : "Selecionar todas"}
          </button>
          <div className="flex flex-wrap gap-3">
            {materias.map((materia) => (
              <button
                key={materia}
                onClick={() => toggleMateria(materia)}
                className={`px-3 py-1 border rounded-full ${
                  materiasSelecionadas.includes(materia)
                    ? "bg-blue-600 text-white" : "bg-white text-black"
                }`}
              >
                {materia}
              </button>
            ))}
          </div>
        </div>
      )}

{/* Quantidade total + Personalizar */}
{contextoValido && materiasSelecionadas.length > 0 && (
  <div className="mb-6">
    <p className="font-semibold mb-2">Quantidade total de questões</p>
    <div className="flex items-center gap-4">
      <input
        type="number"
        min={1}
        className={`border rounded px-4 py-2 ${personalizar ? 'bg-gray-100 text-gray-500' : ''}`}
        value={quantidade}
        onChange={e => setQuantidade(Math.min(Number(e.target.value), 90))}
        disabled={personalizar}
      />
      <button
        onClick={() => setPersonalizar(!personalizar)}
        className="text-sm underline text-blue-600"
      >
        {personalizar ? 'Cancelar' : 'Personalizar'}
      </button>
    </div>
    {!personalizar && (
      <p className="text-sm text-gray-500 mt-1">
        Isso será dividido em aproximadamente {quantidade > 0 ? Math.floor(Math.min(quantidade, 90) / materiasSelecionadas.length) : 0} questões por matéria selecionada.
      </p>
    )}
  </div>
)}

{/* Personalização de matérias */}
{personalizar && materiasSelecionadas.length > 0 && (
  <div className="mb-6 space-y-2">
    {materiasSelecionadas.map(materia => (
      <div key={materia} className="flex items-center justify-between">
        <span>{materia}</span>
        <input
          type="number"
          min={0}
          className="border rounded px-3 py-1 w-24"
          value={quantidadesPorMateria[materia] || ''}
          onChange={e => handleQuantidadePersonalizada(materia, e.target.value)}
        />
      </div>
    ))}
    <p className="text-sm text-gray-500 mt-2">
      Total: {totalQuestoes} questões {totalQuestoes > 90 ? '(máx. 90)' : ''}
    </p>
    {totalQuestoes === 0 && (
      <p className="text-sm text-red-500 mt-1">Você precisa adicionar pelo menos uma questão para continuar.</p>
    )}
  </div>
)}

{/* Botão final */}
{contextoValido && materiasSelecionadas.length > 0 && (
  <button
    className={`px-6 py-3 rounded shadow text-white ${totalValido ? 'bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
    disabled={!totalValido}
    onClick={handleGerarLista}
  >
    Gerar Lista
  </button>
)}

    </div>
  );
}
