import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cmwtvyzdnvbkznoqaufw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtd3R2eXpkbnZia3pub3FhdWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNDAzNTAsImV4cCI6MjA2MzcxNjM1MH0.3UgmBGlqZsXgxHqvYSTfsuH8LaYMkVUEc5WyfcArWCs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 