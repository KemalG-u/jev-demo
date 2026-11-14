'use client'

import { Fragment, useRef, useState } from 'react'
import styles from './page.module.css'
import { createRequestGate } from '@/lib/request-gate'
import type { Evaluation, Experiment } from '@/lib/domain'

const tabs: { id: Experiment; title: string; hint: string }[] = [
  { id: 'route', title: 'Yönlendir', hint: 'Destek kuyruğu önerisi' },
  { id: 'risk', title: 'Risk Örneği', hint: 'Sabit örnek risk değeri' },
  { id: 'priority', title: 'Önceliklendir', hint: 'Ordinal iş puanı' },
]

const examples: Record<Experiment, string> = {
  route: 'Kartımdan aynı abonelik için iki kez çekim yapılmış.',
  risk: 'Sadece mevcut ticket durumunu oku.',
  priority: 'Ödeme alma sistemi kapalı, satış yapamıyoruz; bugün çözülmeli.',
}

function BreakableToken({ value }: { value: string }) {
  return <>{value.split('_').map((part, index) => (
    <Fragment key={`${index}-${part}`}>
      {index > 0 && <>_<wbr /></>}{part}
    </Fragment>
  ))}</>
}

export default function Home() {
  const [experiment, setExperiment] = useState<Experiment>('route')
  const [input, setInput] = useState(examples.route)
  const [result, setResult] = useState<Evaluation | null>(null)
  const [status, setStatus] = useState('')

  const gate = useRef(createRequestGate()).current

  async function submit() {
    const requestId = gate.begin()
    setStatus('Hesaplanıyor…')
    setResult(null)
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ experiment, input }),
      })
      const data = await response.json()
      if (!gate.current(requestId)) return
      if (!response.ok) throw new Error(data.error)
      setResult(data)
      setStatus('')
    } catch (error) {
      if (!gate.current(requestId)) return
      setStatus(error instanceof Error ? error.message : 'Beklenmeyen hata')
    }
  }

  function select(id: Experiment) {
    gate.invalidate()
    setExperiment(id)
    setInput(examples[id])
    setResult(null)
    setStatus('')
  }

  return <main className={styles.shell}>
    <header className={styles.header}>
      <p className={styles.kicker}>JEV / KARAR LABORATUVARI <span>DEMO</span></p>
      <h1 className={styles.title}>Jev arayüzü için<br /><em>sabit kurallı örnek demo.</em></h1>
      <p className={styles.intro}>Bu arayüz gerçek uygulamadan alınmış bir demodur. Jev modeli çalışmaz; sonuçlar sabit örnek kurallardan gelir; gösterilen olasılıklar ölçülmüş değerler değildir. Hiçbir dış eylem yapılmaz.</p>
    </header>

    <section className={styles.explain} aria-label="Jev kullanım sınırı">
      <article className={styles.useCard}>
        <p className={styles.kicker}>UYGUN İŞ</p>
        <h2>Jev burada kullanılır</h2>
        <p><strong>AgencyOS örneği:</strong> Yüzlerce sentetik lead veya destek kaydını aynı ölçüte göre satış, destek ya da insan incelemesi kuyruğuna ayırmak.</p>
        <p><strong>Bu demoda:</strong> Seçim, Jev modeli yerine sabit örnek kurallarla gösterilir; gerçek vakalar veya performans değerlendirilmez.</p>
      </article>
      <article className={styles.noUseCard}>
        <p className={styles.kicker}>UYGUN OLMAYAN İŞ</p>
        <h2>Jev burada kullanılmaz</h2>
        <p>“AgencyOS’taki hatayı bul, araştır, kodu düzelt ve siteyi test et” Jev’in işi değildir.</p>
        <p><strong>Nedeni:</strong> Jev araştırma yapmaz, kod yazmaz veya bilgisayarı kullanmaz. Bunları Hermes yapar.</p>
      </article>
    </section>

    <section className={styles.panel} aria-label="Deney seçimi">
      <nav className={styles.tabs}>
        {tabs.map((tab) => <button
          key={tab.id}
          className={experiment === tab.id ? styles.active : ''}
          onClick={() => select(tab.id)}
          aria-pressed={experiment === tab.id}
        >
          <strong>{tab.title}</strong><small>{tab.hint}</small>
        </button>)}
      </nav>
      <label className={styles.fieldLabel} htmlFor="case">Örnek vaka</label>
      <p role="note" className={styles.privacy}><strong>Yalnız sentetik veri kullan.</strong> Kişisel veri, secret veya gerçek kurum bilgisi girme.</p>
      <textarea
        className={styles.caseInput}
        id="case"
        value={input}
        maxLength={4000}
        onChange={(event) => { gate.invalidate(); setResult(null); setStatus(''); setInput(event.target.value) }}
      />
      <div className={styles.actions}>
        <button
          className={styles.measure}
          onClick={submit}
          disabled={!input.trim() || status === 'Hesaplanıyor…'}
          aria-busy={status === 'Hesaplanıyor…'}
        >
          {status === 'Hesaplanıyor…' ? status : 'Örnek sonucu göster'}
        </button>
        <span>0–4.000 karakter · salt-okunur</span>
      </div>
      {status && status !== 'Hesaplanıyor…' && <p role="alert" className={styles.error}>{status} <button onClick={submit}>Tekrar dene</button></p>}
    </section>

    {result && <section className={styles.result} aria-live="polite">
      <div className={styles.resultHead}>
        <div>
          <p className={styles.kicker}>YAPILANDIRILMIŞ SONUÇ</p>
          <h2 className={styles.resultTitle}><BreakableToken value={result.decision} /></h2>
        </div>
        <span className={styles.badge}>DEMO — örnek sonuç</span>
      </div>
      <p className={styles.safe}>✓ Hiçbir eylem yapılmadı · yalnızca shadow önerisi</p>
      <div className={styles.answer}>
        <b>{String(result.answer.value)}</b>
        {result.answer.probabilities.map((item) => <div className={styles.prob} key={item.label}>
          <div><span>{item.label}</span><strong>{Math.round(item.value * 100)}%</strong></div>
          <progress max="1" value={item.value} /> <small>{item.description}</small>
        </div>)}
      </div>
      {result.reviewReasons.length > 0 && <p className={styles.review}><strong>İnsan incelemesi:</strong> {result.reviewReasons.join(', ')}</p>}
      <footer className={styles.resultFooter}>{result.metadata.model} · {result.metadata.latencyMs} ms · server-side</footer>
    </section>}
  </main>
}
