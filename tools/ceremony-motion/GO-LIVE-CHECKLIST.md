# Kupon — 20 kombinasyon canlı yayın kontrol listesi

Durum: **CANLI DEĞİL.** Kupon main dalına veya GitHub Pages yayınına değişiklik yapılmadı.

Geliştirme dalında `ceremony-gate.js` artık METO, LORT, FERO, LATTE ve JOSH arasında 20 farklı yönlü eşleşmeyi destekler. Sadece kesinleşmiş sonuçta, tek şampiyon ve tek sonuncu varsa video seçer; beraberlikte veya eksik sonuçta video açmaz. Otomatik oynatma yoktur. Mevcut puanlama sistemi değiştirilmedi.

Kaynak paket: `KUPON-20-LATTE-GUNCEL-VIDEO-MUZIK.zip`. Paket içinde `videos/AD1-AD2.mp4`, `music/AD1-AD2.wav`, `covers/AD1-AD2.jpg` ve manifest bulunur. 20 videonun SHA-256 değeri manifest ile doğrulandı. LATTE güncel fotoğrafları kullanıldı.

## Yayın için zorunlu adımlar

1. ZIP'teki 20 MP4 dosyasını `assets/ceremony/videos/` altına binary olarak aktar. GitHub bağlantısındaki mevcut içerik yazma aracı sadece UTF-8 metin kabul ettiğinden bu adım henüz tamamlanamadı.
2. GitHub Pages'te 20 URL'nin tamamının HTTP 200 ve video/mp4 ile sunulduğunu doğrula; gerçek MP4 hash'lerini manifest ile karşılaştır.
3. `index.html` haftalık ödül ekranına kullanıcı tıklamasıyla açılan, müzikli bir video modalı bağla. `choose(award, finalized)` yalnızca haftanın tüm maçları ve puanları kesinleşince `finalized=true` almalıdır. `haftaOdulSahnesi` tek başına kesinleşme kanıtı değildir.
4. iOS Safari ve Android Chrome üzerinde 20 videodan örneklem, ses ve kapatma testi yap; puanlar, genel klasman ve Düdükpayı bağlantısı değişmemeli.
5. Tüm kontroller PASS olursa PR birleştir ve canlı GitHub Pages URL'sini tekrar kontrol et.

**Uyarı:** MP4 dosyaları ve modal entegrasyonu eksikken PR'ı birleştirme; aksi takdirde bozuk bağlantılar gösterilir.

Yerel test: `node tools/ceremony-motion/ceremony-gate.test.cjs`.
