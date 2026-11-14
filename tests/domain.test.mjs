import test from 'node:test'
import assert from 'node:assert/strict'
import { demoEvaluation, requestSchema } from '../lib/domain.ts'

test('istek doğrulama: geçerli, sınır ve geçersiz sentetik girdiler', () => {
  assert.equal(requestSchema.parse({ experiment: 'route', input: '  fatura  ' }).input, 'fatura')
  for (const experiment of ['route', 'risk', 'priority']) assert.equal(requestSchema.safeParse({ experiment, input: 'a'.repeat(4000) }).success, true)
  for (const value of [
    { experiment: 'unknown', input: 'test' }, { experiment: 'risk', input: '  ' },
    { experiment: 'route', input: 'a'.repeat(4001) }, { experiment: 'route', input: 7 }, {}, null,
  ]) assert.equal(requestSchema.safeParse(value).success, false)
})

test('yönlendirme: tek, belirsiz, eşleşmeyen ve birden çok kuyruk', () => {
  assert.equal(demoEvaluation('route', 'FATURA').answer.value, 'billing')
  for (const input of ['sanırım fatura', 'merhaba', 'fatura ve şifre']) {
    const result = demoEvaluation('route', input)
    assert.equal(result.answer.value, 'human_review')
    assert.equal(result.decision, 'HUMAN_REVIEW')
  }
})

test('risk ve öncelik: sentetik pozitif/negatif', () => {
  assert.equal(demoEvaluation('risk', 'dosyayı sil').decision, 'SHADOW_BLOCK')
  assert.equal(demoEvaluation('risk', 'durumu oku').decision, 'SHADOW_ALLOW')
  assert.equal(demoEvaluation('priority', 'sistem kapalı').decision, 'HUMAN_REVIEW')
  assert.equal(demoEvaluation('priority', 'bilgi notu').decision, 'SHADOW_ALLOW')
  for (const experiment of ['route', 'risk', 'priority']) {
    const result = demoEvaluation(experiment, 'sentetik örnek')
    assert.equal(result.mode, 'DEMO')
    assert.equal(result.metadata.model, 'demo-deterministic')
    assert.ok(Math.abs(result.answer.probabilities.reduce((s, item) => s + item.value, 0) - 1) < 1e-10)
  }
})
