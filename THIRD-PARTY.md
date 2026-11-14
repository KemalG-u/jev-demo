# Üçüncü taraf hakları ve inceleme durumu

`package-lock.json` kaynak lock v3'ten adayın bağımlılıkları, transitif ve platforma özgü opsiyonelleriyle türetildi. Windows x64'te `npm ci --ignore-scripts --no-audit --no-fund` başarılı oldu ve kilit değişmedi. Tam 61 paket yolu ve kaynak lock lisans beyanları `third-party/BAGIMLILIK-ENVANTERI.md` içindedir. 61 kaydın npm sürüm metaverisindeki lisans ve SHA-512 beyanı kilitle eşleşti: `third-party/NPM-KAYIT-KONTROLU.md`. Metaveri tek başına arşiv baytlarını, lisans uyumunu veya dağıtım hakkını kanıtlamaz.

Yerel kurulu paketlerin kök lisans/bildirimleri ve Next'in `dist/compiled` altındaki bulunan lisans/bildirim dosyaları, özgün yol ve özgün bayt SHA-256 bilgisiyle `third-party/YEREL-BILDIRIMLER.txt` dosyasında birleştirildi (metin olarak, paket kodu değil). Bu koleksiyon TypeScript ThirdPartyNoticeText ve tslib CopyrightNotice içerir. Daha önce alınmış doğrudan lisans dosyaları da `third-party/` altındadır. Paketlerin başka yerlerdeki veya derlenmiş içeriklerdeki tüm bildirimlerinin tespit edildiği iddia edilmez.

## Kaynak yayını ve ikili dağıtımı ayrı kapılardır

Aday kaynak kodunun yayımlanabilmesi, kurulu paketlerin veya platforma özgü ikililerin yeniden dağıtım haklarının otomatik olarak çözüldüğü anlamına gelmez. Her dağıtım biçiminde ilgili lisanslar ve bildirimler ayrıca incelenmelidir.

## Açık hak ve dağıtım kapıları

- Yerelde kurulu olmayan 33 paketin kilitli sürüm lisans ve bütünlük **metaverileri** npm kayıtlarıyla karşılaştırıldı; arşivleri ve içerikleri incelenmedi. `@next/env` ve `client-only` arşivlerinin SHA-512'si kilitle eşleşti; lisans/bildirim adlı dosya bulunmadı. Kurulu `@next/swc-win32-x64-msvc` kökünde lisans dosyası yok; arşivi ayrıca incelenmedi. Zod'un kurulu lisansı adayın kopyasıyla hash olarak eşleşti.
- `@next/env@16.3.5` [özgün paket manifesti](https://github.com/vercel/next.js/blob/v16.3.5/packages/next-env/package.json), Next.js Team yazarı ve MIT beyanını içeriyor; aynı sürümün [depo kök lisansı](https://github.com/vercel/next.js/blob/v16.3.5/license.md) Vercel telifini taşıyor ve metin `third-party/next-LICENSE.txt` içinde korunuyor. Derlenmiş bağımlılıkların ek bildirimleri ayrıca kontrol edilmeli.
- Kurulu `@next/swc-win32-x64-msvc@16.3.5` manifesti Next.js deposuna ve MIT'ye işaret ediyor; yukarıdaki sürüm sabitli kök lisans ilgili kaynak kanıtıdır. Ancak yerel ikilinin içerdiği üçüncü taraf bileşenler ve bildirimler bu eşleştirmeyle kanıtlanmış değildir.
- `client-only@0.0.1` manifesti MIT beyan ediyor; özgün telif sahibi ve lisans bildirimi arşivde tespit edilmedi. React bağlantısı tek başına telif sahibini kanıtlamaz; atıf uydurulmadı ve bu kapı açık.
- Sharp/libvips seçeneklerinde LGPL-3.0-or-later ve birleşik Apache/LGPL/MIT beyanları, ayrıca CC-BY-4.0 ve başka lisanslar bulunur. Özellikle ikili dağıtım yapılacaksa kaynak, değiştirme/yeniden bağlama ve ilgili bildirim koşulları somut dağıtım biçimine göre incelenmelidir; bu metin hukuki uyumluluk sertifikası değildir.
- Next derlenmiş bağımlılıkları ve tüm ek NOTICE/kaynak yükümlülükleri ayrıca gözden geçirilmeli. Diğer platformlarda kurulum ağacı ve tedarik zinciri güvenliği izinli ortamda doğrulanmalı.
- Kemal kendi kodunun açılmasına izin verdi; uygulamanın açık kaynak lisansı seçilmedi ve Git yazar adı tüm içerik hak zincirini kanıtlamaz. Bu kapılar, bağımsız inceleme ve yayın yetkisi olmadan klasör yayınlanmamalıdır.

Google Fonts uzak importu kaldırıldı; font dosyası dağıtılmıyor. Ürün adları tanımlama amaçlıdır; marka izni anlamına gelmez.
