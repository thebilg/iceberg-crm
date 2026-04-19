# Iceberg CRM Design Notes

## Kapsam

Bu repo, technical case icin hazirlanan Nuxt 3 frontend uygulamasini icerir. Backend tarafinin NestJS ve MongoDB ile ayri bir repoda gelistirilmesi varsayilmistir. Frontend, backend servisleri uzerinden transaction lifecycle ve finansal dagilimi gosteren bir operasyon paneli olarak tasarlanmistir.

## Uygulama Hedefi

Arayuzun amaci su uc alanin tek bakista yonetilebilmesidir:

- Portfoydeki evleri gormek ve yeni ilan eklemek
- Danisman listesini ve kazanc bilgisini izlemek
- Satislari asama bazli kanban uzerinden ilerletmek

## Bilgi Mimarisi

Sidebar navigasyonu uc ana bolum etrafinda kuruldu:

- `Evler`: operasyonun kaynak varligi oldugu icin tablo bazli gorunum secildi
- `Danismanlar`: kisi bazli bilgi agirlikli oldugu icin kart gorunumu secildi
- `Satislar`: surec yonetimi gerektirdigi icin kanban gorunumu secildi

Bu ayrim, ekranda kullanicinin hangi veri turuyle calistigini hemen anlamasini saglar.

## State Management

State yonetimi icin Pinia kullanildi.

`app/stores/crm.ts` icindeki store su sorumluluklari ustlenir:

- Agent, property ve transaction listelerini yuklemek
- API yanitlarini UI icin normalize etmek
- Yeni kayit olusturma aksiyonlarini yonetmek
- Satis asamasi ilerletme islerini yonetmek
- API yoksa demo veri ile fallback saglamak

Bu tercih, sayfa bazli tekrar eden veri cekme ve donusum kodunu tek noktada toplar.

## API Stratejisi

`app/composables/useApi.ts` hafif bir wrapper olarak kullanildi.

Amac:

- Ortak base URL kullanmak
- `get`, `post`, `patch` aksiyonlarini tek yerden cagirmak
- Frontend'i backend implementasyonundan fazla bagimsiz tutmak

Beklenen endpoint sozlesmesi:

- `GET /agents`
- `POST /agents`
- `GET /properties`
- `POST /properties`
- `GET /transactions`
- `POST /transactions`
- `PATCH /transactions/:id/stage`

## Gorunum Kararlari

### Sidebar

Sidebar sabit ve belirgin tutuldu. Aktif sekmenin renklenmesi, kullanicinin o anda hangi operasyon alaninda oldugunu netlestirir. Bu, kullanicinin ekranlar arasi geciste baglam kaybetmesini engeller.

### Evler

Evler sayfasinda masaustu icin tablo, mobil icin kart fallback'i kullanildi. Bunun nedeni ilan verisinin kolon bazli okunmasinin masaustunde daha verimli olmasidir.

### Danismanlar

Danisman ekraninda kart yapisi tercih edildi. Iletisim bilgisi ve gelir bilgisi kisi merkezli oldugu icin kart yapisi daha dogrudan okunur.

### Satislar

Satis ekraninda kanban secildi. Technical case'in ana problemi lifecycle yonetimi oldugu icin asama bazli gorsellestirme en uygun modeldir.

## Olusturma Deneyimi

Her ana ekranda sabit bir `+` butonu bulunur. Bu buton ekrana bagli olarak ilgili entity icin modal form acar:

- Evler ekraninda yeni ev
- Danismanlar ekraninda yeni danisman
- Satislar ekraninda yeni satis

Bu karar, kullanicinin sayfadan ayrilmadan hizli veri girebilmesini saglar.

## Stage Handling

Frontend tarafinda stage sirasini `app/composables/useStages.ts` dosyasi tanimlar:

- `agreement`
- `earnest_money`
- `title_deed`
- `completed`

Kanban kartlarinda yalnizca bir sonraki mantikli asamaya gecis onerilir. Bu sayede arayuz, gecisleri kontrollu bir siraya sokar. Gercek dogrulamanin backend tarafinda da yapilmasi beklenir.

## Finansal Gosterim

Transaction kartinda asagidaki alanlar gosterilir:

- Toplam fiyat
- Listing agent
- Selling agent
- Ajans komisyonu
- Listing agent komisyonu
- Selling agent komisyonu

Bu dagilim transaction objesi icindeki `commission` alanindan okunur. Bu, frontend'in hesap mantigini tekrar kurmasini gerektirmez ve backend'i dogru hesaplamanin tek kaynagi yapar.

## Hata ve Fallback Yaklasimi

API erisilemezse ekranin tamamen bos veya kirik acilmasi yerine demo veri ile acilmasi tercih edildi. Bu karar, arayuz gelistirme ve demo surecinde kullanisli bir fallback saglar. Uretim ortaminda backend baglantisi zorunlu tutulabilir.

## Tasarim Dili

Renk paleti lila ve mor tonlari etrafinda kuruldu. Nedenleri:

- Sidebar aktif durumunu belirginlestirmek
- Finansal dashboard duygusunu yumusatmak
- Teknik case sunumunda daha ayirt edici bir gorunum elde etmek

Arkaplanda yumusak gradyan ve blur katmanlari kullanilarak arayuze daha olgun bir panel hissi verildi.

## Dosya Organizasyonu

- `app/app.vue`: genel shell
- `app/components/layout/Sidebar.vue`: navigasyon
- `app/components/ui/Fab.vue`: sabit olusturma butonu
- `app/components/properties/Table.vue`: evler liste gorunumu
- `app/components/agents/Cards.vue`: danisman kartlari
- `app/components/sales/Kanban.vue`: kanban kolonlari
- `app/components/sales/TransactionCard.vue`: satis karti
- `app/stores/crm.ts`: merkezi state ve aksiyonlar

## Bilincli Sinirlar

Bu repo icinde su alanlar tamamlanmamis veya bilerek disarida birakilmistir:

- Gercek backend implementasyonu
- Authentication ve authorization
- Unit testler
- Deployment URL'leri

Bu alanlar backend repo ve son teslim entegrasyonu ile tamamlanabilir.