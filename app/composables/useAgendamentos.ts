import { ref } from 'vue'
import { useSupabaseClient } from '#imports'
import type { Database } from '~/types/database.types'

export interface AgendamentoView {
    id: number;
    created_at: string;
    data_hora: string;
    status: string;
    observacoes: string | null;
    cliente_id: number;
    cliente_nome: string;
    cliente_email: string | null;
    cliente_telefone: string | null;
    profissional_id: number;
    profissional_nome: string;
    profissional_especialidade: string;
}

// cache module-level para evitar requests repetidos que retornem 42703
let _hasDataHora: boolean | null = null
async function ensureHasDataHora(client: any) {
  if (_hasDataHora !== null) return _hasDataHora
  try {
    const { error } = await client.from('view_agendamentos' as any).select('data_hora').limit(1)
    if (error) {
      if ((error as any)?.code === '42703' || /(column .* does not exist)/i.test(error.message || '')) {
        _hasDataHora = false
        return _hasDataHora
      }
      throw error
    }
    _hasDataHora = true
    return _hasDataHora
  } catch (err: any) {
    const msg = err?.message || ''
    _hasDataHora = /(column .* does not exist)/i.test(msg) || (err as any)?.code === '42703' ? false : false
    return _hasDataHora
  }
}

export const useAgendamentos = () => {
    const client = useSupabaseClient<Database>()
    const agendamentos = ref<AgendamentoView[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const fetchAgendamentos = async (startDate?: string, endDate?: string) => {
        isLoading.value = true
        error.value = null
        try {
            const hasDataHora = await ensureHasDataHora(client)

            if (hasDataHora) {
                let query = client
                    .from('view_agendamentos' as any)
                    .select('*')
                    .order('data_hora', { ascending: true })

                if (startDate) query = query.gte('data_hora', startDate)
                if (endDate) query = query.lte('data_hora', endDate)

                const { data, error: supabaseError } = await query
                if (supabaseError) throw supabaseError

                if (data) {
                    agendamentos.value = (data as any[]).map((item: any) => ({
                        id: item.id,
                        created_at: item.created_at,
                        data_hora: item.data_hora ?? item['data e horario'] ?? null,
                        status: item.status,
                        observacoes: item.observacoes ?? item['observações'] ?? null,
                        cliente_id: item.cliente_id ?? item.cliente,
                        cliente_nome: item.cliente_nome ?? item.nome_cliente ?? '',
                        cliente_email: item.cliente_email ?? null,
                        profissional_id: item.profissional_id ?? item.profissional,
                        profissional_nome: item.profissional_nome ?? item.nome_profissional ?? ''
                    })) as AgendamentoView[]
                }
            } else {
                // view não tem data_hora — busca sem filtros para evitar 400
                const { data, error: fallbackError } = await client.from('view_agendamentos' as any).select('*')
                if (fallbackError) throw fallbackError
                if (data) {
                    agendamentos.value = (data as any[]).map((item: any) => ({
                        id: item.id,
                        created_at: item.created_at,
                        data_hora: item.data_hora ?? item['data e horario'] ?? null,
                        status: item.status,
                        observacoes: item.observacoes ?? item['observações'] ?? null,
                        cliente_id: item.cliente_id ?? item.cliente,
                        cliente_nome: item.cliente_nome ?? item.nome_cliente ?? '',
                        cliente_email: item.cliente_email ?? null,
                        profissional_id: item.profissional_id ?? item.profissional,
                        profissional_nome: item.profissional_nome ?? item.nome_profissional ?? ''
                    })) as AgendamentoView[]
                }
            }
        } catch (e: any) {
            console.error('Erro ao buscar agendamentos da view:', e)
            error.value = e.message || 'Erro desconhecido ao buscar agendamentos'
        } finally {
            isLoading.value = false
        }
    }

    return {
        agendamentos,
        isLoading,
        error,
        fetchAgendamentos
    }
}
