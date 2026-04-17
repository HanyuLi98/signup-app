import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY!)
const MAX_SLOTS = 10

export async function GET() {
  const { count } = await supabase
    .from('signups')
    .select('*', { count: 'exact', head: true })
  return NextResponse.json({ count: count ?? 0, max: MAX_SLOTS })
}

export async function POST(req: Request) {
  const { companyName, countryRegion, name, jobTitle, jobResponsibilities, trainingSessions, email, telephone } = await req.json()

  // 检查名额
  const { count } = await supabase
    .from('signups')
    .select('*', { count: 'exact', head: true })
  if ((count ?? 0) >= MAX_SLOTS) {
    return NextResponse.json({ error: 'Registration is full' }, { status: 400 })
  }

  // 写入数据库
  const { error } = await supabase
    .from('signups')
    .insert({
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
    return NextResponse.json({ error: 'This email has already been registered' }, { status: 400 })
  }

  // 发送确认邮件
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Registration Confirmed ✅',
    html: `
      <h2>Hello, ${name}!</h2>
      <p>Your registration has been confirmed. Here are your details:</p>
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