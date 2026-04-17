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
  const { name, email, region } = await req.json()

  // 检查名额
  const { count } = await supabase
    .from('signups')
    .select('*', { count: 'exact', head: true })
  if ((count ?? 0) >= MAX_SLOTS) {
    return NextResponse.json({ error: '报名名额已满' }, { status: 400 })
  }

  // 写入数据库
  const { error } = await supabase
    .from('signups')
    .insert({ name, email, region })
  if (error) {
    return NextResponse.json({ error: '该邮箱已报名过' }, { status: 400 })
  }

  // 发送确认邮件
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: '报名成功确认 ✅',
    html: `
      <h2>你好，${name}！</h2>
      <p>你已成功报名！</p>
      <p>报名区域：${region}</p>
      <p>感谢你的参与，我们会尽快联系你。</p>
    `
  })

  return NextResponse.json({ success: true })
}