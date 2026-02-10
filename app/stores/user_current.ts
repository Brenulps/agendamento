import { defineStore } from 'pinia'
import type { UserDTO } from '~/../shared/types/UserDTO'

export const useUserCurrentStore = defineStore('user_current', () => {
    const profile = ref<UserDTO | null>(null)
    const loading = ref(false)
    const error = ref<any>(null)

    const supabase = useSupabaseClient()

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
        } catch (e) {
            error.value = e
            console.error('Error fetching user profile:', e)
        } finally {
            loading.value = false
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
        fetchProfile,
        clearProfile
    }
})
