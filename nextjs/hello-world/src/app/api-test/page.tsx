'use client'

import { useState } from 'react'

export default function ApiTestPage() {
  const [response, setResponse] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const callApi = async (method: 'GET' | 'POST') => {
    setLoading(true)
    try {
      const res = await fetch('/api/hello', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      setResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      setResponse(`錯誤: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8 text-black">
      <h1 className="text-3xl font-bold mb-6">API 測試頁面</h1>

      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={() => callApi('GET')}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            呼叫 GET /api/hello
          </button>

          <button
            onClick={() => callApi('POST')}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            呼叫 POST /api/hello
          </button>
        </div>

        {loading && <p className="text-gray-600">載入中...</p>}

        {response && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">API 回應：</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
              {response}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-yellow-50 rounded">
        <h2 className="text-lg font-semibold mb-2">其他呼叫方式：</h2>
        <div className="space-y-2 text-sm">
          <p><strong>瀏覽器直接訪問：</strong></p>
          <code className="block bg-gray-100 p-2 rounded">http://localhost:3000/api/hello</code>

          <p><strong>使用 curl：</strong></p>
          <code className="block bg-gray-100 p-2 rounded">curl http://localhost:3000/api/hello</code>

          <p><strong>使用 fetch (JavaScript)：</strong></p>
          <code className="block bg-gray-100 p-2 rounded">
            {"fetch('/api/hello').then(res => res.json()).then(data => console.log(data))"}
          </code>
        </div>
      </div>
    </div>
  )
}