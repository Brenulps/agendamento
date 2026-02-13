import { ref } from 'vue'
import { useSupabaseClient } from '#imports'
import type { Database } from '~/types/database.types'

export interface ProfissionalView {
    profissional_id: number;
    profissional_created_at: string;
    user_id: string;
    user_name: string;
    user_email: string;
    user_role: string;
    especialidade_id: number;
    especialidade_nome: string;
}

export const useProfissionais = () => {
    const client = useSupabaseClient<Database>()
    const profissionais = ref<ProfissionalView[]>([])
    const isLoading = ref(false)

    const fetchProfissionais = async () => {
        isLoading.value = true
        try {
            const { data, error } = await client.rpc('get_view_profissionais')

            if (error) throw error

            if (data) {
                profissionais.value = data as ProfissionalView[]
            }
        } catch (error) {
            console.error('Erro ao buscar profissionais:', error)
        } finally {
            isLoading.value = false
        }
    }

    const addProfissional = async (userId: string, especialidadeId: number) => {
        isLoading.value = true
        try {
            const { error } = await client
                .from('profissionais')
                .insert({
                    user_id: userId,
                    especialidade_id: especialidadeId
                } as any)

            if (error) throw error

            await fetchProfissionais()
            return { success: true, message: 'Profissional adicionado com sucesso!' }
        } catch (error: any) {
            console.error('Erro ao adicionar profissional:', error)
            return { success: false, message: error.message || 'Erro ao adicionar profissional' }
        } finally {
            isLoading.value = false
        }
    }

    const deleteProfissional = async (id: number) => {
        isLoading.value = true
        try {
            const { error } = await client
                .from('profissionais')
                .delete()
                .eq('id', id)

            if (error) throw error

            await fetchProfissionais()
            return { success: true, message: 'Profissional removido com sucesso!' }
        } catch (error: any) {
            console.error('Erro ao remover profissional:', error)
            return { success: false, message: error.message || 'Erro ao remover profissional' }
        } finally {
            isLoading.value = false
        }
    }

    return {
        profissionais,
        isLoading,
        fetchProfissionais,
        addProfissional,
        deleteProfissional
    }
}
