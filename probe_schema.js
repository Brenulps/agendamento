
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

async function probe() {
    try {
        const { data, error } = await supabase
            .from('agendamento')
            .select('*')
            .limit(1)

        if (data && data.length > 0) {
            console.log('Columns in agendamento:', Object.keys(data[0]))
        } else {
            console.log('No rows in agendamento. Trying to check schema via error message guessing...')
            // We can try to select a known non-existent column to see if it lists columns? No.
            // Let's try to select some common names.
            const { error: e1 } = await supabase.from('agendamento').select('observacoes').limit(1)
            console.log('Select observacoes error:', e1?.message)

            const { error: e2 } = await supabase.from('agendamento').select('observações').limit(1)
            console.log('Select observações error:', e2?.message)

            const { error: e3 } = await supabase.from('agendamento').select('observacao').limit(1)
            console.log('Select observacao error:', e3?.message)
        }

        if (error) console.error('Error probing agendamento:', error)

    } catch (err) {
        console.error('Fatal error in probe:', err)
    }
}

probe()
