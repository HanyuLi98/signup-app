'use client'
import { useState, useEffect } from 'react'

const SESSIONS = [
  { key: '2026-05-S1', month: '2026-05', session: 'S1', label: 'May 2026', sublabel: 'Session 1', dates: 'May 5–7, 2026',
    schedule: [
      { day: 'Day 1', date: 'May 5', training: 'Basic Training' },
      { day: 'Day 2', date: 'May 6', training: 'Advanced Training' },
      { day: 'Day 3', date: 'May 7', training: 'VX 500 + Palletizing' },
    ]},
  { key: '2026-05-S2', month: '2026-05', session: 'S2', label: 'May 2026', sublabel: 'Session 2', dates: 'May 26–29, 2026',
    schedule: [
      { day: 'Day 1', date: 'May 26', training: 'Basic Training' },
      { day: 'Day 2', date: 'May 27', training: 'Advanced Training' },
      { day: 'Day 3', date: 'May 28', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'May 29', training: 'Welding Training (Morning only)' },
    ]},
  { key: '2026-06-S1', month: '2026-06', session: 'S1', label: 'June 2026', sublabel: 'Session 1', dates: 'Jun 9–11, 2026',
    schedule: [
      { day: 'Day 1', date: 'Jun 9', training: 'Basic Training' },
      { day: 'Day 2', date: 'Jun 10', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Jun 11', training: 'VX 500 + Palletizing' },
    ]},
  { key: '2026-06-S2', month: '2026-06', session: 'S2', label: 'June 2026', sublabel: 'Session 2', dates: 'Jun 23–26, 2026',
    schedule: [
      { day: 'Day 1', date: 'Jun 23', training: 'Basic Training' },
      { day: 'Day 2', date: 'Jun 24', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Jun 25', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'Jun 26', training: 'Welding Training (Morning only)' },
    ]},
  { key: '2026-07-S1', month: '2026-07', session: 'S1', label: 'July 2026', sublabel: 'Session 1', dates: 'Jul 7–9, 2026',
    schedule: [
      { day: 'Day 1', date: 'Jul 7', training: 'Basic Training' },
      { day: 'Day 2', date: 'Jul 8', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Jul 9', training: 'VX 500 + Palletizing' },
    ]},
  { key: '2026-07-S2', month: '2026-07', session: 'S2', label: 'July 2026', sublabel: 'Session 2', dates: 'Jul 21–24, 2026',
    schedule: [
      { day: 'Day 1', date: 'Jul 21', training: 'Basic Training' },
      { day: 'Day 2', date: 'Jul 22', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Jul 23', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'Jul 24', training: 'Welding Training (Morning only)' },
    ]},
  { key: '2026-08-S1', month: '2026-08', session: 'S1', label: 'August 2026', sublabel: 'Session 1', dates: 'Aug 4–6, 2026',
    schedule: [
      { day: 'Day 1', date: 'Aug 4', training: 'Basic Training' },
      { day: 'Day 2', date: 'Aug 5', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Aug 6', training: 'VX 500 + Palletizing' },
    ]},
  { key: '2026-08-S2', month: '2026-08', session: 'S2', label: 'August 2026', sublabel: 'Session 2', dates: 'Aug 18–21, 2026',
    schedule: [
      { day: 'Day 1', date: 'Aug 18', training: 'Basic Training' },
      { day: 'Day 2', date: 'Aug 19', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Aug 20', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'Aug 21', training: 'Welding Training (Morning only)' },
    ]},
  { key: '2026-09-S1', month: '2026-09', session: 'S1', label: 'September 2026', sublabel: 'Session 1', dates: 'Sep 8–10, 2026',
    schedule: [
      { day: 'Day 1', date: 'Sep 8', training: 'Basic Training' },
      { day: 'Day 2', date: 'Sep 9', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Sep 10', training: 'VX 500 + Palletizing' },
    ]},
  { key: '2026-09-S2', month: '2026-09', session: 'S2', label: 'September 2026', sublabel: 'Session 2', dates: 'Sep 22–25, 2026',
    schedule: [
      { day: 'Day 1', date: 'Sep 22', training: 'Basic Training' },
      { day: 'Day 2', date: 'Sep 23', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Sep 24', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'Sep 25', training: 'Welding Training (Morning only)' },
    ]},
  { key: '2026-10-S1', month: '2026-10', session: 'S1', label: 'October 2026', sublabel: 'Session 1', dates: 'Oct 6–8, 2026',
    schedule: [
      { day: 'Day 1', date: 'Oct 6', training: 'Basic Training' },
      { day: 'Day 2', date: 'Oct 7', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Oct 8', training: 'VX 500 + Palletizing' },
    ]},
  { key: '2026-10-S2', month: '2026-10', session: 'S2', label: 'October 2026', sublabel: 'Session 2', dates: 'Oct 20–23, 2026',
    schedule: [
      { day: 'Day 1', date: 'Oct 20', training: 'Basic Training' },
      { day: 'Day 2', date: 'Oct 21', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Oct 22', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'Oct 23', training: 'Welding Training (Morning only)' },
    ]},
  { key: '2026-11-S1', month: '2026-11', session: 'S1', label: 'November 2026', sublabel: 'Session 1', dates: 'Nov 3–5, 2026',
    schedule: [
      { day: 'Day 1', date: 'Nov 3', training: 'Basic Training' },
      { day: 'Day 2', date: 'Nov 4', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Nov 5', training: 'VX 500 + Palletizing' },
    ]},
  { key: '2026-11-S2', month: '2026-11', session: 'S2', label: 'November 2026', sublabel: 'Session 2', dates: 'Nov 24–27, 2026',
    schedule: [
      { day: 'Day 1', date: 'Nov 24', training: 'Basic Training' },
      { day: 'Day 2', date: 'Nov 25', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Nov 26', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'Nov 27', training: 'Welding Training (Morning only)' },
    ]},
  { key: '2026-12-S1', month: '2026-12', session: 'S1', label: 'December 2026', sublabel: 'Session 1', dates: 'Dec 8–10, 2026',
    schedule: [
      { day: 'Day 1', date: 'Dec 8', training: 'Basic Training' },
      { day: 'Day 2', date: 'Dec 9', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Dec 10', training: 'VX 500 + Palletizing' },
    ]},
]

const trainingOptions = [
  'Basic Training', 'Advanced Training', 'Palletizing Training',
  'VX 500 Training', 'Welding Training',
]

const bgStyle = {
  background: 'linear-gradient(135deg, #dbeafe 0%, #ede9fe 50%, #dbeafe 100%)',
}

type Registration = { company_name: string; country_region: string; training_sessions: string[] }
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

export default function Home() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [max, setMax] = useState(10)
  const [form, setForm] = useState({
    companyName: '', countryRegion: '', name: '', jobTitle: '',
    jobResponsibilities: '', trainingSessions: [] as string[], email: '', telephone: '',
  })
  const [loading, setLoading] = useState(false)
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
      .then(res => res.json())
      .then(data => { setCounts(data.counts); setMax(data.max) })
  }, [])

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
    setLoading(true); setError('')
    const sel = SESSIONS.find(s => s.key === selectedKey)!
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
      setRegistrations(prev => [...prev, { company_name: form.companyName, country_region: form.countryRegion, training_sessions: form.trainingSessions }])
      setForm({ companyName: '', countryRegion: '', name: '', jobTitle: '', jobResponsibilities: '', trainingSessions: [], email: '', telephone: '' })
    } else {
      setError(data.error || 'Registration failed, please try again.')
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
  const months = ['May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const watermark = (
    <div className="fixed bottom-4 right-5 text-gray-600 text-base font-medium drop-shadow z-10">
      @ikun · Questions? <a href="mailto:hanyu.li@dobot-global.com" className="underline text-blue-700">hanyu.li@dobot-global.com</a>
    </div>
  )

  if (!selectedKey) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6" style={bgStyle}>
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 w-full max-w-5xl shadow-xl">
          <div className="flex flex-col items-center mb-8">
            <img src="/Background_EMEA.png" alt="Dobot Logo" className="h-14 mb-3" />
            <p className="text-blue-700 font-bold text-xl tracking-widest uppercase">Dobot EMEA</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-3 mb-1 text-center">Training Registration 2026</h1>
            <p className="text-gray-500 text-sm text-center">Select a session to register for your training</p>
          </div>
          <div className="flex justify-center mb-8">
            <a href="https://dobotrobots999-my.sharepoint.com/:f:/g/personal/alexander_hou_dobot-global_com/IgDpZYhZJqWhS4Vf0yO6OHEWAdIOnSGpGXYqNDS1jOyDoMc?e=9VDAUi"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-md transition">
              📥 Download Training Materials
            </a>
          </div>
          <div className="space-y-6">
            {months.map(month => {
              const monthSessions = SESSIONS.filter(s => s.label.startsWith(month))
              return (
                <div key={month}>
                  <h2 className="text-base font-semibold text-gray-600 mb-3 border-b border-gray-200 pb-1">{month} 2026</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {monthSessions.map(s => {
                      const count = counts[s.key] ?? 0
                      const full = count >= max
                      return (
                        <button key={s.key} onClick={() => !full && handleSelect(s)} disabled={full}
                          className={`rounded-2xl p-5 text-left shadow transition-all border-2 ${full
                            ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60'
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
                            <span className="text-xs text-gray-400">spots filled</span>
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
            <p className="text-orange-500 text-xs mt-1">⚠️ Please also check your spam / junk folder if you don't see it.</p>
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
              <p>💻 Please bring your own laptop</p>
              <p>🍱 Soft drinks, snacks and lunch provided by Dobot</p>
              <p>🚗 Travel & accommodation to be arranged by the customer</p>
              <p>📥 <strong>Software & Slides:</strong>{' '}
                <a href="https://dobotrobots999-my.sharepoint.com/:f:/g/personal/alexander_hou_dobot-global_com/IgDpZYhZJqWhS4Vf0yO6OHEWAdIOnSGpGXYqNDS1jOyDoMc?e=LecscN"
                  className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Click here to download</a>
                {' '}(also available via the "Download Materials" button on the website)
              </p>
              <p>❌ <strong>Cancellation:</strong> Please contact the person who shared your registration link. Cancel at least one week in advance if possible.</p>
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
          <button onClick={() => setShowCertModal(true)}
            className="ml-3 shrink-0 inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition">
            🎓 Certificate
          </button>
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
          {sel?.session === 'S2' && (
            <p className="text-xs text-amber-600 mt-2">⚠️ Day 4: Welding Training in the morning only (09:30–12:00). Afternoon free.</p>
          )}
        </div>

        <div className="text-center mb-4">
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
          <button onClick={handleSubmit} disabled={loading || sessionCount >= max}
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