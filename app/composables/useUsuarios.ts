import { ref } from 'vue'
import { useSupabaseClient } from '#imports'
import type { Database } from '~/types/database.types'
import type { UserDTO } from '~/../shared/types/UserDTO'

export const useUsuarios = () => {
    const client = useSupabaseClient<Database>()
    const usuarios = ref<UserDTO[]>([])
    const isLoading = ref(false)

    const fetchUsuarios = async () => {
        isLoading.value = true
        try {
            // usa endpoint server-side que retorna TODOS os usuários (valida admin no servidor)
            const data = await $fetch<UserDTO[]>('/api/admin/users')
            usuarios.value = data || []
        } catch (error) {
            console.error('Erro ao buscar usuários (server API):', error)
            // fallback local (pode não retornar todos por RLS)
            try {
                const { data: fallback, error: sbError } = await client.from('users').select('*').order('name', { ascending: true })
                if (sbError) throw sbError
                usuarios.value = (fallback as UserDTO[]) || []
            } catch (err) {
                console.error('Fallback ao buscar usuários falhou:', err)
            }
        } finally {
            isLoading.value = false
        }
    }

    return {
        usuarios,
        isLoading,
        fetchUsuarios
    }
}
