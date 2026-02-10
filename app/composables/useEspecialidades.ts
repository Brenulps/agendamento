import { ref } from 'vue'
import { useSupabaseClient } from '#imports'
import type { Database } from '~/types/database.types'
import type { Especialidade } from '~/../shared/types/Especialidade'

export const useEspecialidades = () => {
    const client = useSupabaseClient<Database>()
    const especialidades = ref<Especialidade[]>([])
    const isLoading = ref(false)

    const fetchEspecialidades = async () => {
        isLoading.value = true
        try {
            const { data, error } = await client
                .from('especialidade')
                .select('id, especialidade')

            if (error) throw error

            if (data) {
                especialidades.value = (data as any[]).map(item => ({
                    id: item.id,
                    nome: item.especialidade
                }))
            }
        } catch (error) {
            console.error('Erro ao buscar especialidades:', error)
        } finally {
            isLoading.value = false
        }
    }

    const addEspecialidade = async (nome: string) => {
        try {
            const { data, error } = await client.rpc('add_especialidade', {
                p_especialidade: nome
            })

            if (error) throw error
            console.log('RPC add_especialidade response:', data)

            const res: any = Array.isArray(data) ? data[0] : data;
            const isSuccess = res?.success || res?.sucess;

            if (isSuccess) {
                await fetchEspecialidades()
            }
            return {
                success: !!isSuccess,
                message: res?.message || res?.mensagem || (isSuccess ? 'Sucesso!' : 'Erro desconhecido')
            }
        } catch (error: any) {
            console.error('Erro ao adicionar especialidade via RPC:', error)
            return { success: false, message: error.message || 'Erro ao adicionar especialidade' }
        }
    }

    const updateEspecialidade = async (id: number, nome: string) => {
        try {
            const { data, error } = await client.rpc('edit_especialidade', {
                p_id: id,
                p_especialidade: nome
            })

            if (error) throw error
            console.log('RPC edit_especialidade response:', data)

            const res: any = Array.isArray(data) ? data[0] : data;
            const isSuccess = res?.success || res?.sucess;

            if (isSuccess) {
                await fetchEspecialidades()
            }
            return {
                success: !!isSuccess,
                message: res?.message || res?.mensagem || (isSuccess ? 'Sucesso!' : 'Erro desconhecido')
            }
        } catch (error: any) {
            console.error('Erro ao atualizar especialidade via RPC:', error)
            return { success: false, message: error.message || 'Erro ao atualizar especialidade' }
        }
    }

    const deleteEspecialidade = async (id: number) => {
        try {
            const { data, error } = await client.rpc('delete_especialidade', {
                p_id: id
            })

            if (error) throw error
            console.log('RPC delete_especialidade response:', data)

            const res: any = Array.isArray(data) ? data[0] : data;
            const isSuccess = res?.success || res?.sucess;

            if (isSuccess) {
                await fetchEspecialidades()
            }
            return {
                success: !!isSuccess,
                message: res?.message || res?.mensagem || (isSuccess ? 'Sucesso!' : 'Erro desconhecido')
            }
        } catch (error: any) {
            console.error('Erro ao excluir especialidade via RPC:', error)
            return { success: false, message: error.message || 'Erro ao excluir especialidade' }
        }
    }

    return {
        especialidades,
        isLoading,
        fetchEspecialidades,
        addEspecialidade,
        updateEspecialidade,
        deleteEspecialidade
    }
}
