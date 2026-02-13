
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)

async function probe() {
    try {
        const { data, error } = await supabase
            .from('agendamento')
            .select('*')
            .limit(1)

        if (data && data.length > 0) {
            console.log('Columns in agendamento:', Object.keys(data[0]))
        } else {
            console.log('No rows in agendamento, trying to guess columns via select count...')
            // If no rows, we can't get keys from data. 
        }

        if (error) console.error('Error probing agendamento:', error)

    } catch (err) {
        console.error('Fatal error in probe:', err)
    }
}

probe()
