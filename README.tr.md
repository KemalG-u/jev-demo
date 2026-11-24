> 🚧 **Durum: aktif geliştirme.** Yazarın kullanımında çalışır; arayüzler değişebilir.

# jev-demo

[English](README.md)

**Jev üçüncü taraf bir üründür. Bu depo bağımsız bir arayüz demosudur; Jev veya yapımcılarıyla bağlantısı, onayı ya da sponsorluğu yoktur.** Ad yalnız ekranın neyi taklit ettiğini söylemek için kullanılır.

Yazarın kendi demo uygulamasının Next.js arayüzü, public route'u ve seçilmiş demo mantığıdır; yeniden tasarlanmış sahte bir ürün değildir. **Jev modeli veya başka bir sağlayıcı çalışmaz.** Sonuçlar sabit örnek kuralların çıktısıdır; yüzdeler ölçülmüş olasılık, kararlar işlem yetkisi değildir. Yalnız sentetik veri girin. Kişisel veri, gerçek kurum bilgisi veya gizli bilgi girmeyin. Korumalı entegrasyon ve API anahtarları yoktur.

**Yerel testler genel bir güvence değildir.** Windows adayında typecheck, domain testleri, üretim build'i ve yerel sunucuyla sentetik API testleri geçti. Tarayıcıda görsel kabul ve hak/lisans incelemesinin kalanı bekliyor. `KOKEN-VE-KAPSAM.md` ve `THIRD-PARTY.md` sınırları açıklar.

## Yerelde çalıştırma

Node.js 22.18 veya üstü gerekir (testler Node'un yerleşik TypeScript desteğini kullanır; Node 24 önerilir). Depo klasöründe:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run dev
```

Tarayıcıda `http://127.0.0.1:3000` açılır. Kurulum ağdan paket indirir; `--ignore-scripts` kurulum betiklerini engeller, paket kodunun güvenli olduğunu kanıtlamaz. Windows x64 üzerinde Node 24.16.0 ve npm 11.13.0 ile kilit değiştirilmeden kurulum yapıldı. Üretim build'i ve `next start` ile yerel HTTP denemesi başarılı oldu.

## API sözleşmesi

`POST /api/evaluate`, JSON nesnesi bekler: `experiment` yalnız `route`, `risk`, `priority`; `input` kırpıldıktan sonra boş olmayan ve en çok 4000 UTF-16 kod birimi olan metindir. Diğer nesne alanları Zod'un mevcut davranışıyla yok sayılır. Hatalı JSON veya doğrulama hatası HTTP 400 ve `{"error":"..."}` döndürür; hata mesajı iki duruma göre değişir.

Örnek sentetik istek:

```json
{"experiment":"route","input":"fatura"}
```

Başarılı HTTP 200 yanıtında `mode: "DEMO"`, `experiment`, `answer` (`kind`, `value`, `probabilities` dizisi: `label`, `value`, `description`), `decision`, `reviewReasons` ve `metadata` (`status`, `model`, `latencyMs`) bulunur. Başarılı yanıtta `cache-control: no-store` gönderilir. Örnekte `answer.value` `billing`, `decision` `SHADOW_ALLOW` olur. `latencyMs` zamana bağlıdır; karar/örnek değerler kurallara bağlıdır. Yanıt güvenlik güvencesi değildir.

## Test kapısı

Windows x64, Node 24.16.0 ve npm 11.13.0 ile `typecheck` geçti, domain ve istek yarışı testlerinde 4/4 geçti ve `build` başarılı oldu. Üretim sunucusu yalnız `127.0.0.1:3000` üzerinde açıldı; ana sayfa HTTP 200, sentetik API ve yönlendirme testleri 3/3 başarılı. Sunucu test sonunda kapatıldı. Bunlar tarayıcıda görsel kabulün veya güvenlik taramasının yerine geçmez.

Tekrarlamak için:

```sh
npm run typecheck
npm run test:domain
npm run build
```

API testi için bu adaya ait sunucuyu `npm run dev` ile ayrı terminalde 127.0.0.1:3000 üzerinde başlatın, sonra `npm run test:api` çalıştırın; test yönlendirmeleri izlemez. Önce portun başka uygulamaya ait olmadığını doğrulayın. Test sonrası yalnız kendi başlattığınız sunucuyu kapatın. Bunlar tarayıcı/görsel kabulün veya güvenlik taramasının yerine geçmez.

## Kaynak ve bağımlılık dağıtımı

Bu adayın kaynak olarak yayımlanması ile kurulu paketlerin veya ikili dosyaların dağıtımı farklı izin ve yükümlülükler doğurur. Uygulama kodunun hak zinciri kesinleşmediği için lisans verilmedi. Özellikle ikili dağıtımı ve kurulmayan opsiyonel paketler için `THIRD-PARTY.md` içindeki açık kontroller tamamlanmadan hakların çözüldüğü söylenemez.

## Lisans

Lisans verilmemiştir. Uygulama kodunun hak zinciri kesinleşmediği için bu depo yalnızca okumak üzere yayımlanmıştır; tüm haklar saklıdır. Üçüncü taraf paketler kendi lisanslarını korur (bkz. `THIRD-PARTY.md`).

## Güvenlik

Güvenlik sorunlarını özel olarak bildirin: `SECURITY.md`.
