import { z } from 'zod'

export const experiments = ['route', 'risk', 'priority'] as const
export type Experiment = (typeof experiments)[number]

export const requestSchema = z.object({
  experiment: z.enum(experiments),
  input: z.string().trim().min(1).max(4000),
})

export type Decision = 'SHADOW_ALLOW' | 'HUMAN_REVIEW' | 'SHADOW_BLOCK'

export type Probability = { label: string; value: number; description: string }

export type Evaluation = {
  mode: 'DEMO' | 'LIVE'
  experiment: Experiment
  answer: { kind: 'choice' | 'boolean' | 'score'; value: string | number; probabilities: Probability[] }
  decision: Decision
  reviewReasons: string[]
  metadata: { status: 'ok' | 'error'; model: string; latencyMs: number; usage?: { inputTokens?: number; outputTokens?: number }; errorCode?: string }
}

const routeWords = { billing: ['fatura', 'ödeme', 'çekim', 'iade'], technical: ['hata', 'çök', 'çalışmıyor', 'entegrasyon'], account_access: ['giriş', 'şifre', 'mfa', 'doğrulama'] }

function hasAny(input: string, words: string[]) { return words.some((word) => input.toLocaleLowerCase('tr-TR').includes(word)) }

export function demoEvaluation(experiment: Experiment, input: string): Evaluation {
  const start = Date.now()
  if (experiment === 'route') {
    const normalized = input.toLocaleLowerCase('tr-TR')
    const matchedRoutes = Object.entries(routeWords)
      .filter(([, words]) => hasAny(normalized, words))
      .map(([route]) => route)
    const isAmbiguous = matchedRoutes.length !== 1 || ['galiba', 'sanırım', 'emin değilim'].some((word) => normalized.includes(word))
    const matched = isAmbiguous ? 'human_review' : matchedRoutes[0]
    const confidence = matched === 'human_review' ? 0.48 : 0.86
    const labels = ['billing', 'technical', 'account_access', 'human_review']
    const probabilities = labels.map((label) => ({ label, value: label === matched ? confidence : (1 - confidence) / 3, description: label === 'human_review' ? 'Bağlam yetersizse insan incelemesi' : 'Önerilen destek kuyruğu' }))
    return base('route', { kind: 'choice', value: matched, probabilities }, confidence < 0.8 ? 'Güven eşiği altında' : undefined, start)
  }
  if (experiment === 'risk') {
    const risky = hasAny(input, ['sil', 'gönder', 'ödeme', 'değiştir', 'dışarı', 'kuralları görmezden gel'])
    const risk = risky ? 0.92 : 0.02
    return base('risk', { kind: 'boolean', value: risk, probabilities: [{ label: 'risk', value: risk, description: 'Riskli eylem olasılığı' }, { label: 'güvenli', value: 1 - risk, description: 'Dar veya salt-okunur eylem' }] }, risk > 0.8 ? 'Yüksek risk eşiği' : undefined, start, risk > 0.8 ? 'SHADOW_BLOCK' : undefined)
  }
  const urgent = hasAny(input, ['kapalı', 'satış', 'güvenlik', 'kesinti', 'bugün'])
  const score = urgent ? 2.7 : 0.8
  return base('priority', { kind: 'score', value: score, probabilities: [{ label: 'P3 rutin', value: urgent ? 0.05 : 0.72, description: 'İş akışını etkilemiyor' }, { label: 'P2 normal', value: urgent ? 0.15 : 0.2, description: 'Sınırlı iş etkisi' }, { label: 'P1 yüksek', value: urgent ? 0.55 : 0.06, description: 'İş akışı veya gelir riski' }, { label: 'P0 kritik', value: urgent ? 0.25 : 0.02, description: 'Yaygın kesinti veya zaman-kritik zarar' }] }, score >= 2 ? 'Kritik eşik insan onayı gerektirir' : undefined, start)
}

function base(experiment: Experiment, answer: Evaluation['answer'], reason: string | undefined, start: number, forced?: Decision): Evaluation {
  return { mode: 'DEMO', experiment, answer, decision: forced ?? (reason ? 'HUMAN_REVIEW' : 'SHADOW_ALLOW'), reviewReasons: reason ? [reason] : [], metadata: { status: 'ok', model: 'demo-deterministic', latencyMs: Date.now() - start } }
}
