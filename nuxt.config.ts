// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@pinia/nuxt'],
  build: {
    transpile: ['@phosphor-icons/vue'],
  },

  // centralize public routes so middleware can read them from one place
  runtimeConfig: {
    public: {
      publicRoutes: ['/login', '/forgot-password', '/change-password']
    }
  }
})