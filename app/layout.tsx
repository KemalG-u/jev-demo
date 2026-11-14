import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = { title: 'Jev — sabit kurallı örnek demo', description: 'Jev modeli kullanmayan, sabit kurallarla çalışan örnek arayüz.' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="tr"><body>{children}</body></html> }
