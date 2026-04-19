# Iceberg CRM Frontend

Nuxt 3 tabanli bu repo, gayrimenkul satis surecini gorsellestiren CRM arayuzunu icerir. Uygulama; evleri liste gorunumunde, danismanlari kart gorunumunde ve satislari kanban gorunumunde yonetir.

Bu repo sadece frontend uygulamasidir. Backend NestJS ve MongoDB servisi ayri bir repoda veya ayri bir calisma dizininde tutulabilir.

## Ozellikler

- Solda sabit sidebar ile evler, danismanlar ve satislar ekranlari
- Aktif sekme vurgusu
- Evler icin tablo ve mobil kart gorunumu
- Danismanlar icin kart gorunumu
- Satislar icin asama bazli kanban panosu
- Her ekranda sabit `+` butonu ile yeni kayit olusturma
- API erisilemezse demo veri ile arayuzun calismaya devam etmesi

## Teknolojiler

- Nuxt 3
- Vue 3
- Pinia
- Tailwind CSS 4
- Nuxt UI

## Gereksinimler

- Node.js LTS
- npm veya pnpm

## Kurulum

```bash
npm install
```

Alternatif olarak:

```bash
pnpm install
```

## Gelistirme

Varsayilan olarak frontend, backend API'sini `http://localhost:8080` adresinde bekler.

Gelistirme sunucusunu baslatin:

```bash
npm run dev
```

Farkli bir API adresi kullanmak icin ortam degiskeni tanimlayin:

```bash
NUXT_PUBLIC_API_BASE=http://localhost:8080
```

## Komutlar

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run typecheck
```

## Beklenen Backend Endpointleri

Frontend su endpointlerle haberlesir:

- `GET /agents`
- `POST /agents`
- `GET /properties`
- `POST /properties`
- `GET /transactions`
- `POST /transactions`
- `PATCH /transactions/:id/stage`

## Sayfa Yapisi

- `/properties`: Evlerin liste ekrani
- `/agents`: Danisman kartlari
- `/sales`: Kanban satis panosu
- `/`: Otomatik olarak `/properties` sayfasina yonlenir

## Notlar

- Backend bu repoda degildir.
- API kapaliysa veya erisilemezse uygulama demo veri ile acilir.
- Tasarim kararlarinin ayrintisi icin `DESIGN.md` dosyasina bakin.
