// Ayrı bir terminalde yalnız bu adayın yerel Next sunucusu başlatıldıktan sonra çalıştırın.
import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { once } from 'node:events'

const base = 'http://127.0.0.1:3000'
async function post(body) {
  return fetch(`${base}/api/evaluate`, { method: 'POST', redirect: 'error', headers: { 'content-type': 'application/json' }, body })
}

test('API: üç deneyin sentetik pozitif ve negatif durumları', async () => {
  for (const [experiment, input, value, decision] of [
    ['route', 'fatura', 'billing', 'SHADOW_ALLOW'],
    ['route', 'fatura ve şifre', 'human_review', 'HUMAN_REVIEW'],
    ['risk', 'dosyayı sil', 0.92, 'SHADOW_BLOCK'],
    ['risk', 'durumu oku', 0.02, 'SHADOW_ALLOW'],
    ['priority', 'sistem kapalı', 2.7, 'HUMAN_REVIEW'],
    ['priority', 'bilgi notu', 0.8, 'SHADOW_ALLOW'],
  ]) {
    const response = await post(JSON.stringify({ experiment, input }))
    assert.equal(response.status, 200)
    assert.match(response.headers.get('cache-control'), /no-store/)
    const result = await response.json()
    assert.equal(result.mode, 'DEMO')
    assert.equal(result.experiment, experiment)
    assert.equal(result.answer.value, value)
    assert.equal(result.decision, decision)
    assert.equal(result.metadata.model, 'demo-deterministic')
  }
})

test('API: bozuk JSON ve geçersiz istekler 400', async () => {
  for (const body of ['{', '{}', JSON.stringify({ experiment: 'unknown', input: 'x' }), JSON.stringify({ experiment: 'risk', input: ' ' }), JSON.stringify({ experiment: 'route', input: 'a'.repeat(4001) })]) {
    const response = await post(body)
    assert.equal(response.status, 400)
    assert.equal(typeof (await response.json()).error, 'string')
  }
})


test('HTTP yönlendirmesi takip edilmez', async () => {
  let reached = false
  const server = createServer((req, res) => {
    if (req.url === '/redirect') { res.writeHead(302, { location: '/target' }); res.end() }
    else { reached = true; res.end('unexpected') }
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  try {
    await assert.rejects(fetch(`http://127.0.0.1:${server.address().port}/redirect`, { redirect: 'error' }))
    assert.equal(reached, false)
  } finally { await new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve())) }
})
