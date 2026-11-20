import plan from '../data/training-2027.json'

export type TrainingSession = {
  key: string
  month: string
  session: string
  label: string
  sublabel: string
  dates: string
  schedule: { day: string; date: string; training: string; note?: string }[]
  category?: 'onboarding' | 'welding' | 'palletizing'
  trainingOptions?: string[]
}

const LEGACY_SESSIONS: TrainingSession[] = [
  { key: '2026-05-S1', month: '2026-05', session: 'S1', label: 'May 2026', sublabel: 'Session 1', dates: 'May 5–7, 2026',
    schedule: [
      { day: 'Day 1', date: 'May 5', training: 'Basic Training' },
      { day: 'Day 2', date: 'May 6', training: 'Advanced Training' },
      { day: 'Day 3', date: 'May 7', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'May 8', training: 'Open hands-on Practice Opportunity (optional)' },
    ]},
  { key: '2026-05-S2', month: '2026-05', session: 'S2', label: 'May 2026', sublabel: 'Session 2', dates: 'May 26–29, 2026',
    schedule: [
      { day: 'Day 1', date: 'May 26', training: 'Basic Training' },
      { day: 'Day 2', date: 'May 27', training: 'Advanced Training' },
      { day: 'Day 3', date: 'May 28', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'May 29', training: 'Welding Training (Morning only)' },
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
      { day: 'Day 4', date: 'Jul 10', training: 'Open hands-on Practice Opportunity (optional)' },
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
      { day: 'Day 4', date: 'Aug 7', training: 'Open hands-on Practice Opportunity (optional)' },
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
      { day: 'Day 4', date: 'Sep 11', training: 'Open hands-on Practice Opportunity (optional)' },
    ]},
  { key: '2026-09-S2', month: '2026-09', session: 'S2', label: 'September 2026', sublabel: 'Session 2', dates: 'Sep 22–25, 2026',
    schedule: [
      { day: 'Day 1', date: 'Sep 22', training: 'Basic Training' },
      { day: 'Day 2', date: 'Sep 23', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Sep 24', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'Sep 25', training: 'Welding Training (Morning only)' },
    ]},
  { key: '2026-10-S1', month: '2026-10', session: 'S1', label: 'October 2026', sublabel: 'Session 1', dates: 'Oct 13–15, 2026',
    schedule: [
      { day: 'Day 1', date: 'Oct 13', training: 'Basic Training' },
      { day: 'Day 2', date: 'Oct 14', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Oct 15', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'Oct 16', training: 'Open hands-on Practice Opportunity (optional)' },
    ]},
  { key: '2026-11-S1', month: '2026-11', session: 'S1', label: 'November 2026', sublabel: 'Session 1', dates: 'Nov 3–5, 2026',
    schedule: [
      { day: 'Day 1', date: 'Nov 3', training: 'Basic Training' },
      { day: 'Day 2', date: 'Nov 4', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Nov 5', training: 'VX 500 + Palletizing' },
      { day: 'Day 4', date: 'Nov 6', training: 'Open hands-on Practice Opportunity (optional)' },
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
      { day: 'Day 4', date: 'Dec 11', training: 'Open hands-on Practice Opportunity (optional)' },
    ]},
]

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
const courseNames = { onboarding: 'Onboarding Training', welding: 'Welding Training', palletizing: 'Palletizing Training' }

export const SESSIONS_2027: TrainingSession[] = (['onboarding','welding','palletizing'] as const).flatMap(category => {
  const monthlyCounts: Record<number,number> = {}
  return plan[category].map(([month,start,last]) => {
    const end = last ?? start
    monthlyCounts[month] = (monthlyCounts[month] ?? 0) + 1
    const session = category === 'onboarding' ? `S${monthlyCounts[month]}` : category.toUpperCase()
    const shortMonth = monthNames[month-1].slice(0,3)
    const date = (d:number) => `${shortMonth} ${d}`
    return {
      key: `2027-${String(month).padStart(2,'0')}-${session}`,
      month: `2027-${String(month).padStart(2,'0')}`,
      session,
      label: `${monthNames[month-1]} 2027`,
      sublabel: category === 'onboarding' ? `Onboarding · Session ${monthlyCounts[month]}` : courseNames[category],
      dates: `${date(start)}${end!==start ? `–${end}` : ''}, 2027`,
      category,
      trainingOptions: [courseNames[category]],
      schedule: category === 'onboarding' ? [
        { day:'Day 1', date:date(start), training:'Introduction & CRA Basic' },
        { day:'Day 2', date:date(start + 1), training:'CRA Advanced & Maintenance' },
        { day:'Day 3', date:date(end), training:'Demo & Solution Tour' },
      ] : [{ day:'Day 1', date:date(start), training: `${courseNames[category]}: process package, plugins, configuration and hands-on practice` }],
    }
  })
}).sort((a,b) => {
  const day = (s:TrainingSession) => Number(s.schedule[0].date.replace(/\D/g,''))
  return a.month.localeCompare(b.month) || day(a)-day(b)
})

export const SESSIONS: TrainingSession[] = [...LEGACY_SESSIONS, ...SESSIONS_2027]
export function isRegistrationOpen(session: TrainingSession, now = new Date()) {
  if (!session.month.startsWith('2027')) return true
  const firstDay = Number.parseInt(session.schedule[0]?.date.replace(/\D/g, '') ?? '', 10)
  if (Number.isNaN(firstDay)) return false
  const year = Number.parseInt(session.month.slice(0, 4), 10)
  const month = Number.parseInt(session.month.slice(5, 7), 10) - 1
  const sessionDate = new Date(year, month, firstDay)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const sixMonthsAhead = new Date(today)
  sixMonthsAhead.setMonth(sixMonthsAhead.getMonth() + 6)
  return sessionDate >= today && sessionDate <= sixMonthsAhead
}
export function findSession(month:string, session:string) {
  return SESSIONS.find(s => s.month === month && s.session === session)
}
