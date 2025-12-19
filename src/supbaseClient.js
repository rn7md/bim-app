import { createClient } from '@supabase/supabase-js'

// You need to replace these with your ACTUAL keys from the Supabase website
const supabaseUrl = 'https://rpvdchbarzzlcmbressv.supabase.co'
const supabaseKey = 'sb_publishable_u1JHiphX4ymr0T0xGpszhw_IF9T4URm'

export const supabase = createClient(supabaseUrl, supabaseKey)