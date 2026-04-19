# 🏛️ Quảng Trị Travel Guide
**Thiết kế & Phát triển bởi: Lê Thị Hoài Linh**

Website Single-Page du lịch Quảng Trị — *Bản Hùng Ca Của Đất Và Lửa*

---

## 🚀 Cài đặt & Chạy

```bash
# 1. Cài dependencies
npm install

# 2. Chạy dev server
npm run dev

# 3. Build production
npm run build

# 4. Deploy Vercel
vercel --prod
```

---

## 📦 Tech Stack
- **React 18** + **Vite** — Framework & build tool
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Animations & interactions
- **Lucide React** — Icons

---

## 📁 Cấu trúc file

```
QuangTriGuide/
├── App.jsx          ← Toàn bộ logic & UI chính (đọc file này)
├── main.jsx         ← Entry point
├── index.html       ← HTML template
├── index.css        ← Global styles + Tailwind
├── package.json     ← Dependencies
├── vite.config.js   ← Vite config
├── tailwind.config.js
└── postcss.config.js
```

---

## ✏️ Cách chỉnh sửa nội dung

Toàn bộ nội dung nằm trong `TRAVEL_DATA` object ở đầu file `App.jsx`:

```js
const TRAVEL_DATA = {
  locations: [...],   // Chỉnh địa điểm
  food: [...],        // Chỉnh món ăn
  itinerary: [...],   // Chỉnh lịch trình
  budget: [...],      // Chỉnh chi phí
  videoEmbedId: "...", // Thay ID video YouTube
  mapEmbedUrl: "...", // Thay URL Google Maps
}
```

---

## 🌟 Tính năng

- ✅ **Hero** với Animated Mesh Gradient
- ✅ **Custom Cursor** với hover reaction
- ✅ **Glassmorphism Navbar** thay đổi khi scroll
- ✅ **Reveal on Scroll** với Framer Motion
- ✅ **Hover Parallax** trên Location Cards
- ✅ **Ambient Music Player** với waveform visualizer
- ✅ **YouTube Video** embed cinematic
- ✅ **Google Maps** embed
- ✅ **Responsive** + Mobile hamburger menu
- ✅ **Text Gradient** tiêu đề
- ✅ **Data-driven** — mọi nội dung trong TRAVEL_DATA

---

## 🚢 Deploy Vercel

```bash
npm i -g vercel
vercel --prod
```

Hoặc kết nối GitHub repo với Vercel dashboard.

---

*© 2025 Quảng Trị Travel Guide — Made with ♥ by Lê Thị Hoài Linh*