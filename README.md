# The 100-Year Scroll 📜✨

> **"A collaborative timeline of human wisdom. Anonymous stories from every age."**

![The 100-Year Scroll](https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2694&auto=format&fit=crop)

The **100-Year Scroll** is a digital museum of human life. It is an honest, anonymous space where people share their deepest struggles, joys, and realizations at specific ages. The result is a universal timeline of wisdom that proves we are not alone in our journey.

## 🌟 The "Timeline of Light" Design

This project features a custom **"Ethereal Minimalism"** design system:

- **Cinematic Entrance:** A dramatic, sentence-based input ("I am [ X ] years old today") that shifts the atmosphere in real-time.
- **Dynamic Atmosphere:** The background is a breathing, living mesh gradient that evolves as you age:
  - **Dawn (0-18):** Soft pinks & sky blues.
  - **Sunlight (19-35):** Warm apricot & energetic teal.
  - **Golden Hour (36-60):** Deep burnt orange & sage green.
  - **Starlight (61-100):** Midnight indigo & galaxy purple + twinkling stars.
- **Glassmorphism:** UI elements are "glass panes" floating in 3D space with heavy blurs and subtle noise textures (film grain) to kill the digital coldness.
- **Editorial Typography:** Uses *Playfair Display* for massive, magazine-style headlines and *Inter* for clean, breathable body text.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, TypeScript)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + Custom CSS Variables
- **Animations:** [Framer Motion](https://www.framer.com/motion/) (Complex page transitions & layout animations)
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL + Row Level Security)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/HarshalPatel1972/The-100-Year-Scroll.git
cd The-100-Year-Scroll
npm install
```

### 2. Configure Environment
Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Setup Database
Run the SQL commands found in `supabase-schema.sql` in your Supabase SQL Editor to create the `posts` table and enable Row Level Security (RLS) for anonymous contributions.

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to enter the scroll.

---

## 🎨 Project Structure

```
src/
├── app/
│   ├── globals.css        # Tailwind v4 config, Global Noise Texture
│   └── layout.tsx         # Root layout with AgeProvider
├── components/
│   ├── LandingHero.tsx    # Cinematic "I am [Age]" entrance
│   ├── MainFeed.tsx       # 2-Column Asymmetrical Grid Layout
│   ├── AgeGradientBackground.tsx # The living mesh gradient
│   ├── PostCard.tsx       # Glassmorphic story cards
│   ├── CreatePostModal.tsx # Floating glass input modal
│   └── ...
├── context/
│   └── AgeContext.tsx     # The "Brain" (Color logic, age state)
└── lib/
    └── supabase.ts        # Database client + Mock data fallback
```

---

## 🤝 Contributing

Contributions are welcome. Please respect the **"High-End Editorial"** aesthetic guidelines:
1. **Typography First:** If it can be done with text size/weight, do it. Avoid unnecessary borders.
2. **Motion:** Everything must float. Use `duration-500` and `ease-out` for smoothness.
3. **Glass:** Use `backdrop-blur-2xl` and `bg-white/5` for containers.

License: MIT
