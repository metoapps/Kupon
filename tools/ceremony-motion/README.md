# Kupon × motion-engine — deneysel entegrasyon

Bu klasör Kupon'un haftalık birinci/sonuncu sinematik posterlerini **kısa videoya dönüştürmek** için hazırlanmış güvenli bir pilot alanıdır.

**Durum:** Motion-engine kütüphanesi Kupon'a kopyalanmadı; canlı puan hesaplaması, web sayfası ve tören akışı değiştirilmedi. İlk aşama yerel bir posterden dikey MP4 üretme deneyidir. Üretim için Node.js 22+, FFmpeg, Chromium ve [oguzhankayan/motion-engine](https://github.com/oguzhankayan/motion-engine) gereklidir.

## Başlatma

1. GitHub'da [motion-engine'i kendi hesabına fork et](https://github.com/oguzhankayan/motion-engine/fork). Böylece başka projelerinde de `metoapps/motion-engine` deposunu kullanabilirsin. **Fork işlemi henüz yapılmadı.**
2. Fork'u bilgisayarına klonla ve README'deki bağımlılıkları kur.
3. Kupon deposunu klonla; bu klasördeki `make-pilot.mjs` dosyasını çalıştır:

```bash
node tools/ceremony-motion/make-pilot.mjs \
  --engine ../motion-engine \
  --poster /absolute/path/to/meto-lort.png \
  --out /absolute/path/to/kupon-video-pilot
```

Komut motion-engine'in **ücretsiz yerel demo** üretimini, verilen posteri görsel medya olarak kullanarak çağırır. Kendi AI üretim servisini çağırmaz. Tamamen özelleştirilmiş kupa/konteynır anonsları sonraki aşamadır. Çıktı klasöründe `film.mp4` ve QA raporu aranmalıdır. Dosyalar üretilmeden video hazır kabul edilmez.

## Güvenlik ve koruma

- Posterlerin isimleri, yüzleri ve etiketleri ayrıca görsel denetimden geçmeli. Eşleşme yanlışsa video **üretilmemeli**.
- Haftanın birincisi ve sonuncusu kesinleşmeden tören yayınlanmamalı; puan eşitliğinde özel kural gereklidir.
- AI servis anahtarlarını, `.env` veya `*.state.json` dosyalarını asla Kupon deposuna koyma.
- Canlı uygulamaya birleşme (merge), poster eşleşmeleri ve video çıktıları doğrulandıktan sonra ayrıca değerlendirilmeli.
- Orijinal motion-engine lisansı MIT'dir; fork'ta telif/lisans bildirimlerini koru.
