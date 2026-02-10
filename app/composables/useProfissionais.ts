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

    return {
        profissionais,
        isLoading,
        fetchProfissionais
    }
}
