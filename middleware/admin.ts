import { useSupabaseClient } from '#imports'

export default defineNuxtRouteMiddleware(async () => {
  const supabase = useSupabaseClient()

  try {
    const { data, error } = await supabase.rpc('ver_admin')
    if (error) throw error

    // interpreta o resultado com tolerância (objeto ou array com objeto)
    let isAdmin = false
    if (data == null) isAdmin = false
    else if (Array.isArray(data) && data.length > 0) {
      const d: any = data[0]
      if (d == null) isAdmin = false
      else if ('IsAdmin' in d) isAdmin = Boolean(d.IsAdmin)
      else if ('isadmin' in d) isAdmin = Boolean(d.isadmin)
      else {
        const v = Object.values(d)[0]
        isAdmin = typeof v === 'boolean' ? v : false
      }
    } else if (typeof data === 'object') {
      const d: any = data
      if ('IsAdmin' in d) isAdmin = Boolean(d.IsAdmin)
      else if ('isadmin' in d) isAdmin = Boolean(d.isadmin)
      else {
        const v = Object.values(d)[0]
        isAdmin = typeof v === 'boolean' ? v : false
      }
    } else if (typeof data === 'boolean') isAdmin = data

    if (!isAdmin) return navigateTo('/')
  } catch (err) {
    // se a verificação falhar, não expõe a rota — redireciona para a home
    return navigateTo('/')
  }
})