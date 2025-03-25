'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestSupabase() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase
          .from('farmers')
          .select('count')
          .limit(1)
        
        if (error) throw error
        setStatus('success')
      } catch (err) {
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      {status === 'loading' && <p>Testing connection...</p>}
      {status === 'success' && (
        <div className="text-green-600">
          <p>✅ Successfully connected to Supabase!</p>
          <p>Database schema is ready to use.</p>
        </div>
      )}
      {status === 'error' && (
        <div className="text-red-600">
          <p>❌ Failed to connect to Supabase</p>
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  )
} 