# METO–LORT V7 — canlı öncesi emniyet kapısı

Canlı Kupon’un mevcut ödül sistemine dokunulmadı. Bu klasörde bulunan `ceremony-gate.js`, birinci METO / sonuncu LORT için **tek kazanan ve tek kaybeden** olduğu durumda, yalnızca önceden doğrulanmış sabit MP4 yolunu döndürür. Eşitlik veya farklı oyuncu sonucu varsa hiçbir video önermez. Videoyu otomatik oynatmaz; hiçbir canlı sayfaya henüz bağlanmadı.

Onaylı görsel/ses kaynak SHA kimlikleri Motion Engine [V7-LOCK.json](https://github.com/metoapps/motion-engine/blob/feature/kupon-ceremony-pilot/integrations/kupon/v3-template/V7-LOCK.json) ile eşleşiyor.

## Canlıya alma ön şartları
1. V7 MP4 dosyasını gerçekten `assets/ceremony/meto-lort-v7.mp4` yoluna **binary olarak** yükle.
2. Bu dosyayı GitHub Pages'de HTTP 200 / `video/mp4` ile doğrula. Yayınlanan içeriğin hash'ini kontrol et.
3. Önce Kupon ana uygulamasına, haftalık sonuçlar kesinleşince ve yalnızca METO–LORT eşleşmesinde, kullanıcı onayıyla oynatma düğmesi ekle. Eşitlikler ve henüz tamamlanmamış haftalar için gösterme.
4. Mobil tarayıcıda video ve müziğin kullanıcı dokunuşuyla başladığını, kontrolü kapatınca durduğunu, mevcut puanların değişmediğini test et.

**Şu anda eksik:** MP4'ün GitHub Pages'e yüklenmesi ve gerçek telefon smoke testi. Bu ön şartlar sağlanmadan mevcut taslak PR birleştirilmeyecek. Başka oyuncu kombinasyonlarında kullanılacak posterler/MP4'ler ayrıca onaylanmalı.

Test: `node tools/ceremony-motion/ceremony-gate.test.cjs`.
