## Renart Ürün Listeleme Uygulaması

API Kısa Özet
- GET `/api/products`
  - Sorgu parametreleri (opsiyonel):
    - `minPrice`, `maxPrice`: USD cinsinden toplam fiyat aralığı
    - `minPopularity`, `maxPopularity`: 0–1 arası popülerlik skoru aralığı
  - Yanıt: Hesaplanmış `price`, `starRating` ve `goldPrice` ile ürün listesi. `count` ve uygulanan `filters` alanları içerir.
- GET `/api/products/:id`
  - Tek ürün (hesaplanmış alanlarla)
- GET `/api/gold-price`
  - Güncel altın fiyatı (USD/gram)

Örnek filtreleme
- Fiyat aralığı: `GET /api/products?minPrice=500&maxPrice=1500`
- Popülerlik aralığı: `GET /api/products?minPopularity=0.7&maxPopularity=0.95`
- Kombine kullanım: `GET /api/products?minPrice=800&maxPopularity=0.9`

Node.js/Express backend ve React + TypeScript frontend’den oluşan tam yığın bir uygulama. Ürün fiyatları, gerçek zamanlı altın fiyatına göre dinamik hesaplanır.

### Özellikler
- JSON verisinden ürünleri sunan REST API
- GoldAPI ile gerçek zamanlı altın fiyatı
- Dinamik fiyat: (popularityScore + 1) × weight × goldPrice
- Fiyat ve popülerliğe göre filtreleme (backend’de)
- Renk seçici ve yıldızlı puanlamaya sahip responsive arayüz

### Teknolojiler
- Backend: Node.js, Express, Axios
- Frontend: React, TypeScript, Swiper

## Kurulum

### 1) Önkoşullar
- Node.js 18+
- npm

### 2) Ortam değişkenleri (server)
`.env` dosyasını `server/` klasörü içinde oluşturun:
```bash
GOLDAPI_KEY=your-goldapi-key-here
```
Not: Gizli anahtarlar backend’te kullanıldığı için `.env` dosyasının `server/` altında olması daha güvenli ve doğrudur. Frontend bu anahtara ihtiyaç duymaz.

### 3) Bağımlılıkların kurulumu
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

## Geliştirme
İki ayrı terminalde çalıştırın:
```bash
# Terminal 1 - backend (port 5000)
cd server
npm run dev   # veya: npm start

# Terminal 2 - frontend (port 3000)
cd client
npm start
```
Client geliştirme ortamında `http://localhost:5000` adresine proxy ayarlı olduğu için API istekleri ekstra ayar istemez.

## Prodüksiyon
```bash
# Frontend’i derleyin
cd client
npm run build
# Oluşan build’i statik bir sunucuda barındırabilir veya backend ile entegre edebilirsiniz
```

## API
 - GET `/api/products`
   - Sorgu parametreleri: `minPrice`, `maxPrice`, `minPopularity`, `maxPopularity`
   - Yanıt: Hesaplanmış `price`, `starRating`, USD/gram cinsinden `goldPrice`, `count`, `filters`

 - GET `/api/products/:id`
   - Tek ürün (hesaplanmış alanlarla)

 - GET `/api/gold-price`
   - USD cinsinden gram başına güncel altın fiyatı

## Fiyat formülü
- Price = (popularityScore + 1) × weight × goldPrice
- `goldPrice` USD/gram (24k) baz alınır. GoldAPI yalnızca ons fiyatı dönerse gram’a dönüştürülür.

## Proje yapısı
```
Renart Case/
  client/
    package.json
    src/
      App.tsx
      App.css
      components/
      types.ts
    public/
      index.html
      favicon.ico
  server/
    package.json
    index.js
    data/
      products.json
  README.md
```

## Notlar
- Kullanılan GoldAPI uç noktası: `https://www.goldapi.io/api/XAU/USD` (header: `x-access-token: <GOLDAPI_KEY>`)
- GoldAPI anlık olarak erişilemezse, uygulama kullanılabilir kalsın diye backend güvenli bir varsayılan gram fiyatına düşer.
- `.env` dosyasını sürüm kontrolüne eklemeyin. İsterseniz `server/.env.example` oluşturup anahtar adlarını paylaşabilirsiniz.

## Komutlar
```bash
# Backend
npm run dev     # nodemon index.js
npm start       # node index.js

# Frontend
npm start       # react-scripts start
npm run build   # react-scripts build
```
