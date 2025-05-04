// src/app/api/gerar-lista/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// função auxiliar para normalizar strings (remover acentos e case)
function normalizeString(str: string) {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

export async function POST(request: Request) {
  const {
    usuario_id,
    nome,
    objetivo,
    banca = null,
    materias,
    quantidadePorMateria
  } = (await request.json()) as {
    usuario_id: string
    nome: string
    objetivo: string
    banca?: string | null
    materias: string[]
    quantidadePorMateria: Record<string, number>
  }

  // 1) cria a lista
  const { data: novaLista, error: errLista } = await supabase
    .from('listas')
    .insert({ usuario_id, nome, objetivo, banca })
    .select('id')
    .single()
  if (errLista || !novaLista) {
    console.error('Erro ao criar lista:', errLista)
    return NextResponse.json({ error: errLista?.message }, { status: 500 })
  }
  const listaId = novaLista.id

  // 2) busca e filtra questões localmente
  let ordem = 1
  const vinculos: { lista_id: string; questao_id: string; ordem: number }[] = []

  const normObjetivo = normalizeString(objetivo)
  const normBanca    = banca ? normalizeString(banca) : null

  for (const materia of materias) {
    // busca todas as questões que batem com objetivo e banca
    const { data: allQuests, error: errQ } = await supabase
      .from('questoes')
      .select('id, materia, objetivo, banca')
    if (errQ) {
      console.error('Erro ao buscar questões:', errQ)
      return NextResponse.json({ error: errQ.message }, { status: 500 })
    }

    // filtra em JS considerando acentos e case
    const normTargetMat = normalizeString(materia)
    const filtered = (allQuests || []).filter(item => {
      const mat = normalizeString(item.materia || '')
      const obj = normalizeString(item.objetivo || '')
      const ban = item.banca ? normalizeString(item.banca) : ''
      return (
        obj === normObjetivo &&
        (!normBanca || ban === normBanca) &&
        mat.includes(normTargetMat)
      )
    })
    if (filtered.length === 0) continue

    // embaralha e seleciona conforme quantidade
    const ids = filtered.map(item => item.id)
    const shuffled = ids.sort(() => Math.random() - 0.5)
    const take = quantidadePorMateria[materia] || 0
    const selected = shuffled.slice(0, take)
    for (const id of selected) {
      vinculos.push({ lista_id: listaId, questao_id: id, ordem: ordem++ })
    }
  }

  // 3) insere vínculos se existir
  if (vinculos.length > 0) {
    const { error: errVinc } = await supabase
      .from('lista_questao')
      .insert(vinculos)
    if (errVinc) {
      console.error('Erro ao inserir vínculos:', errVinc)
      return NextResponse.json({ error: errVinc.message }, { status: 500 })
    }
  }

  // 4) retorna as questões completas
  const questIds = vinculos.map(v => v.questao_id)
  const { data: questoes, error: errFetch } = await supabase
    .from('questoes')
    .select('*')
    .in('id', questIds)
  if (errFetch) {
    console.error('Erro ao buscar dados das questões:', errFetch)
    return NextResponse.json({ error: errFetch.message }, { status: 500 })
  }

  return NextResponse.json({ lista_id: listaId, questoes })
}

export async function GET() {
  return NextResponse.json({ error: 'Use POST para gerar lista' }, { status: 405 })
}