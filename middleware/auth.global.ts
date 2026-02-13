import { useSupabaseUser, useRuntimeConfig } from '#imports'

export default defineNuxtRouteMiddleware((to) => {
  // allow explicit public pages (meta.auth === false)
  if (to.meta && to.meta.auth === false) return

  // read centralized public routes from runtime config
  const config = useRuntimeConfig()
  const publicRoutes: string[] = (config.public && config.public.publicRoutes) || []

  // allow if route matches any configured public route (by path or name)
  if (publicRoutes.some(r => r && (to.path === r || to.path?.includes(r) || to.name === r.replace(/^\//, '')))) return

  // fallback: explicitly allow common public routes to avoid startup timing issues
  if (to.path === '/forgot-password' || to.name === 'forgot-password' || to.path === '/change-password' || to.name === 'change-password') return

  // fallback: if runtime config is empty for some reason, explicitly allow common public routes
  if (!publicRoutes.length && (to.path === '/forgot-password' || to.path === '/login' || to.path === '/change-password')) return

  const user = useSupabaseUser()

  // allow if authenticated
  if (user && user.value) return

  // otherwise redirect to login
  return navigateTo('/login')
})
