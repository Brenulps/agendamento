import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSupabaseClient } from '#imports'
import { useToast } from '~/composables/useToast'
import { useAdmin } from '~/composables/useAdmin'
import type { UserDTO } from '~/../shared/types/UserDTO'

export const useUserCurrentStore = defineStore('user_current', () => {
    const profile = ref<UserDTO | null>(null)
    const loading = ref(false)
    const error = ref<any>(null)
    const updatingName = ref(false)

    const supabase = useSupabaseClient()
    const { success, error: toastError } = useToast()
    const { checkAdmin } = useAdmin()

    async function fetchProfile() {
        loading.value = true
        error.value = null

        try {
            const { data, error: sbError } = await supabase
                .from('users')
                .select('*')
                .single()

            if (sbError) throw sbError
            profile.value = data as UserDTO

            // marca como admin se a RPC `ver_admin` confirmar (sincroniza com backend)
            try {
                const admin = await checkAdmin()
                if (admin) profile.value = { ...profile.value, role: 'admin' }
            } catch (err) {
                // não bloqueia o carregamento se a verificação falhar
                console.warn('ver_admin RPC falhou:', err)
            }
        } catch (e) {
            error.value = e
            console.error('Error fetching user profile:', e)
        } finally {
            loading.value = false
        }
    }

    async function updateName(newName: string) {
        if (!newName || !profile.value) return false
        updatingName.value = true
        error.value = null

        const previousName = profile.value.name || ''

        // optimistic update — mostra o novo nome imediatamente
        profile.value = { ...profile.value, name: newName }

        try {
            const { data, error: sbError } = await supabase.rpc('update_user_name', { new_name: newName })
            if (sbError) throw sbError

            success('Nome atualizado com sucesso')
            return true
        } catch (e) {
            // revert on error
            profile.value = { ...profile.value, name: previousName }
            error.value = e
            toastError(e?.message || 'Erro ao atualizar nome')
            console.error('Error updating user name:', e)
            return false
        } finally {
            updatingName.value = false
        }
    }

    function clearProfile() {
        profile.value = null
        error.value = null
    }

    return {
        profile,
        loading,
        error,
        updatingName,
        fetchProfile,
        updateName,
        clearProfile
    }
})
