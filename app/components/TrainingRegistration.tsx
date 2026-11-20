'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { isRegistrationOpen, SESSIONS } from '../lib/training-sessions'

const trainingOptions = [
  'Basic Training', 'Advanced Training', 'Palletizing Training',
  'VX 500 Training', 'Welding Training',
]

const bgStyle = {
  background: 'linear-gradient(135deg, #dbeafe 0%, #ede9fe 50%, #dbeafe 100%)',
}

type Registration = { company_name: string; country_region?: string; training_sessions: string[]; name?: string }
type CertFile = { name: string; url: string }
type EmailPreview = {
  to: string
  sessionLabel: string
  dates: string
  name: string
  companyName: string
  countryRegion: string
  jobTitle: string
  telephone: string
  trainingSessions: string[]
  schedule: { day: string; date: string; training: string; note?: string }[]
  isS2: boolean
}

function getSessionEndDate(session: typeof SESSIONS[number]) {
  const lastDay = session.schedule[session.schedule.length - 1]
  const day = Number.parseInt(lastDay?.date.replace(/\D/g, '') ?? '', 10)
  const year = Number.parseInt(session.month.slice(0, 4), 10)
  const monthIndex = Number.parseInt(session.month.slice(5, 7), 10) - 1

  if (Number.isNaN(day) || Number.isNaN(year) || Number.isNaN(monthIndex)) {
    return null
  }

  return new Date(year, monthIndex, day)
}

