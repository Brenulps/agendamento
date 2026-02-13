import { defineEventHandler, readBody, sendError } from 'h3'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const SUPABASE_URL = process.env.SUPABASE_URL
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SECRET_KEY
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return sendError(event, createError({ statusCode: 501, statusMessage: 'SUPABASE_SERVICE_ROLE not configured — set in environment to enable admin API' }))
  }

  const body = await readBody(event)
  const { email, password, role, name } = body || {}

  if (!email || !password) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Missing required fields: email and password' }))
  }

  const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE)

  try {
    // cria usuário via API admin (apenas server-side)
    const { data: authData, error: authError } = await (adminClient.auth as any).admin.createUser({ email, password })
    if (authError) throw authError

    const createdUserId = authData?.user?.id || authData?.id
    if (!createdUserId) throw new Error('Could not retrieve user id from auth response')

    // insere registro na tabela pública `users`
    const profile = {
      name: name || null,
      email,
      role: role || 'user',
      id: createdUserId,
      created_at: new Date().toISOString(),
    }

    const { data: insertData, error: insertError } = await adminClient.from('users').insert(profile).select().single()
    if (insertError) {
      // tenta limpar o usuário criado no auth (rollback)
      try {
        await (adminClient.auth as any).admin.deleteUser(createdUserId)
      } catch (cleanupErr) {
        // ignore cleanup error, will report original insert error below
      }
      throw insertError
    }

    return insertData
  } catch (err: any) {
    return sendError(event, createError({ statusCode: 500, statusMessage: err?.message || 'Internal Server Error' }))
  }
})
