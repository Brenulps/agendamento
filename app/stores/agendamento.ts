import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Agendamento } from '~/../shared/types/Agendamento'

export const useAgendamentoStore = defineStore('agendamento', () => {
    const supabase = useSupabaseClient()

    // cache module-level para evitar requests repetidos que retornem 42703
    let _hasDataHora: boolean | null = null
    async function ensureHasDataHora() {
        if (_hasDataHora !== null) return _hasDataHora
        try {
            const { error } = await supabase.from('view_agendamentos').select('data_hora').limit(1)
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

    // Data de referência (inicializada com a data atual)
    const dataReferencia = ref(new Date())
    const agendamentos = ref<(Agendamento & { cliente: any, profissional: any })[]>([])
    const isLoading = ref(false)

    // Computed para gerar a array de dias da semana (Domingo a Sábado) baseada na dataReferencia
    const diasDaSemana = computed(() => {
        const dias = []
        const data = new Date(dataReferencia.value)

        // Encontrar o domingo da semana atual
        const diaDaSemana = data.getDay() // 0 (Domingo) a 6 (Sábado)
        const domingo = new Date(data)
        domingo.setDate(data.getDate() - diaDaSemana)
        domingo.setHours(0, 0, 0, 0)

        // Gerar os 7 dias da semana
        for (let i = 0; i < 7; i++) {
            const d = new Date(domingo)
            d.setDate(domingo.getDate() + i)
            dias.push(d)
        }

        return dias
    })

    // Função para avançar uma semana
    function avancarSemana() {
        const novaData = new Date(dataReferencia.value)
        novaData.setDate(novaData.getDate() + 7)
        dataReferencia.value = novaData
    }

    // Função para voltar uma semana
    function voltarSemana() {
        const novaData = new Date(dataReferencia.value)
        novaData.setDate(novaData.getDate() - 7)
        dataReferencia.value = novaData
    }

    // Função para setar uma data específica
    function setDataReferencia(data: Date) {
        dataReferencia.value = data
        fetchAgendamentos()
    }

    async function fetchAgendamentos() {
        isLoading.value = true
        try {
            const dias = diasDaSemana.value
            if (!dias || dias.length < 7) return

            const dataInicio = dias[0]!.toISOString()
            const dataFim = dias[6]!.toISOString()

            // Utilizando a view para simplificar e garantir dados
            const hasDataHora = await ensureHasDataHora()

            if (hasDataHora) {
                try {
                    const { data, error } = await supabase
                        .from('view_agendamentos')
                        .select('*')
                        .gte('data_hora', dataInicio)
                        .lte('data_hora', dataFim)

                    if (error) throw error

                    // Normaliza campos possíveis retornados pela view (aceita nomes com espaços/aliases)
                    agendamentos.value = (data || []).map((item: any) => {
                        const dataHora = item.data_hora ?? item['data e horario'] ?? item['data_e_horario'] ?? item['dataHorario'] ?? item['data-hora'] ?? null
                        const clienteNome = item.cliente_nome ?? item.nome_cliente ?? item['nome_cliente'] ?? item['nomeCliente'] ?? ''
                        const profissionalNome = item.profissional_nome ?? item.nome_profissional ?? item['nome_profissional'] ?? item['nomeProfissional'] ?? item['nome_profissional'] ?? ''
                        const observacoes = item.observações ?? item.observacoes ?? item['observação'] ?? item['observacao'] ?? null

                        return {
                            id: item.id,
                            created_at: item.created_at,
                            data_hora: dataHora,
                            status: item.status,
                            observações: observacoes,
                            cliente_id: item.cliente_id ?? item.cliente,
                            profissional_id: item.profissional_id ?? item.profissional,
                            cliente: {
                                nome: clienteNome,
                                email: item.cliente_email
                            },
                            profissional: {
                                id: item.profissional_id ?? item.profissional,
                                users: {
                                    nome: profissionalNome || 'Profissional'
                                }
                            }
                        }
                    }) as any
                } catch (err: any) {
                    console.warn('query view_agendamentos com data_hora falhou — tentando fallback sem filtros', err?.message || err)
                    try {
                        const { data, error } = await supabase.from('view_agendamentos').select('*')
                        if (error) throw error

                        agendamentos.value = (data || []).map((item: any) => {
                            const dataHora = item.data_hora ?? item['data e horario'] ?? item['data_e_horario'] ?? null
                            const clienteNome = item.cliente_nome ?? item.nome_cliente ?? ''
                            const profissionalNome = item.profissional_nome ?? item.nome_profissional ?? ''
                            const observacoes = item.observacoes ?? item['observações'] ?? null

                            return {
                                id: item.id,
                                created_at: item.created_at,
                                data_hora: dataHora,
                                status: item.status,
                                observações: observacoes,
                                cliente_id: item.cliente_id ?? item.cliente,
                                profissional_id: item.profissional_id ?? item.profissional,
                                cliente: {
                                    nome: clienteNome,
                                    email: item.cliente_email
                                },
                                profissional: {
                                    id: item.profissional_id ?? item.profissional,
                                    users: {
                                        nome: profissionalNome || 'Profissional'
                                    }
                                }
                            }
                        }) as any
                    } catch (e) {
                        console.error('Erro ao buscar agendamentos (fallback):', e)
                    }
                }
            } else {
                // view não tem `data_hora` — busca sem filtros para evitar 400
                try {
                    const { data, error } = await supabase.from('view_agendamentos').select('*')
                    if (error) throw error

                    agendamentos.value = (data || []).map((item: any) => {
                        const dataHora = item.data_hora ?? item['data e horario'] ?? item['data_e_horario'] ?? null
                        const clienteNome = item.cliente_nome ?? item.nome_cliente ?? ''
                        const profissionalNome = item.profissional_nome ?? item.nome_profissional ?? ''
                        const observacoes = item.observacoes ?? item['observações'] ?? null

                        return {
                            id: item.id,
                            created_at: item.created_at,
                            data_hora: dataHora,
                            status: item.status,
                            observacoes: observacoes,
                            cliente_id: item.cliente_id ?? item.cliente,
                            profissional_id: item.profissional_id ?? item.profissional,
                            cliente: {
                                nome: clienteNome,
                                email: item.cliente_email
                            },
                            profissional: {
                                id: item.profissional_id ?? item.profissional,
                                users: {
                                    nome: profissionalNome || 'Profissional'
                                }
                            }
                        }
                    }) as any
                } catch (e) {
                    console.error('Erro ao buscar agendamentos (fallback sem data_hora):', e)
                }
            }
        } catch (error) {
            console.error('Erro ao buscar agendamentos:', error)
        } finally {
            isLoading.value = false
        }
    }

    async function addAgendamento(novoAgendamento: Omit<Agendamento, 'id' | 'created_at'>) {
        const { data, error } = await supabase
            .from('agendamento')
            .insert(novoAgendamento as any)
            .select()
            .single()

        if (error) throw error
        await fetchAgendamentos()
        return data
    }

    async function updateAgendamento(id: number, updates: Partial<Agendamento>) {
        const { data, error } = await supabase
            .from('agendamento')
            // @ts-ignore
            .update(updates as any)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        await fetchAgendamentos()
        return data
    }

    return {
        dataReferencia,
        agendamentos,
        isLoading,
        diasDaSemana,
        avancarSemana: () => { avancarSemana(); fetchAgendamentos(); },
        voltarSemana: () => { voltarSemana(); fetchAgendamentos(); },
        setDataReferencia,
        fetchAgendamentos,
        addAgendamento,
        updateAgendamento
    }
})
