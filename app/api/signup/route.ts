import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY!)
const MAX_SLOTS = 10

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

  // 返回所有月份的名额
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

  // 检查名额
  const { count } = await supabase
    .from('signups')
    .select('*', { count: 'exact', head: true })
    .eq('month', month)
  if ((count ?? 0) >= MAX_SLOTS) {
    return NextResponse.json({ error: 'Registration is full for this month' }, { status: 400 })
  }

  // 写入数据库
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

  // 发送确认邮件
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: `Registration Confirmed - ${month} ✅`,
    html: `
      <h2>Hello, ${name}!</h2>
      <p>Your registration for <strong>${month}</strong> has been confirmed.</p>
      <ul>
        <li><strong>Company:</strong> ${companyName}</li>
        <li><strong>Country / Region:</strong> ${countryRegion}</li>
        <li><strong>Job Title:</strong> ${jobTitle}</li>
        <li><strong>Training Sessions:</strong> ${trainingSessions.join(', ')}</li>
      </ul>
      <p>We look forward to seeing you!</p>
    `
  })

  return NextResponse.json({ success: true })
}