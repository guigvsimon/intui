import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// src/app/api/estatisticas/route.ts
// POST /api/estatisticas
// Recebe estatísticas de uma lista e persiste no banco, atualizando se já existir
export async function POST(request: Request) {
  try {
    const {
      lista_id,
      total_questoes,
      respondidas,
      acertos,
      erros,
      percentual
    } = (await request.json()) as {
      lista_id: string
      total_questoes: number
      respondidas: number
      acertos: number
      erros: number
      percentual: number
    }

    if (!lista_id) {
      return NextResponse.json({ error: 'lista_id é obrigatório' }, { status: 400 })
    }

    // Tenta atualizar registro existente
    const { data: updated, error: updateError } = await supabase
      .from('estatisticas')
      .update({ total_questoes, respondidas, acertos, erros, percentual })
      .eq('lista_id', lista_id)
      .select('*')
      .single()

    if (updateError) {
      console.warn('Nenhum registro atualizado (ou erro):', updateError.message)
    }

    if (updated) {
      return NextResponse.json({ message: 'Estatísticas atualizadas com sucesso', estatistica: updated })
    }

    // Se não existia, insere novo registro
    const { data: inserted, error: insertError } = await supabase
      .from('estatisticas')
      .insert([{ lista_id, total_questoes, respondidas, acertos, erros, percentual }])
      .select('*')
      .single()

    if (insertError || !inserted) {
      console.error('Erro ao inserir estatísticas:', insertError)
      return NextResponse.json({ error: insertError?.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Estatísticas salvas com sucesso', estatistica: inserted })
  } catch (err: any) {
    console.error('Erro no endpoint /api/estatisticas:', err)
    return NextResponse.json({ error: 'Requisição inválida' }, { status: 400 })
  }
}

// GET não suportado para este endpoint
export async function GET(request: Request) {
  return NextResponse.json({ error: 'Use POST para enviar estatísticas' }, { status: 405 })
}