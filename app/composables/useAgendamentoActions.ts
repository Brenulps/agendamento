import { ref } from 'vue'
import { useSupabaseClient } from '#imports'
import { useAgendamentoStore } from '~/stores/agendamento'
import type { Agendamento } from '~/../shared/types/Agendamento'

export const useAgendamentoActions = () => {
    const client = useSupabaseClient()
    const store = useAgendamentoStore()
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const createAgendamento = async (agendamento: Omit<Agendamento, 'id' | 'created_at'>) => {
        isLoading.value = true
        error.value = null
        try {
            console.log('Criando agendamento (Payload):', agendamento);
            const { data, error: err } = await (client.rpc as any)('admin_agendamento_manager', {
                p_operacao: 'criar',
                p_cliente: agendamento.cliente_id,
                p_profissional: agendamento.profissional_id,
                p_data_horario: agendamento.data_hora,
                p_status: agendamento.status,
                p_observações: agendamento.observações
            })

            console.log('Resposta RPC (Criar):', data, err);

            if (err) throw err

            // Verifica sucesso "logico" do RPC
            // O RPC retorna uma tabela, então data deve ser um array. Pegamos o primeiro item.
            const result = Array.isArray(data) ? data[0] : data;

            if (result && result.success === false) {
                throw new Error(result.message || 'Erro ao criar agendamento (RPC negado).');
            }

            // Atualiza a lista no store
            await store.fetchAgendamentos()
            return result
        } catch (e: any) {
            console.error('Erro ao criar agendamento:', e)
            error.value = e.message || 'Erro ao criar agendamento'
            throw e
        } finally {
            isLoading.value = false
        }
    }

    const updateAgendamentoAction = async (id: number, updates: Partial<Agendamento>) => {
        isLoading.value = true
        error.value = null
        try {
            const { data, error: err } = await (client.rpc as any)('admin_agendamento_manager', {
                p_operacao: 'atualizar',
                p_agendamento_id: id,
                p_cliente: updates.cliente_id,
                p_profissional: updates.profissional_id,
                p_data_horario: updates.data_hora,
                p_status: updates.status,
                p_observações: updates.observações
            })

            console.log('Resposta RPC (Atualizar):', data, err);

            if (err) throw err

            // Atualiza a lista no store
            await store.fetchAgendamentos()
            return data
        } catch (e: any) {
            console.error('Erro ao atualizar agendamento:', e)
            error.value = e.message || 'Erro ao atualizar agendamento'
            throw e
        } finally {
            isLoading.value = false
        }
    }

    const deleteAgendamento = async (id: number) => {
        isLoading.value = true
        error.value = null
        try {
            const { data, error: err } = await (client.rpc as any)('admin_agendamento_manager', {
                p_operacao: 'deletar',
                p_agendamento_id: id
            })

            if (err) throw err

            // Atualiza a lista no store
            await store.fetchAgendamentos()
            return data
        } catch (e: any) {
            console.error('Erro ao deletar agendamento:', e)
            error.value = e.message || 'Erro ao deletar agendamento'
            throw e
        } finally {
            isLoading.value = false
        }
    }

    return {
        createAgendamento,
        updateAgendamento: updateAgendamentoAction,
        deleteAgendamento,
        isLoading,
        error
    }
}
