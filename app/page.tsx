'use client'
import { useState, useEffect } from 'react'

const SESSIONS = [
  { key: '2026-05-S1', month: '2026-05', session: 'S1', label: 'May 2026', sublabel: 'Session 1', dates: 'May 5–8, 2026',
    schedule: [
      { day: 'Day 1', date: 'May 5', training: 'Basic Training' },
      { day: 'Day 2', date: 'May 6', training: 'Advanced Training' },
      { day: 'Day 3', date: 'May 7', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'May 8', training: 'Welding Training' },
    ]},
  { key: '2026-05-S2', month: '2026-05', session: 'S2', label: 'May 2026', sublabel: 'Session 2', dates: 'May 26–29, 2026',
    schedule: [
      { day: 'Day 1', date: 'May 26', training: 'Basic Training' },
      { day: 'Day 2', date: 'May 27', training: 'Advanced Training' },
      { day: 'Day 3', date: 'May 28', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'May 29', training: 'Welding Training' },
    ]},
  { key: '2026-06-S1', month: '2026-06', session: 'S1', label: 'June 2026', sublabel: 'Session 1', dates: 'Jun 9–12, 2026',
    schedule: [
      { day: 'Day 1', date: 'Jun 9', training: 'Basic Training' },
      { day: 'Day 2', date: 'Jun 10', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Jun 11', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'Jun 12', training: 'Welding Training' },
    ]},
  { key: '2026-06-S2', month: '2026-06', session: 'S2', label: 'June 2026', sublabel: 'Session 2', dates: 'Jun 23–26, 2026',
    schedule: [
      { day: 'Day 1', date: 'Jun 23', training: 'Basic Training' },
      { day: 'Day 2', date: 'Jun 24', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Jun 25', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'Jun 26', training: 'Welding Training' },
    ]},
  { key: '2026-07-S1', month: '2026-07', session: 'S1', label: 'July 2026', sublabel: 'Session 1', dates: 'Jul 14–17, 2026',
    schedule: [
      { day: 'Day 1', date: 'Jul 14', training: 'Basic Training' },
      { day: 'Day 2', date: 'Jul 15', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Jul 16', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'Jul 17', training: 'Welding Training' },
    ]},
  { key: '2026-07-S2', month: '2026-07', session: 'S2', label: 'July 2026', sublabel: 'Session 2', dates: 'Jul 28–31, 2026',
    schedule: [
      { day: 'Day 1', date: 'Jul 28', training: 'Basic Training' },
      { day: 'Day 2', date: 'Jul 29', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Jul 30', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'Jul 31', training: 'Welding Training' },
    ]},
  { key: '2026-08-S1', month: '2026-08', session: 'S1', label: 'August 2026', sublabel: 'Session 1', dates: 'Aug 11–14, 2026',
    schedule: [
      { day: 'Day 1', date: 'Aug 11', training: 'Basic Training' },
      { day: 'Day 2', date: 'Aug 12', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Aug 13', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'Aug 14', training: 'Welding Training' },
    ]},
  { key: '2026-08-S2', month: '2026-08', session: 'S2', label: 'August 2026', sublabel: 'Session 2', dates: 'Aug 25–28, 2026',
    schedule: [
      { day: 'Day 1', date: 'Aug 25', training: 'Basic Training' },
      { day: 'Day 2', date: 'Aug 26', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Aug 27', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'Aug 28', training: 'Welding Training' },
    ]},
  { key: '2026-09-S1', month: '2026-09', session: 'S1', label: 'September 2026', sublabel: 'Session 1', dates: 'Sep 8–11, 2026',
    schedule: [
      { day: 'Day 1', date: 'Sep 8', training: 'Basic Training' },
      { day: 'Day 2', date: 'Sep 9', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Sep 10', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'Sep 11', training: 'Welding Training' },
    ]},
  { key: '2026-09-S2', month: '2026-09', session: 'S2', label: 'September 2026', sublabel: 'Session 2', dates: 'Sep 22–25, 2026',
    schedule: [
      { day: 'Day 1', date: 'Sep 22', training: 'Basic Training' },
      { day: 'Day 2', date: 'Sep 23', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Sep 24', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'Sep 25', training: 'Welding Training' },
    ]},
  { key: '2026-10-S1', month: '2026-10', session: 'S1', label: 'October 2026', sublabel: 'Session 1', dates: 'Oct 13–16, 2026',
    schedule: [
      { day: 'Day 1', date: 'Oct 13', training: 'Basic Training' },
      { day: 'Day 2', date: 'Oct 14', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Oct 15', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'Oct 16', training: 'Welding Training' },
    ]},
  { key: '2026-10-S2', month: '2026-10', session: 'S2', label: 'October 2026', sublabel: 'Session 2', dates: 'Oct 27–30, 2026',
    schedule: [
      { day: 'Day 1', date: 'Oct 27', training: 'Basic Training' },
      { day: 'Day 2', date: 'Oct 28', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Oct 29', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'Oct 30', training: 'Welding Training' },
    ]},
  { key: '2026-11-S1', month: '2026-11', session: 'S1', label: 'November 2026', sublabel: 'Session 1', dates: 'Nov 10–13, 2026',
    schedule: [
      { day: 'Day 1', date: 'Nov 10', training: 'Basic Training' },
      { day: 'Day 2', date: 'Nov 11', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Nov 12', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'Nov 13', training: 'Welding Training' },
    ]},
  { key: '2026-11-S2', month: '2026-11', session: 'S2', label: 'November 2026', sublabel: 'Session 2', dates: 'Nov 24–27, 2026',
    schedule: [
      { day: 'Day 1', date: 'Nov 24', training: 'Basic Training' },
      { day: 'Day 2', date: 'Nov 25', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Nov 26', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'Nov 27', training: 'Welding Training' },
    ]},
  { key: '2026-12-S1', month: '2026-12', session: 'S1', label: 'December 2026', sublabel: 'Session 1', dates: 'Dec 8–11, 2026',
    schedule: [
      { day: 'Day 1', date: 'Dec 8', training: 'Basic Training' },
      { day: 'Day 2', date: 'Dec 9', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Dec 10', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'Dec 11', training: 'Welding Training' },
    ]},
  { key: '2026-12-S2', month: '2026-12', session: 'S2', label: 'December 2026', sublabel: 'Session 2', dates: 'Dec 22–25, 2026',
    schedule: [
      { day: 'Day 1', date: 'Dec 22', training: 'Basic Training' },
      { day: 'Day 2', date: 'Dec 23', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Dec 24', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'Dec 25', training: 'Welding Training' },
    ]},
]

const trainingOptions = [
  'Basic Training',
  'Advanced Training',
  'Palletizing Training',
  'VX 500 Training',
  'Welding Training',
]

const bgStyle = {
  backgroundImage: "url('/Background_EMEA.png')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}

type Registration = { company_name: string; country_region: string; training_sessions: string[] }

export default function Home() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [max, setMax] = useState(10)
  const [form, setForm] = useState({
    companyName: '', countryRegion: '', name: '', jobTitle: '',
    jobResponsibilities: '', trainingSessions: [] as string[], email: '', telephone: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [sessionCount, setSessionCount] = useState(0)
  const [registrations, setRegistrations] = useState<Registration[]>([])

  useEffect(() => {
    fetch('/api/signup')
      .then(res => res.json())
      .then(data => { setCounts(data.counts); setMax(data.max) })
  }, [])

  const handleSelect = (s: typeof SESSIONS[0]) => {
    setSelectedKey(s.key)
    setMessage('')
    setError('')
    fetch(`/api/signup?month=${s.month}&session=${s.session}`)
      .then(res => res.json())
      .then(data => { setSessionCount(data.count); setRegistrations(data.registrations ?? []) })
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
      setError('Please fill in all fields'); return
    }
    if (trainingSessions.length === 0) { setError('Please select at least one training session'); return }
    setLoading(true); setError(''); setMessage('')
    const sel = SESSIONS.find(s => s.key === selectedKey)!
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month: sel.month, session: sel.session, ...form })
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      setMessage('🎉 Registration successful! A confirmation email has been sent to your inbox. Please also check your spam / junk folder if you do not see it.')
      setSessionCount(c => c + 1)
      setCounts(prev => ({ ...prev, [selectedKey!]: (prev[selectedKey!] ?? 0) + 1 }))
      setRegistrations(prev => [...prev, { company_name: form.companyName, country_region: form.countryRegion, training_sessions: form.trainingSessions }])
      setForm({ companyName: '', countryRegion: '', name: '', jobTitle: '', jobResponsibilities: '', trainingSessions: [], email: '', telephone: '' })
    } else {
      setError(data.error || 'Registration failed, please try again.')
    }
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1"
  const sel = SESSIONS.find(s => s.key === selectedKey)
  const months = ['May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  // 首页
  if (!selectedKey) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 relative" style={bgStyle}>
        <div className="bg-white/85 backdrop-blur-sm rounded-3xl p-8 w-full max-w-4xl shadow-xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-1 text-center">Training Registration 2026</h1>
          <p className="text-gray-500 mb-4 text-center text-sm">Select a session to register for your training</p>

          {/* 下载按钮 */}
          <div className="flex justify-center mb-8">
            
              href="https://dobotrobots999-my.sharepoint.com/:f:/g/personal/alexander_hou_dobot-global_com/IgBd4kVtMsmgRackj8Av8458ASfq_TldoI51Nwd8J_TlAM4?e=eajhQS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-md transition"
            >
              📥 Download Training Materials
            </a>
          </div>

          <div className="space-y-6">
            {months.map(month => {
              const monthSessions = SESSIONS.filter(s => s.label.startsWith(month))
              return (
                <div key={month}>
                  <h2 className="text-base font-semibold text-gray-600 mb-3 border-b pb-1">{month} 2026</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {monthSessions.map(s => {
                      const count = counts[s.key] ?? 0
                      const full = count >= max
                      return (
                        <button key={s.key} onClick={() => !full && handleSelect(s)} disabled={full}
                          className={`rounded-2xl p-5 text-left shadow transition-all border-2 ${full ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60' : 'bg-white border-transparent hover:border-blue-500 hover:shadow-lg'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-800">{s.sublabel}</span>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${full ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-600'}`}>
                              {full ? 'Full' : 'Available'}
                            </span>
                          </div>
                          <div className="text-sm text-blue-600 font-medium mb-3">📅 {s.dates}</div>
                          <div className="space-y-1 mb-3">
                            {s.schedule.map((d, i) => (
                              <div key={i} className="flex gap-2 text-xs text-gray-500">
                                <span className="w-12 shrink-0 font-medium">{d.day}</span>
                                <span className="w-16 shrink-0">{d.date}</span>
                                <span>{d.training}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`text-lg font-bold ${full ? 'text-gray-400' : 'text-blue-600'}`}>{count} / {max}</span>
                            <span className="text-xs text-gray-400">spots filled</span>
                          </div>
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${full ? 'bg-red-400' : 'bg-blue-500'}`} style={{ width: `${(count / max) * 100}%` }} />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <p className="absolute bottom-3 right-4 text-white/60 text-xs">@ikun · Questions? <a href="mailto:hanyu.li@dobot-global.com" className="underline">hanyu.li@dobot-global.com</a></p>
      </main>
    )
  }

  // 报名表
  return (
    <main className="min-h-screen flex items-start justify-center p-6 relative" style={bgStyle}>
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl my-6">
        <button onClick={() => setSelectedKey(null)} className="text-blue-500 text-sm mb-4 hover:underline">← Back to sessions</button>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{sel?.label} – {sel?.sublabel}</h1>
        <p className="text-blue-600 text-sm font-medium mb-1">📅 {sel?.dates}</p>

        {/* 课程日程 */}
        <div className="bg-blue-50 rounded-xl p-4 mb-4">
          <p className="text-xs font-semibold text-blue-700 mb-2 uppercase tracking-wide">Training Schedule</p>
          <div className="space-y-1">
            {sel?.schedule.map((d, i) => (
              <div key={i} className="flex gap-3 text-xs text-gray-600">
                <span className="w-12 font-semibold text-gray-700">{d.day}</span>
                <span className="w-14 text-gray-500">{d.date}</span>
                <span>{d.training}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 名额 */}
        <div className="text-center mb-4">
          <span className={`text-lg font-bold ${sessionCount >= max ? 'text-red-500' : 'text-blue-600'}`}>{sessionCount} / {max}</span>
          <span className="text-gray-500 ml-2 text-sm">spots filled</span>
          {sessionCount >= max && <p className="text-red-500 mt-1 text-sm">Registration is full</p>}
        </div>

        {/* 已注册公司 */}
        {registrations.length > 0 && (
          <div className="mb-6 border border-gray-100 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Registered Companies</div>
            <div className="divide-y divide-gray-100">
              {registrations.map((r, i) => (
                <div key={i} className="px-4 py-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{r.company_name}</span>
                    <span className="text-xs text-gray-400">{r.country_region}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {r.training_sessions.map((t, j) => (
                      <span key={j} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div><label className={labelClass}>Company Name <span className="text-red-500">*</span></label>
            <input type="text" value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} placeholder="Enter company name" className={inputClass} /></div>
          <div><label className={labelClass}>Country / Region <span className="text-red-500">*</span></label>
            <input type="text" value={form.countryRegion} onChange={e => setForm({...form, countryRegion: e.target.value})} placeholder="e.g. China, Germany, USA" className={inputClass} /></div>
          <div><label className={labelClass}>Name of Participant <span className="text-red-500">*</span></label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Enter full name" className={inputClass} /></div>
          <div><label className={labelClass}>Job Title <span className="text-red-500">*</span></label>
            <input type="text" value={form.jobTitle} onChange={e => setForm({...form, jobTitle: e.target.value})} placeholder="e.g. Engineer, Manager" className={inputClass} /></div>
          <div><label className={labelClass}>Job Responsibilities <span className="text-red-500">*</span></label>
            <textarea value={form.jobResponsibilities} onChange={e => setForm({...form, jobResponsibilities: e.target.value})}
              placeholder="Briefly describe your responsibilities" rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 resize-none bg-white" /></div>
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
          <div><label className={labelClass}>Email <span className="text-red-500">*</span></label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Enter email address" className={inputClass} /></div>
          <div><label className={labelClass}>Telephone Number <span className="text-red-500">*</span></label>
            <input type="tel" value={form.telephone} onChange={e => setForm({...form, telephone: e.target.value})} placeholder="+49 ..." className={inputClass} /></div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm font-medium">{message}</p>}

          <button onClick={handleSubmit} disabled={loading || sessionCount >= max}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition text-base">
            {loading ? 'Submitting...' : 'Register Now'}
          </button>
        </div>
      </div>
      <p className="absolute bottom-3 right-4 text-white/60 text-xs">@ikun · Questions? <a href="mailto:hanyu.li@dobot-global.com" className="underline">hanyu.li@dobot-global.com</a></p>
    </main>
  )
}