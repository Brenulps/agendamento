import { ref } from 'vue'
import { useSupabaseClient } from '#imports'
import type { Database } from '~/types/database.types'
import type { Cliente } from '~/../shared/types/Cliente'

export const useClientes = () => {
    const client = useSupabaseClient<Database>()
    const clientes = ref<Cliente[]>([])
    const isLoading = ref(false)

    const fetchClientes = async () => {
        isLoading.value = true
        try {
            const { data, error } = await client
                .from('clientes' as any) // Cast to any because it might not be in database.types yet
                .select('*')
                .order('nome', { ascending: true })

            if (error) throw error

            if (data) {
                clientes.value = data as Cliente[]
            }
        } catch (error) {
            console.error('Erro ao buscar clientes:', error)
            // If the table doesn't exist, we can show an empty list or handle accordingly
        } finally {
            isLoading.value = false
        }
    }

    const addCliente = async (cliente: Omit<Cliente, 'id' | 'created_at'>) => {
        isLoading.value = true
        try {
            const { error } = await client
                .from('clientes' as any)
                .insert(cliente)

            if (error) throw error

            await fetchClientes()
            return { success: true, message: 'Cliente adicionado com sucesso!' }
        } catch (error: any) {
            console.error('Erro ao adicionar cliente:', error)
            return { success: false, message: error.message || 'Erro ao adicionar cliente' }
        } finally {
            isLoading.value = false
        }
    }

    const updateCliente = async (id: number, cliente: Partial<Omit<Cliente, 'id' | 'created_at'>>) => {
        isLoading.value = true
        try {
            const { error } = await client
                .from('clientes' as any)
                .update(cliente)
                .eq('id', id)

            if (error) throw error

            await fetchClientes()
            return { success: true, message: 'Cliente atualizado com sucesso!' }
        } catch (error: any) {
            console.error('Erro ao atualizar cliente:', error)
            return { success: false, message: error.message || 'Erro ao atualizar cliente' }
        } finally {
            isLoading.value = false
        }
    }

    const deleteCliente = async (id: number) => {
        isLoading.value = true
        try {
            const { error } = await client
                .from('clientes' as any)
                .delete()
                .eq('id', id)

            if (error) throw error

            await fetchClientes()
            return { success: true, message: 'Cliente removido com sucesso!' }
        } catch (error: any) {
            console.error('Erro ao remover cliente:', error)
            return { success: false, message: error.message || 'Erro ao remover cliente' }
        } finally {
            isLoading.value = false
        }
    }

    return {
        clientes,
        isLoading,
        fetchClientes,
        addCliente,
        updateCliente,
        deleteCliente
    }
}
