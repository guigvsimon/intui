// /scripts/seed.ts (ou app/api/seed/route.ts se quiser usar como endpoint)
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // necessário para inserir via backend
)

async function seedQuestoes() {
  const materias = ['Matemática', 'Português', 'Física', 'História', 'Geografia']
  const objetivos = ['ENEM', 'Vestibulares', 'Concursos']
  const bancas = [null, 'Fuvest', 'Unesp', 'ENEM', 'INSS', 'Cespe']

  const mockQuestoes = []

  for (let i = 1; i <= 50; i++) {
    const materia = materias[i % materias.length]
    const objetivo = objetivos[i % objetivos.length]
    const banca = objetivo === 'ENEM' ? null : bancas[i % bancas.length]

    mockQuestoes.push({
      materia,
      objetivo,
      banca,
      enunciado: `Pergunta ${i} da matéria ${materia}`,
      alternativas: ['A', 'B', 'C', 'D', 'E'],
      resposta: 'A',
    })
  }

  const { error } = await supabase.from('questoes').insert(mockQuestoes)
  if (error) console.error('Erro no seed:', error)
  else console.log('Seed concluído!')
}

seedQuestoes()
