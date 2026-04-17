import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
const MAX_SLOTS = 10

async function sendEmail(to: string, subject: string, html: string) {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify({
      sender: { name: 'Dobot Europe Training', email: 'cirenyoudianshen@gmail.com' },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  })
  return response
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const month = searchParams.get('month')

  if (month) {
    const { count } = await supabase
      .from('signups')
      .select('*', { count: 'exact', head: true })
      .eq('month', month)
    return NextResponse.json({ count: count ?? 0, max: MAX_SLOTS })
  }

  const months = ['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12']
  const counts: Record<string, number> = {}
  for (const m of months) {
    const { count } = await supabase
      .from('signups')
      .select('*', { count: 'exact', head: true })
      .eq('month', m)
    counts[m] = count ?? 0
  }
  return NextResponse.json({ counts, max: MAX_SLOTS })
}

export async function POST(req: Request) {
  const { month, companyName, countryRegion, name, jobTitle, jobResponsibilities, trainingSessions, email, telephone } = await req.json()

  if (!month) {
    return NextResponse.json({ error: 'Missing month' }, { status: 400 })
  }

  const { count } = await supabase
    .from('signups')
    .select('*', { count: 'exact', head: true })
    .eq('month', month)
  if ((count ?? 0) >= MAX_SLOTS) {
    return NextResponse.json({ error: 'Registration is full for this month' }, { status: 400 })
  }

  const { error } = await supabase
    .from('signups')
    .insert({
      month,
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
    return NextResponse.json({ error: 'This email has already been registered for this month' }, { status: 400 })
  }

  const monthNames: Record<string, string> = {
    '2026-04': 'April 2026', '2026-05': 'May 2026', '2026-06': 'June 2026',
    '2026-07': 'July 2026', '2026-08': 'August 2026', '2026-09': 'September 2026',
    '2026-10': 'October 2026', '2026-11': 'November 2026', '2026-12': 'December 2026',
  }
  const monthLabel = monthNames[month] ?? month

  await sendEmail(
    email,
    `Training Registration Confirmed – ${monthLabel} ✅`,
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
        <tr><td style="padding: 6px 0; color: #6b7280;">Training Month</td><td><strong>${monthLabel}</strong></td></tr>
      </table>

      <h3 style="color: #1d4ed8; margin-top: 24px;">✅ Registered Training Sessions</h3>
      <ul style="padding-left: 20px;">
        ${trainingSessions.map((s: string) => `<li style="margin-bottom: 4px;">${s}</li>`).join('')}
      </ul>

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
      <p style="color: #6b7280; font-size: 13px;">If you have any questions, please don't hesitate to contact us.<br/>We look forward to seeing you in <strong>${monthLabel}</strong>!</p>
    </div>
    `
  )

  return NextResponse.json({ success: true })
}