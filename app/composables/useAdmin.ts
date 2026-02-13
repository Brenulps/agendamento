import { ref } from 'vue'
import { useSupabaseClient } from '#imports'

/**
 * Composable para verificar se o usuário autenticado é administrador
 * Usa a função RPC `ver_admin` que retorna um JSON com a chave `IsAdmin`.
 */
export function useAdmin() {
  const supabase = useSupabaseClient()
  const isLoading = ref(false)
  const isAdmin = ref(false)
  const error = ref<Error | null>(null)

  async function checkAdmin() {
    isLoading.value = true
    error.value = null

    try {
      const { data, error: sbError } = await supabase.rpc('ver_admin')
      if (sbError) throw sbError

      // normalize result into a usable `res` (supabase-js pode devolver objeto, array ou boolean)
      const res: any = data
      let val = false

      if (res == null) {
        val = false
      } else if (Array.isArray(res) && res.length > 0) {
        const d = res[0]
        if (d == null) val = false
        else if ('IsAdmin' in d) val = Boolean(d.IsAdmin)
        else if ('isadmin' in d) val = Boolean(d.isadmin)
        else {
          const v = Object.values(d)[0]
          val = typeof v === 'boolean' ? v : false
        }
      } else if (typeof res === 'object') {
        if ('IsAdmin' in res) val = Boolean(res.IsAdmin)
        else if ('isadmin' in res) val = Boolean(res.isadmin)
        else {
          const v = Object.values(res)[0]
          val = typeof v === 'boolean' ? v : false
        }
      } else if (typeof res === 'boolean') {
        val = res
      }

      isAdmin.value = val
      return val
    } catch (err: any) {
      error.value = err instanceof Error ? err : new Error(err?.message || 'Erro ao verificar admin')
      return false
    } finally {
      isLoading.value = false
    }
  }

  return { isAdmin, isLoading, error, checkAdmin } as const
}
