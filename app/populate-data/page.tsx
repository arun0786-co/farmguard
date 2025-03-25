'use client'

import { useEffect, useState } from 'react'
import { populateSampleData } from '@/lib/data'

export default function PopulateDataPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<any>(null)

  async function handlePopulateData() {
    try {
      setStatus('loading')
      const data = await populateSampleData()
      setResults(data)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Initialize FarmGuard Database</h1>
      <p className="mb-6 text-gray-600">
        This will populate your Supabase database with sample data for farmers, products, and vendors.
        Use this to quickly set up a development environment with realistic data.
      </p>
      
      <div className="mb-8">
        <button
          onClick={handlePopulateData}
          disabled={status === 'loading'}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium disabled:opacity-70"
        >
          {status === 'loading' ? 'Populating...' : 'Populate Database'}
        </button>
      </div>

      {status === 'loading' && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p>Initializing database with sample data...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-green-800">✅ Data Successfully Populated</h2>
          <div className="space-y-2">
            <p>• {results.farmers.length} farmers added</p>
            <p>• {results.products.length} products added</p>
            <p>• {results.vendors.length} vendors added</p>
          </div>
          <div className="mt-4 pt-4 border-t border-green-200">
            <p className="font-medium">Next Steps:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Visit the <a href="/b2b-marketplace" className="text-blue-600 hover:underline">B2B Marketplace</a> to see the data in action</li>
              <li>Check the Supabase dashboard to explore the database records</li>
            </ul>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-red-700">❌ Error Populating Data</h2>
          <p className="text-red-600">{error}</p>
          <div className="mt-4 pt-4 border-t border-red-200">
            <p className="font-medium">Possible Solutions:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Check your Supabase credentials in the .env file</li>
              <li>Ensure your database schema is correctly set up</li>
              <li>Verify that the tables don't already contain data with conflicts</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
} 