import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

type QuantidadesPorMateria = Record<string, number>

export async function POST(req: Request) {
  try {
    const { objetivo, banca, quantidadesPorMateria }: {
      objetivo: string
      banca: string
      quantidadesPorMateria: QuantidadesPorMateria
    } = await req.json()

    const questoesFinal: any[] = []

    for (const [materia, qtd] of Object.entries(quantidadesPorMateria)) {
      let query = supabase
        .from('questoes')
        .select('*')
        .eq('materia', materia)
        .eq('objetivo', objetivo)

      if (banca) {
        query = query.eq('banca', banca)
      }

      const { data, error } = await query.limit(qtd)
      if (error || !data) continue

      questoesFinal.push(...data)
    }

    return NextResponse.json({ questoes: questoesFinal }, { status: 200 })

  } catch (error) {
    console.error("Erro na rota /api/gerar-lista:", error)
    return NextResponse.json({ error: "Erro interno ao gerar lista." }, { status: 500 })
  }
}
