import { NextResponse } from 'next/server'
import { demoEvaluation, requestSchema } from '@/lib/domain'

export async function POST(request: Request) {
  try {
    const parsed = requestSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ error: 'Geçersiz deney veya girdi.' }, { status: 400 })
    return NextResponse.json(
      demoEvaluation(parsed.data.experiment, parsed.data.input),
      { headers: { 'cache-control': 'no-store' } },
    )
  } catch {
    return NextResponse.json({ error: 'İstek işlenemedi.' }, { status: 400 })
  }
}
