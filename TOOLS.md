# TOOLS — Kupon

Güncelleme: 2026-10-18. Bu belge çalışma düzenini tanımlar; aday araçlar henüz projeye eklenmedi.

## Mevcut mimari
- GitHub Pages'te çalışan HTML sayfası, React 18 UMD ve sayfa içi uygulama kodları.
- Haftalık sonuçlar, genel klasman, puanlar, katılım ve veri erişimi görünüm iyileştirmelerinden önceliklidir.

## Planlanan araçlar
| Araç | Durum | Kullanım | Kabul koşulu |
| --- | --- | --- | --- |
| Lucide | ADAY — kurulu değil | Sekme, kupa ve istatistik simgeleri | Mevcut ikonlar kontrollü değiştirilir; sayfa yükü ölçülür |
| Fontsource | ADAY — kurulu değil | Öz barındırılan yazı tipleri | Mevcut fontlar karşılaştırılır; gereksiz font paketi eklenmez |
| GSAP | ADAY — kurulu değil | Ödül, skor ve geçiş animasyonları | Puan hesaplarını etkilemez; reduced-motion dikkate alınır |
| Penpot | HARİCİ TASARIM ARACI | Mobil ekran ve kart taslakları | Tasarım kod ile karşılaştırılarak uygulanır |
| SVGO | GELİŞTİRME ARACI | SVG optimizasyonu | Görsel regresyon olmadan uygulanmaz |

## Öncelikler
1. Genel klasman ve haftalık ayrıntıların doğruluğu.
2. Tüm oyuncular için doğru kupa ve sonunculuk görselleri.
3. Küçük görsel iyileştirmeler (önce Lucide), sonra animasyon.
4. Gereksiz portföy/rulet özellikleri geri getirilmez.

## Değişiklik kuralları
- Önce çalışan commit'i kaydet ve ayrı branch üzerinde çalış; main üzerinde deney yapma.
- Sadece görünüm işleri puan, veri ve sıralama hesaplarına dokunmamalı.
- Harici bağımlılığın kaynak, lisans, sabit sürüm, CDN/yerel yöntemi ve geri alma yolu belgelenmeli.
- Mobil görünüm, sekmeler, haftalık ayrıntılar, kupa durumu ve ağ hataları test edilir.
- Test çalıştırılmadıysa açıkça belirtilir; PR incelemesi sonrası main'e birleştirilir.

## İlk önerilen iş
Tek bir arayüz bölümünde Lucide ikonlarını önizleme dalında dene. Tasarım tutarlılığı, yükleme ve mobil deney yeterli olursa genişlet.

## Yardımcılarla çalışma
ChatGPT ve Claude TOOLS.md ile mevcut kodu okuyarak çalışır; kullanıcının istemediği özellikleri eklemez. Değişiklik raporu: dosyalar, amaç, kontroller, geri alma.
