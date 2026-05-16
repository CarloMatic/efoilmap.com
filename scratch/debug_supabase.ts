import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
    console.log('Testing connection to:', supabaseUrl)
    const { data, error } = await supabase.from('spots').select('*')
    if (error) {
        console.error('Fetch Error:', error)
    } else {
        console.log('Data count:', data?.length)
        console.log('First Item:', data?.[0])
    }
}

test()
