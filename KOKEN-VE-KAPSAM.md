# Köken, değişiklikler ve kapsam

Kaynak: yazarın özel demo projesi, Git HEAD `48f4b6e2067a0eee8703fdb1de4aee019663587a`. İlgili seçili kaynak dosyaları için çalışma ağacı değişikliği görülmedi; başka kaynak dosyaları değişmişti. Geçmişte Kemal adına commit bulunması tek başına telif zincirini kanıtlamaz.

## Kaynak dosyalar

- Doğrudan: `app/api/evaluate/route.ts`, `app/page.module.css`, `tsconfig.json`.
- `app/page.tsx` ve `app/layout.tsx`: demo sunumu ve metadata düzeltildi; eski istek yanıtlarını engelleyen kontrol eklendi.
- `app/globals.css`: Google Fonts uzak importu kaldırıldı.
- `lib/domain.ts`: public demo mantığı bırakıldı; protected entegrasyon şeması ve fixture kataloğu çıkarıldı.
- `package.json`: demo için gerekli kaynak bağımlılıkları seçildi; test/typecheck komutları ve Node koşulu eklendi.
- `package-lock.json`: kaynak lock içinden aday bağımlılıkları, bağımlılık ve opsiyonel/peer kenarları izlenerek elle türetildi. Windows x64 üzerinde `npm ci --ignore-scripts --no-audit --no-fund` başarılı oldu; kilit SHA-256 değişmedi. Diğer platformlar denenmedi.
- `lib/request-gate.ts` ve `tests/`: bu aday için istek yarışı kontrolü, sentetik domain ve HTTP API testleri; Windows'ta çalıştırıldı.

Entegrasyon route'ları, provider, auth, MCP, fixture kataloğu, ortam dosyaları, node_modules ve anahtarlar kopyalanmadı. Lisans envanteri ve açık eksikler `THIRD-PARTY.md` içindedir.

## Yayın durumu ve kalan kontroller

Demo kaynak deposu herkese açıktır. Uygulama kodunun hak zinciri ve lisans seçimi, bağımlılıkların özellikle ikili biçimde dağıtımı için ayrı hak ve yükümlülük incelemesi, üçüncü taraf lisans/bildirim incelemesinin kalanları ve tarayıcıda görsel kontrol bekliyor. Sentetik testler ve üretim build'i Windows'ta başarılı oldu; gerçek sağlayıcı veya ücretli API çalıştırılmadı.

Uygulama kodunun hak zinciri kesinleşmediği için KemalG-u adına herhangi bir lisans (MIT dahil) verilmedi; depo yalnızca okumak için yayımlanmıştır, tüm haklar saklıdır. Git yazar kaydı bunun için yeterli kanıt değildir. Üçüncü taraf kodu kendi lisanslarına tabidir.

No license is granted: the rights chain of the application code has not been confirmed. Third-party code remains under its own licenses.
