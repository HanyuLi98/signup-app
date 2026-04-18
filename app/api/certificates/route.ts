import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const PASSWORD = 'DOBOTEMEA'

export async function POST(req: Request) {
  const { password, month, session } = await req.json()

  if (password !== PASSWORD) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
  }

  // 列出该场次的所有证书
  const path = `${month}/${session}`
  const { data, error } = await supabase.storage
    .from('certificates')
    .list(path)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 为每个文件生成临时下载链接（1小时有效）
  const files = await Promise.all(
    (data ?? []).filter(f => f.name.endsWith('.pdf')).map(async f => {
      const { data: urlData } = await supabase.storage
        .from('certificates')
        .createSignedUrl(`${path}/${f.name}`, 3600)
      return {
        name: f.name.replace('.pdf', '').replace(/_/g, ' '),
        url: urlData?.signedUrl ?? ''
      }
    })
  )

  return NextResponse.json({ files })
}