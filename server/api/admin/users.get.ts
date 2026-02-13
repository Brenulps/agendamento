import { defineEventHandler, sendError } from 'h3'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  // endpoint só funciona se SUPABASE_SERVICE_ROLE estiver configurada
  const SUPABASE_URL = process.env.SUPABASE_URL
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SECRET_KEY
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return sendError(event, createError({ statusCode: 501, statusMessage: 'SUPABASE_SERVICE_ROLE not configured — set in environment to enable admin API' }))
  }

  // cria cliente privilegiado (apenas server-side)
  const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE)

  try {
    // busca todos os usuários (privilegiado — contorna RLS)
    const { data, error } = await adminClient.from('users').select('id,name,email,role,created_at').order('name', { ascending: true })
    if (error) throw error

    const safe = (data || []).map((u: any) => ({ id: u.id, name: u.name, email: u.email, role: u.role, created_at: u.created_at }))
    return safe
  } catch (err: any) {
    return sendError(event, createError({ statusCode: 500, statusMessage: err?.message || 'Internal Server Error' }))
  }
})