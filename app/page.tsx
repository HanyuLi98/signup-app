'use client'
import { useState, useEffect } from 'react'

const MONTHS = [
  { key: '2026-04', label: 'April 2026' },
  { key: '2026-05', label: 'May 2026' },
  { key: '2026-06', label: 'June 2026' },
  { key: '2026-07', label: 'July 2026' },
  { key: '2026-08', label: 'August 2026' },
  { key: '2026-09', label: 'September 2026' },
  { key: '2026-10', label: 'October 2026' },
  { key: '2026-11', label: 'November 2026' },
  { key: '2026-12', label: 'December 2026' },
]

const trainingOptions = [
  'Basic Training',
  'Advanced Training',
  'Palletizing Training',
  'VX 500 Training',
  'Welding Training',
]

export default function Home() {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [max, setMax] = useState(10)
  const [form, setForm] = useState({
    companyName: '', countryRegion: '', name: '', jobTitle: '',
    jobResponsibilities: '', trainingSessions: [] as string[], email: '', telephone: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [monthCount, setMonthCount] = useState(0)

  useEffect(() => {
    fetch('/api/signup')
      .then(res => res.json())
      .then(data => {
        setCounts(data.counts)
        setMax(data.max)
      })
  }, [])

  const handleSelectMonth = (key: string) => {
    setSelectedMonth(key)
    setMessage('')
    setError('')
    setMonthCount(counts[key] ?? 0)
  }

  const handleTraining = (option: string) => {
    setForm(prev => ({
      ...prev,
      trainingSessions: prev.trainingSessions.includes(option)
        ? prev.trainingSessions.filter(t => t !== option)
        : [...prev.trainingSessions, option]
    }))
  }

  const handleSubmit = async () => {
    const { companyName, countryRegion, name, jobTitle, jobResponsibilities, trainingSessions, email, telephone } = form
    if (!companyName || !countryRegion || !name || !jobTitle || !jobResponsibilities || !email || !telephone) {
      setError('Please fill in all fields')
      return
    }
    if (trainingSessions.length === 0) {
      setError('Please select at least one training session')
      return
    }
    setLoading(true)
    setError('')
    setMessage('')

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month: selectedMonth, ...form })
    })
    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      setMessage('🎉 Registration successful! A confirmation email has been sent to your inbox.')
      setMonthCount(c => c + 1)
      setCounts(prev => ({ ...prev, [selectedMonth!]: (prev[selectedMonth!] ?? 0) + 1 }))
      setForm({ companyName: '', countryRegion: '', name: '', jobTitle: '', jobResponsibilities: '', trainingSessions: [], email: '', telephone: '' })
    } else {
      setError(data.error || 'Registration failed, please try again.')
    }
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1"

  // 首页：月份选择
  if (!selectedMonth) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Training Registration 2026</h1>
        <p className="text-gray-500 mb-10 text-center">Select a month to register for your training session</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl">
          {MONTHS.map(({ key, label }) => {
            const count = counts[key] ?? 0
            const full = count >= max
            return (
              <button
                key={key}
                onClick={() => !full && handleSelectMonth(key)}
                disabled={full}
                className={`rounded-2xl p-6 text-left shadow-md transition-all border-2
                  ${full
                    ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60'
                    : 'bg-white border-transparent hover:border-blue-500 hover:shadow-lg cursor-pointer'
                  }`}
              >
                <div className="text-lg font-semibold text-gray-800 mb-3">{label}</div>
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-bold ${full ? 'text-gray-400' : 'text-blue-600'}`}>
                    {count} / {max}
                  </span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${full ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-600'}`}>
                    {full ? 'Full' : 'Available'}
                  </span>
                </div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${full ? 'bg-red-400' : 'bg-blue-500'}`}
                    style={{ width: `${(count / max) * 100}%` }}
                  />
                </div>
              </button>
            )
          })}
        </div>
      </main>
    )
  }

  // 报名表
  const monthLabel = MONTHS.find(m => m.key === selectedMonth)?.label
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl">
        <button onClick={() => setSelectedMonth(null)} className="text-blue-500 text-sm mb-4 hover:underline">← Back to months</button>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{monthLabel}</h1>
        <p className="text-gray-500 text-sm mb-4">Training Registration</p>

        <div className="text-center mb-6">
          <span className={`text-lg font-bold ${monthCount >= max ? 'text-red-500' : 'text-blue-600'}`}>
            {monthCount} / {max}
          </span>
          <span className="text-gray-500 ml-2 text-sm">spots filled</span>
          {monthCount >= max && <p className="text-red-500 mt-1 text-sm font-medium">Registration is full</p>}
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Company Name <span className="text-red-500">*</span></label>
            <input type="text" value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} placeholder="Enter company name" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Country / Region <span className="text-red-500">*</span></label>
            <input type="text" value={form.countryRegion} onChange={e => setForm({...form, countryRegion: e.target.value})} placeholder="e.g. China, Germany, USA" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Name of Participant <span className="text-red-500">*</span></label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Enter full name" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Job Title <span className="text-red-500">*</span></label>
            <input type="text" value={form.jobTitle} onChange={e => setForm({...form, jobTitle: e.target.value})} placeholder="e.g. Engineer, Manager" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Job Responsibilities <span className="text-red-500">*</span></label>
            <textarea value={form.jobResponsibilities} onChange={e => setForm({...form, jobResponsibilities: e.target.value})}
              placeholder="Briefly describe your responsibilities" rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 resize-none" />
          </div>
          <div>
            <label className={labelClass}>Attend Training Session <span className="text-red-500">*</span></label>
            <div className="space-y-2 mt-1">
              {trainingOptions.map(option => (
                <label key={option} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={form.trainingSessions.includes(option)} onChange={() => handleTraining(option)} className="w-4 h-4 accent-blue-600" />
                  <span className="text-gray-700 text-sm group-hover:text-blue-600 transition">{option}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>Email <span className="text-red-500">*</span></label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Enter email address" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Telephone Number <span className="text-red-500">*</span></label>
            <input type="tel" value={form.telephone} onChange={e => setForm({...form, telephone: e.target.value})} placeholder="e.g. +86 138 0000 0000" className={inputClass} />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}

          <button onClick={handleSubmit} disabled={loading || monthCount >= max}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition text-base">
            {loading ? 'Submitting...' : 'Register Now'}
          </button>
        </div>
      </div>
    </main>
  )
}