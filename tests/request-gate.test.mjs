import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequestGate } from '../lib/request-gate.ts'

test('sekme değişimi ve yeni istek, geciken başarı ve hatayı geçersiz kılar', async () => {
  const gate = createRequestGate()
  let finishOld, failOld
  const old = new Promise((resolve, reject) => { finishOld = resolve; failOld = reject })
  let shown = ''
  const oldId = gate.begin()
  const pending = old.then(value => { if (gate.current(oldId)) shown = value }, () => { if (gate.current(oldId)) shown = 'eski hata' })
  gate.invalidate()
  const newId = gate.begin()
  assert.equal(gate.current(newId), true)
  finishOld('eski sonuç')
  await pending
  assert.equal(shown, '')
  const errorId = gate.begin()
  const failing = Promise.reject(new Error('eski')).catch(() => { if (gate.current(errorId)) shown = 'eski hata' })
  gate.invalidate()
  await failing
  assert.equal(shown, '')
  assert.equal(gate.current(newId), false)
  assert.equal(typeof failOld, 'function')
})
