'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [region, setRegion] = useState('')
  const [count, setCount] = useState(0)
  const [max, setMax] = useState(10)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/signup')
      .then(res => res.json())
      .then(data => {
        setCount(data.count)
        setMax(data.max)
      })
  }, [])

  const handleSubmit = async () => {
    if (!name || !email || !region) {
      setError('请填写所有字段')
      return
    }
    setLoading(true)
    setError('')
    setMessage('')

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, region })
    })
    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      setMessage('🎉 报名成功！确认邮件已发送到你的邮箱')
      setCount(c => c + 1)
      setName('')
      setEmail('')
      setRegion('')
    } else {
      setError(data.error || '报名失败，请重试')
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">活动报名</h1>

        {/* 名额显示 */}
        <div className="text-center mb-6">
          <span className="text-lg font-semibold text-blue-600">
            {count} / {max}
          </span>
          <span className="text-gray-500 ml-2">名额已报名</span>
          {count >= max && (
            <p className="text-red-500 mt-1 font-medium">名额已满</p>
          )}
        </div>

        {/* 表单 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="请输入姓名"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="请输入邮箱"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">区域</label>
            <select
              value={region}
              onChange={e => setRegion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">请选择区域</option>
              <option value="华北">华北</option>
              <option value="华南">华南</option>
              <option value="华东">华东</option>
              <option value="华西">华西</option>
              <option value="其他">其他</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading || count >= max}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition"
          >
            {loading ? '提交中...' : '立即报名'}
          </button>
        </div>
      </div>
    </main>
  )
}