export default function TrainingRegistration({ initialSessionKey }: { initialSessionKey?: string }) {
  const initialSession = SESSIONS.find(s => s.key === initialSessionKey && isRegistrationOpen(s))
  const [selectedYear, setSelectedYear] = useState(initialSession?.month.slice(0,4) ?? '2027')
  const [courseFilter, setCourseFilter] = useState('all')
  const [selectedKey, setSelectedKey] = useState<string | null>(initialSession?.key ?? null)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [max, setMax] = useState(10)
  const [form, setForm] = useState({
    companyName: '', countryRegion: '', name: '', jobTitle: '',
    jobResponsibilities: '', trainingSessions: initialSession?.trainingOptions ?? [] as string[], email: '', telephone: '',
  })
  const [loading, setLoading] = useState(false)
  const [sessionLoading, setSessionLoading] = useState(Boolean(initialSession))
  const [error, setError] = useState('')
  const [sessionCount, setSessionCount] = useState(0)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [emailPreview, setEmailPreview] = useState<EmailPreview | null>(null)
  const [showCertModal, setShowCertModal] = useState(false)
  const [certPassword, setCertPassword] = useState('')
  const [certError, setCertError] = useState('')
  const [certFiles, setCertFiles] = useState<CertFile[]>([])
  const [certLoading, setCertLoading] = useState(false)
  const [certUnlocked, setCertUnlocked] = useState(false)
  const [listUnlocked, setListUnlocked] = useState(false)
  const [listPassword, setListPassword] = useState('')
  const [listError, setListError] = useState('')

  useEffect(() => {
    fetch('/api/signup')
      .then(res => { if (!res.ok) throw new Error('Availability failed'); return res.json() })
      .then(data => { setCounts(data.counts); setMax(data.max) })
      .catch(() => setError('Unable to load availability. Please try selecting a session again.'))
  }, [])

  useEffect(() => {
    if (!selectedKey) return
    const s = SESSIONS.find(item => item.key === selectedKey)
    if (!s) return
    const controller = new AbortController()
    fetch(`/api/signup?month=${s.month}&session=${s.session}`, { signal: controller.signal })
      .then(res => { if (!res.ok) throw new Error('Availability failed'); return res.json() })
      .then(data => { setSessionCount(data.count); setRegistrations(data.registrations ?? []); setSessionLoading(false) })
      .catch(err => { if (err.name !== 'AbortError') setError('Unable to check availability. Please return to sessions and try again.') })
    return () => controller.abort()
  }, [selectedKey])


  const handleSelect = (s: typeof SESSIONS[0]) => {
    setSelectedKey(s.key)
    setError('')
    setEmailPreview(null)
    setCertUnlocked(false)
    setCertFiles([])
    setCertPassword('')
    setListUnlocked(false)
    setListPassword('')
    setListError('')
    setSessionCount(0)
    setSessionLoading(true)
    setRegistrations([])
    setForm(prev => ({ ...prev, trainingSessions: s.trainingOptions ?? [] }))
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
    if (sessionLoading) return
    const { companyName, countryRegion, name, jobTitle, jobResponsibilities, trainingSessions, email, telephone } = form
    if (!companyName || !countryRegion || !name || !jobTitle || !jobResponsibilities || !email || !telephone) {
      setError('Please fill in all fields'); return
    }
    if (trainingSessions.length === 0) { setError('Please select at least one training session'); return }
    setLoading(true); setError('')
    const sel = SESSIONS.find(s => s.key === selectedKey)!
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month: sel.month, session: sel.session, ...form })
      })
      const data = await res.json()
      setLoading(false)
      if (res.ok) {
        setEmailPreview(data.emailPreview)
        setSessionCount(c => c + 1)
        setCounts(prev => ({ ...prev, [selectedKey!]: (prev[selectedKey!] ?? 0) + 1 }))
        setRegistrations(prev => [...prev, { company_name: form.companyName, country_region: form.countryRegion, training_sessions: form.trainingSessions, name: form.name }])
        setForm({ companyName: '', countryRegion: '', name: '', jobTitle: '', jobResponsibilities: '', trainingSessions: [], email: '', telephone: '' })
      } else {
        setError(data.error || 'Registration failed, please try again.')
      }
    } catch {
      setLoading(false)
      setError('Unable to submit registration. Please check your connection and try again.')
    }
  }

  const handleCertUnlock = async () => {
    const sel = SESSIONS.find(s => s.key === selectedKey)!
    setCertLoading(true); setCertError('')
    const res = await fetch('/api/certificates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: certPassword, month: sel.month, session: sel.session })
    })
    const data = await res.json()
    setCertLoading(false)
    if (res.ok) { setCertFiles(data.files); setCertUnlocked(true) }
    else { setCertError('Wrong password, please try again.') }
  }

  const handleListUnlock = () => {
    if (listPassword === 'EMEA') { setListUnlocked(true); setListError('') }
    else { setListError('Wrong password') }
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1"
  const sel = SESSIONS.find(s => s.key === selectedKey)
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const upcomingSessions = SESSIONS.filter(s => {
    const endDate = getSessionEndDate(s)
    return s.month.startsWith(selectedYear) && isRegistrationOpen(s) && (courseFilter === 'all' || s.category === courseFilter) && (!endDate || endDate >= today)
  })

  const watermark = (
    <div className="fixed bottom-4 right-5 text-gray-600 text-base font-medium drop-shadow z-10">
      Questions? <a href="mailto:tianyang.ma@dobot-global.com" className="underline text-blue-700">tianyang.ma@dobot-global.com</a>
    </div>
  )

  if (!selectedKey) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6" style={bgStyle}>
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 w-full max-w-5xl shadow-xl">
          <div className="flex flex-col items-center mb-8">
            <img src="/Background_EMEA.png" alt="Dobot Logo" className="h-14 mb-3" />
            <p className="text-blue-700 font-bold text-xl tracking-widest uppercase">Dobot EMEA</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-3 mb-1 text-center">Training Registration {selectedYear}</h1>
            <p className="text-gray-500 text-sm text-center">Select a session to register for your training</p>
            <Link href="/calendar" className="mt-3 text-sm text-blue-700 underline underline-offset-4">
              View full 2027 calendar
            </Link>
          </div>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <label className="text-sm font-medium text-gray-700">Training year
              <select value={selectedYear} onChange={e => { setSelectedYear(e.target.value); setCourseFilter('all') }} className="ml-3 rounded-lg border border-gray-300 bg-white px-3 py-2">
                <option value="2027">2027</option><option value="2026">2026</option>
              </select>
            </label>
            {selectedYear === '2027' && <label className="text-sm font-medium text-gray-700">Training type
              <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)} className="ml-3 rounded-lg border border-gray-300 bg-white px-3 py-2">
                <option value="all">All training</option><option value="onboarding">Onboarding</option><option value="welding">Application · Welding</option><option value="palletizing">Application · Palletizing</option>
              </select>
            </label>}
          </div>
          {selectedYear === '2027' && <section className="mb-7 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 text-slate-700">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-900">Before you register</h2>
              <p className="text-xs text-slate-500">Registration opens six months before each session.</p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Attendance</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">Two participants per partner company</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Recommended for the best hands-on learning experience.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Laptop</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">At least one laptop per company</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Local administrator rights are strongly preferred for software setup and testing.</p>
              </div>
            </div>
          </section>}
          <div className="flex justify-center mb-8">
            <a href="https://dobotrobots999-my.sharepoint.com/:f:/g/personal/alexander_hou_dobot-global_com/IgDpZYhZJqWhS4Vf0yO6OHEWAdIOnSGpGXYqNDS1jOyDoMc"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-md transition">
              📥 Download Training Materials
            </a>
          </div>
          {error && <p role="alert" className="mb-4 text-sm text-red-600">{error}</p>}
          <div className="space-y-6">
            {months.map(month => {
              const monthSessions = upcomingSessions.filter(s => s.label.startsWith(month))
              if (monthSessions.length === 0) return null
              return (
                <div key={month}>
                  <h2 className="text-base font-semibold text-gray-600 mb-3 border-b border-gray-200 pb-1">{month} {selectedYear}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {monthSessions.map(s => {
                      const count = counts[s.key] ?? 0
                      const full = count >= max
                      return (
                        <button key={s.key} onClick={() => handleSelect(s)}
                          className={`rounded-2xl p-5 text-left shadow transition-all border-2 ${full
                            ? 'bg-gray-50 border-red-200 hover:border-red-400 hover:shadow-lg'
                            : 'bg-white border-transparent hover:border-blue-500 hover:shadow-lg'}`}>
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
                                <span className="w-12 shrink-0 font-medium text-gray-700">{d.day}</span>
                                <span className="w-16 shrink-0">{d.date}</span>
                                <span>{d.training}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`text-lg font-bold ${full ? 'text-gray-400' : 'text-blue-600'}`}>{count} / {max}</span>
                            <span className="text-xs text-gray-400">spots filled · Select to register</span>
                          </div>
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${full ? 'bg-red-400' : 'bg-blue-500'}`}
                              style={{ width: `${(count / max) * 100}%` }} />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
            {upcomingSessions.length === 0 && (
              <div className="text-center text-sm text-gray-500 py-6">
                No upcoming sessions are available right now.
              </div>
            )}
          </div>
        </div>
        {watermark}
      </main>
    )
  }

  if (emailPreview) {
    return (
      <main className="min-h-screen flex items-start justify-center p-6" style={bgStyle}>
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl my-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🎉</div>
            <h1 className="text-2xl font-bold text-green-600">Registration Successful!</h1>
            <p className="text-gray-500 text-sm mt-1">A confirmation email has been sent to <strong>{emailPreview.to}</strong></p>
            <p className="text-orange-500 text-xs mt-1">⚠️ Please also check your spam / junk folder if you don&apos;t see it.</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-sm">
            <h2 className="font-bold text-gray-800 mb-4 text-base">📧 Email Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex gap-2"><span className="text-gray-400 w-32 shrink-0">Session</span><span className="font-medium">{emailPreview.sessionLabel}</span></div>
              <div className="flex gap-2"><span className="text-gray-400 w-32 shrink-0">Dates</span><span className="font-medium">{emailPreview.dates}</span></div>
              <div className="flex gap-2"><span className="text-gray-400 w-32 shrink-0">Name</span><span className="font-medium">{emailPreview.name}</span></div>
              <div className="flex gap-2"><span className="text-gray-400 w-32 shrink-0">Company</span><span className="font-medium">{emailPreview.companyName}</span></div>
              <div className="flex gap-2"><span className="text-gray-400 w-32 shrink-0">Country</span><span className="font-medium">{emailPreview.countryRegion}</span></div>
              <div className="flex gap-2"><span className="text-gray-400 w-32 shrink-0">Job Title</span><span className="font-medium">{emailPreview.jobTitle}</span></div>
              <div className="flex gap-2"><span className="text-gray-400 w-32 shrink-0">Telephone</span><span className="font-medium">{emailPreview.telephone}</span></div>
            </div>
            <div className="mb-4">
              <p className="text-gray-400 mb-1">Registered Sessions</p>
              <div className="flex flex-wrap gap-1">
                {emailPreview.trainingSessions.map((t, i) => (
                  <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">{t}</span>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <p className="text-gray-400 mb-2">Training Schedule</p>
              <div className="space-y-1">
                {emailPreview.schedule.map((d, i) => (
                  <div key={i} className="text-xs">
                    <div className="flex gap-3">
                      <span className="w-12 font-semibold text-gray-700">{d.day}</span>
                      <span className="w-14 text-gray-500">{d.date}</span>
                      <span className="text-gray-700">{d.training}</span>
                    </div>
                    {d.note && <p className="text-amber-500 mt-0.5 pl-28">⚠️ {d.note}</p>}
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t pt-3 text-xs text-gray-500 space-y-1.5">
              {emailPreview.isS2 ? (
                <>
                  <p>🕘 Day 1–3: 09:30–12:00 | Lunch: 12:00–13:00 | Afternoon: 13:00–17:00</p>
                  <p>🕘 Day 4: Welding Training 09:30–12:00 | Afternoon: Free</p>
                </>
              ) : (
                <p>🕘 Morning: 09:30–12:00 | Lunch: 12:00–13:00 | Afternoon: 13:00–17:00</p>
              )}
              <p>📍 Dobot Europe GmbH, Werner-Heisenberg-Str. 2A, 63263 Neu-Isenburg, Germany</p>
              <p>👥 We recommend two participants per partner company.</p>
              <p>💻 Please bring at least one laptop per company, preferably with local administrator rights for software setup and testing.</p>
              <p>🍱 Soft drinks, snacks and lunch provided by Dobot</p>
              <p>🚗 Travel & accommodation to be arranged by the customer</p>
              <p>📥 <strong>Software & Slides:</strong>{' '}
                <a href="https://dobotrobots999-my.sharepoint.com/:f:/g/personal/alexander_hou_dobot-global_com/IgDpZYhZJqWhS4Vf0yO6OHEWAdIOnSGpGXYqNDS1jOyDoMc"
                  className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Click here to download</a>
                {' '}(also available via the &quot;Download Materials&quot; button on the website)
              </p>
              <p>❌ <strong>Cancellation:</strong> Please contact the person who invited you to the session. If the session cannot be held, we will notify you at least 2 weeks in advance. For special cases, please contact the person who invited you to the session so we can help arrange the next steps.</p>
            </div>
          </div>
          <button onClick={() => { setEmailPreview(null); setSelectedKey(null) }}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
            ← Back to Sessions
          </button>
        </div>
        {watermark}
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-start justify-center p-6" style={bgStyle}>
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl my-6">
        <button onClick={() => setSelectedKey(null)} className="text-blue-500 text-sm mb-4 hover:underline">← Back to sessions</button>
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-gray-900">{sel?.label} – {sel?.sublabel}</h1>
        </div>
        <p className="text-blue-600 text-sm font-medium mb-3">📅 {sel?.dates}</p>

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
          {sel?.month.startsWith('2026') && sel?.session === 'S2' && (
            <p className="text-xs text-amber-600 mt-2">⚠️ Day 4: Welding Training in the morning only (09:30–12:00). Afternoon free.</p>
          )}
          {sel?.month.startsWith('2026') && sel?.session === 'S1' && (
            <p className="text-xs text-amber-600 mt-2">⚠️ Day 4: Optional cobot practice for who would like extra hands-on time.</p>
          )}
        </div>

        {sel?.month.startsWith('2027') && <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-800">Participant and laptop guidance</p>
          <p className="mt-1">We recommend two participants per partner company. Please bring at least one laptop per company, preferably with local administrator rights for software setup and testing.</p>
        </div>}

        <div className="text-center mb-4">
          {sessionLoading && <p className="text-sm text-gray-500">Checking availability…</p>}
          <span className={`text-lg font-bold ${sessionCount >= max ? 'text-red-500' : 'text-blue-600'}`}>{sessionCount} / {max}</span>
          <span className="text-gray-500 ml-2 text-sm">spots filled</span>
          {sessionCount >= max && <p className="text-red-500 mt-1 text-sm">Registration is full</p>}
        </div>

        {/* 已注册公司 - 密码保护 */}
        {registrations.length > 0 && (
          <div className="mb-6 border border-gray-100 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center justify-between">
              <span>Registered Companies ({registrations.length})</span>
              {listUnlocked && (
                <button onClick={() => { setListUnlocked(false); setListPassword('') }}
                  className="text-gray-400 hover:text-gray-600 text-xs">🔒 Lock</button>
              )}
            </div>
            {!listUnlocked ? (
              <div className="px-4 py-3">
                <p className="text-xs text-gray-500 mb-2">🔒 Enter password to view registered companies</p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={listPassword}
                    onChange={e => { setListPassword(e.target.value); setListError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleListUnlock()}
                    placeholder="Enter password"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button onClick={handleListUnlock}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition">
                    View
                  </button>
                </div>
                {listError && <p className="text-red-500 text-xs mt-1">{listError}</p>}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {registrations.map((r, i) => (
                  <div key={i} className="px-4 py-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-700">{r.company_name}</div>
                        {r.name && <div className="text-xs text-gray-500">Participant: {r.name}</div>}
                      </div>
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
            )}
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
          <div><label className={labelClass}>Experience with Robots <span className="text-red-500">*</span></label>
            <textarea value={form.jobResponsibilities} onChange={e => setForm({...form, jobResponsibilities: e.target.value})}
              placeholder="Briefly describe your experience with robot use and programming" rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 resize-none bg-white" /></div>
          <div>
            <label className={labelClass}>Attend Training Session <span className="text-red-500">*</span></label>
            <div className="space-y-2 mt-1">
              {(sel?.trainingOptions ?? trainingOptions.filter(option => sel?.session === 'S2' || option !== 'Welding Training')).map(option => (
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
          <button onClick={handleSubmit} disabled={loading || sessionLoading || sessionCount >= max}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition text-base">
            {loading ? 'Submitting...' : 'Register Now'}
          </button>
        </div>
      </div>

      {showCertModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">🎓 Certificate Download</h2>
              <button onClick={() => { setShowCertModal(false); setCertUnlocked(false); setCertPassword(''); setCertError('') }}
                className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <p className="text-sm text-gray-500 mb-1">{sel?.label} – {sel?.sublabel}</p>
            <p className="text-xs text-gray-400 mb-4">{sel?.dates}</p>
            {!certUnlocked ? (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter Password</label>
                <input type="password" value={certPassword}
                  onChange={e => setCertPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCertUnlock()}
                  placeholder="Enter password to access certificates"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 mb-3" />
                {certError && <p className="text-red-500 text-sm mb-3">{certError}</p>}
                <button onClick={handleCertUnlock} disabled={certLoading || !certPassword}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition">
                  {certLoading ? 'Verifying...' : 'Access Certificates'}
                </button>
              </>
            ) : (
              <>
                {certFiles.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No certificates available for this session yet.</p>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {certFiles.map((f, i) => (
                      <a key={i} href={f.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-xl transition group">
                        <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">📄 {f.name}</span>
                        <span className="text-xs text-green-600 font-semibold">Download ↓</span>
                      </a>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
      {watermark}
    </main>
  )
}
