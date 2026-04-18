import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
const MAX_SLOTS = 10

async function sendEmail(to: string, subject: string, html: string) {
  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify({
      sender: { name: 'Dobot Europe Training', email: 'hanyuli1998@gmail.com' },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const month = searchParams.get('month')
  const session = searchParams.get('session')

  if (month && session) {
    const { count, data } = await supabase
      .from('signups')
      .select('company_name, country_region, training_sessions', { count: 'exact' })
      .eq('month', month)
      .eq('session', session)
    return NextResponse.json({ count: count ?? 0, max: MAX_SLOTS, registrations: data ?? [] })
  }

  const sessions = [
    '2026-05-S1', '2026-05-S2',
    '2026-06-S1', '2026-06-S2',
    '2026-07-S1', '2026-07-S2',
    '2026-08-S1', '2026-08-S2',
    '2026-09-S1', '2026-09-S2',
    '2026-10-S1', '2026-10-S2',
    '2026-11-S1', '2026-11-S2',
    '2026-12-S1', '2026-12-S2',
  ]
  const counts: Record<string, number> = {}
  for (const s of sessions) {
    const { count } = await supabase
      .from('signups')
      .select('*', { count: 'exact', head: true })
      .eq('month', s.slice(0, 7))
      .eq('session', s.slice(8))
    counts[s] = count ?? 0
  }
  return NextResponse.json({ counts, max: MAX_SLOTS })
}

export async function POST(req: Request) {
  const { month, session, companyName, countryRegion, name, jobTitle, jobResponsibilities, trainingSessions, email, telephone } = await req.json()

  if (!month || !session) {
    return NextResponse.json({ error: 'Missing month or session' }, { status: 400 })
  }

  const { count } = await supabase
    .from('signups')
    .select('*', { count: 'exact', head: true })
    .eq('month', month)
    .eq('session', session)
  if ((count ?? 0) >= MAX_SLOTS) {
    return NextResponse.json({ error: 'Registration is full for this session' }, { status: 400 })
  }

  const { error } = await supabase
    .from('signups')
    .insert({
      month, session,
      company_name: companyName,
      country_region: countryRegion,
      name,
      job_title: jobTitle,
      job_responsibilities: jobResponsibilities,
      training_sessions: trainingSessions,
      email,
      telephone,
    })
  if (error) {
    return NextResponse.json({ error: 'This email has already been registered for this session' }, { status: 400 })
  }

  const sessionDates: Record<string, { label: string, dates: string, schedule: {day: string, date: string, training: string}[] }> = {
    '2026-05-S1': { label: 'May 2026 – Session 1', dates: 'May 5–8, 2026', schedule: [
      { day: 'Day 1', date: 'May 5', training: 'Basic Training' },
      { day: 'Day 2', date: 'May 6', training: 'Advanced Training' },
      { day: 'Day 3', date: 'May 7', training: 'VX 500 Training + Palletizing Training' },
      { day: 'Day 4', date: 'May 8', training: 'Welding Training' },
    ]},
    '2026-05-S2': { label: 'May 2026 – Session 2', dates: 'May 26–29, 2026', schedule: [
      { day: 'Day 1', date: 'May 26', training: 'Basic Training' },
      { day: 'Day 2', date: 'May 27', training: 'Advanced Training' },
      { day: 'Day 3', date: 'May 28', training: 'VX 500 Training + Palletizing Training' },
      { day: 'Day 4', date: 'May 29', training: 'Welding Training' },
    ]},
    '2026-06-S1': { label: 'June 2026 – Session 1', dates: 'Jun 9–12, 2026', schedule: [
      { day: 'Day 1', date: 'Jun 9', training: 'Basic Training' },
      { day: 'Day 2', date: 'Jun 10', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Jun 11', training: 'VX 500 Training + Palletizing Training' },
      { day: 'Day 4', date: 'Jun 12', training: 'Welding Training' },
    ]},
    '2026-06-S2': { label: 'June 2026 – Session 2', dates: 'Jun 23–26, 2026', schedule: [
      { day: 'Day 1', date: 'Jun 23', training: 'Basic Training' },
      { day: 'Day 2', date: 'Jun 24', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Jun 25', training: 'VX 500 Training + Palletizing Training' },
      { day: 'Day 4', date: 'Jun 26', training: 'Welding Training' },
    ]},
    '2026-07-S1': { label: 'July 2026 – Session 1', dates: 'Jul 14–17, 2026', schedule: [
      { day: 'Day 1', date: 'Jul 14', training: 'Basic Training' },
      { day: 'Day 2', date: 'Jul 15', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Jul 16', training: 'VX 500 Training + Palletizing Training' },
      { day: 'Day 4', date: 'Jul 17', training: 'Welding Training' },
    ]},
    '2026-07-S2': { label: 'July 2026 – Session 2', dates: 'Jul 28–31, 2026', schedule: [
      { day: 'Day 1', date: 'Jul 28', training: 'Basic Training' },
      { day: 'Day 2', date: 'Jul 29', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Jul 30', training: 'VX 500 Training + Palletizing Training' },
      { day: 'Day 4', date: 'Jul 31', training: 'Welding Training' },
    ]},
    '2026-08-S1': { label: 'August 2026 – Session 1', dates: 'Aug 11–14, 2026', schedule: [
      { day: 'Day 1', date: 'Aug 11', training: 'Basic Training' },
      { day: 'Day 2', date: 'Aug 12', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Aug 13', training: 'VX 500 Training + Palletizing Training' },
      { day: 'Day 4', date: 'Aug 14', training: 'Welding Training' },
    ]},
    '2026-08-S2': { label: 'August 2026 – Session 2', dates: 'Aug 25–28, 2026', schedule: [
      { day: 'Day 1', date: 'Aug 25', training: 'Basic Training' },
      { day: 'Day 2', date: 'Aug 26', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Aug 27', training: 'VX 500 Training + Palletizing Training' },
      { day: 'Day 4', date: 'Aug 28', training: 'Welding Training' },
    ]},
    '2026-09-S1': { label: 'September 2026 – Session 1', dates: 'Sep 8–11, 2026', schedule: [
      { day: 'Day 1', date: 'Sep 8', training: 'Basic Training' },
      { day: 'Day 2', date: 'Sep 9', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Sep 10', training: 'VX 500 Training + Palletizing Training' },
      { day: 'Day 4', date: 'Sep 11', training: 'Welding Training' },
    ]},
    '2026-09-S2': { label: 'September 2026 – Session 2', dates: 'Sep 22–25, 2026', schedule: [
      { day: 'Day 1', date: 'Sep 22', training: 'Basic Training' },
      { day: 'Day 2', date: 'Sep 23', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Sep 24', training: 'VX 500 Training + Palletizing Training' },
      { day: 'Day 4', date: 'Sep 25', training: 'Welding Training' },
    ]},
    '2026-10-S1': { label: 'October 2026 – Session 1', dates: 'Oct 13–16, 2026', schedule: [
      { day: 'Day 1', date: 'Oct 13', training: 'Basic Training' },
      { day: 'Day 2', date: 'Oct 14', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Oct 15', training: 'VX 500 Training + Palletizing Training' },
      { day: 'Day 4', date: 'Oct 16', training: 'Welding Training' },
    ]},
    '2026-10-S2': { label: 'October 2026 – Session 2', dates: 'Oct 27–30, 2026', schedule: [
      { day: 'Day 1', date: 'Oct 27', training: 'Basic Training' },
      { day: 'Day 2', date: 'Oct 28', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Oct 29', training: 'VX 500 Training + Palletizing Training' },
      { day: 'Day 4', date: 'Oct 30', training: 'Welding Training' },
    ]},
    '2026-11-S1': { label: 'November 2026 – Session 1', dates: 'Nov 10–13, 2026', schedule: [
      { day: 'Day 1', date: 'Nov 10', training: 'Basic Training' },
      { day: 'Day 2', date: 'Nov 11', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Nov 12', training: 'VX 500 Training + Palletizing Training' },
      { day: 'Day 4', date: 'Nov 13', training: 'Welding Training' },
    ]},
    '2026-11-S2': { label: 'November 2026 – Session 2', dates: 'Nov 24–27, 2026', schedule: [
      { day: 'Day 1', date: 'Nov 24', training: 'Basic Training' },
      { day: 'Day 2', date: 'Nov 25', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Nov 26', training: 'VX 500 Training + Palletizing Training' },
      { day: 'Day 4', date: 'Nov 27', training: 'Welding Training' },
    ]},
    '2026-12-S1': { label: 'December 2026 – Session 1', dates: 'Dec 8–11, 2026', schedule: [
      { day: 'Day 1', date: 'Dec 8', training: 'Basic Training' },
      { day: 'Day 2', date: 'Dec 9', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Dec 10', training: 'VX 500 Training + Palletizing Training' },
      { day: 'Day 4', date: 'Dec 11', training: 'Welding Training' },
    ]},
    '2026-12-S2': { label: 'December 2026 – Session 2', dates: 'Dec 22–25, 2026', schedule: [
      { day: 'Day 1', date: 'Dec 22', training: 'Basic Training' },
      { day: 'Day 2', date: 'Dec 23', training: 'Advanced Training' },
      { day: 'Day 3', date: 'Dec 24', training: 'VX 500 Training + Palletizing Training' },
      { day: 'Day 4', date: 'Dec 25', training: 'Welding Training' },
    ]},
  }

  const key = `${month}-${session}`
  const sessionInfo = sessionDates[key]
  const scheduleRows = sessionInfo?.schedule.map(s =>
    `<tr>
      <td style="padding: 6px 8px; color: #6b7280; white-space: nowrap;">${s.day}</td>
      <td style="padding: 6px 8px; color: #6b7280; white-space: nowrap;">${s.date}</td>
      <td style="padding: 6px 8px; font-weight: 500;">${s.training}</td>
    </tr>`
  ).join('') ?? ''

  await sendEmail(
    email,
    `Training Registration Confirmed – ${sessionInfo?.label ?? key} ✅`,
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #1d4ed8;">Training Registration Confirmed</h2>
      <p>Dear <strong>${name}</strong>,</p>
      <p>Thank you for registering! Your registration has been confirmed. Below are your details and training information.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

      <h3 style="color: #1d4ed8;">📋 Your Registration Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 6px 0; color: #6b7280; width: 160px;">Company</td><td><strong>${companyName}</strong></td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280;">Country / Region</td><td><strong>${countryRegion}</strong></td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280;">Name</td><td><strong>${name}</strong></td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280;">Job Title</td><td><strong>${jobTitle}</strong></td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280;">Training Session</td><td><strong>${sessionInfo?.label ?? key}</strong></td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280;">Dates</td><td><strong>${sessionInfo?.dates ?? ''}</strong></td></tr>
      </table>

      <h3 style="color: #1d4ed8; margin-top: 24px;">✅ Registered Training Sessions</h3>
      <ul style="padding-left: 20px;">
        ${trainingSessions.map((s: string) => `<li style="margin-bottom: 4px;">${s}</li>`).join('')}
      </ul>

      <h3 style="color: #1d4ed8; margin-top: 24px;">📅 Training Schedule</h3>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px;">
        <thead>
          <tr style="background: #f9fafb;">
            <th style="padding: 8px; text-align: left; color: #6b7280; font-size: 13px;">Day</th>
            <th style="padding: 8px; text-align: left; color: #6b7280; font-size: 13px;">Date</th>
            <th style="padding: 8px; text-align: left; color: #6b7280; font-size: 13px;">Training</th>
          </tr>
        </thead>
        <tbody>${scheduleRows}</tbody>
      </table>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

      <h3 style="color: #1d4ed8;">🕘 Daily Training Schedule</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 6px 0; color: #6b7280; width: 160px;">Morning</td><td>09:30 – 12:00</td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280;">Lunch Break</td><td>12:00 – 13:00</td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280;">Afternoon</td><td>13:00 – 17:00</td></tr>
      </table>

      <h3 style="color: #1d4ed8; margin-top: 24px;">📍 Training Address</h3>
      <p style="margin: 0;">Dobot Europe GmbH<br/>Werner-Heisenberg-Str. 2A<br/>63263, Neu-Isenburg, Germany</p>

      <h3 style="color: #1d4ed8; margin-top: 24px;">📌 Additional Notes</h3>
      <ul style="padding-left: 20px; line-height: 1.8;">
        <li><strong>Travel and accommodation:</strong> To be arranged by the customer.</li>
        <li><strong>Provided by Dobot during training:</strong> Complimentary soft drinks, snacks, and a simple lunch.</li>
        <li><strong>Laptop:</strong> Please bring your own PC, as we will not provide computers for the training.</li>
      </ul>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <p style="color: #6b7280; font-size: 13px;">⚠️ Please also check your <strong>spam / junk folder</strong> if you do not see this email in your inbox.</p>
      <p style="color: #6b7280; font-size: 13px;">If you have any questions, please contact <a href="mailto:hanyu.li@dobot-global.com">hanyu.li@dobot-global.com</a></p>
    </div>
    `
  )

  return NextResponse.json({ success: true })
}