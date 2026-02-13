import { defineEventHandler, getQuery, sendError } from 'h3'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    const SUPABASE_URL = process.env.SUPABASE_URL
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SECRET_KEY

    if (!SUPABASE_URL || !SERVICE_ROLE) {
        return sendError(event, createError({ statusCode: 501, statusMessage: 'SUPABASE_SERVICE_ROLE not configured' }))
    }

    const query = getQuery(event)
    const userId = query.id as string

    if (!userId) {
        return sendError(event, createError({ statusCode: 400, statusMessage: 'Missing user id' }))
    }

    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE)

    try {
        // 1. Deleta da tabela pública (opcional se houver CASCADE, mas explícito é mais seguro)
        await adminClient.from('users').delete().eq('id', userId)

        // 2. Deleta do Supabase Auth (privilegiado)
        const { error: authError } = await adminClient.auth.admin.deleteUser(userId)
        if (authError) throw authError

        return { success: true }
    } catch (err: any) {
        return sendError(event, createError({ statusCode: 500, statusMessage: err?.message || 'Erro ao excluir usuário' }))
    }
})
