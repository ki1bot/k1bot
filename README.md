# Website Portofolio

Halo semuanya! 👋

Perkenalkan, saya **Rifqi Susanto**. Project ini merupakan website portofolio pribadi yang saya buat untuk menampilkan profil, pengalaman, kemampuan, daftar project, sertifikat, komentar pengunjung, media sosial, dan form kontak dalam satu website.

Website ini dibangun menggunakan **Next.js**, **React**, **Tailwind CSS**, **Supabase**, **Cloudflare R2**, dan **Nodemailer**. Supabase digunakan untuk menyimpan data project, sertifikat, dan komentar. Cloudflare R2 digunakan untuk menyimpan sebagian besar gambar, dokumen PDF, dan asset berukuran besar.

**Live Demo:** [https://www.rifqii.com/]

---

## 🛠️ Tech Stack

Project ini dibuat menggunakan teknologi berikut:

- **Next.js** - Framework React untuk routing, server component, API route, metadata, dan proses build
- **ReactJS** - Library untuk membangun antarmuka website
- **Tailwind CSS** - Styling utama untuk tampilan responsif
- **Supabase** - Database PostgreSQL untuk project, sertifikat, dan komentar
- **Cloudflare R2** - Penyimpanan gambar, GIF, dokumen PDF, dan asset portofolio
- **Nodemailer** - Mengirim pesan dari form kontak ke Gmail
- **Lucide React** - Kumpulan icon yang digunakan pada antarmuka
- **Radix UI** - Komponen dasar antarmuka yang mudah diakses
- **shadcn** - Komponen UI yang dapat disesuaikan
- **ESLint** - Memeriksa kualitas dan konsistensi kode

---

## User Roles

| Role                 | Access                                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Visitor (Public)** | Melihat profil, pengalaman, project, detail project, sertifikat, komentar, dan mengirim komentar atau pesan kontak |
| **Owner / Admin**    | Mengelola data project, sertifikat, dan komentar secara langsung melalui Supabase Dashboard serta asset melalui R2 |

---

## Getting Started

### Prerequisites

Pastikan perangkat sudah memiliki:

- Node.js
- npm
- Git
- Akun Supabase
- Project Supabase
- Akun Cloudflare dengan bucket R2
- Akun Gmail
- Gmail App Password untuk fitur kontak

---

### 1. Clone & Install

Clone repository dan masuk ke direktori project:

```bash
git clone https://github.com/ki1bot/k1bot.git
cd k1bot
```

Install seluruh dependency:

```bash
npm install
```

Jalankan pemeriksaan dependency jika diperlukan:

```bash
npm audit
```

---

### 2. Environment Variables

Buat file `.env.local` pada root project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-reference.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key

NEXT_PUBLIC_R2_ASSET_BASE_URL=https://assets.example.com

GMAIL_USER=your-gmail-address
GMAIL_APP_PASSWORD=your-gmail-app-password
CONTACT_RECEIVER_EMAIL=your-receiver-email
```

Penjelasan environment variable:

| Variable                               | Kegunaan                                                        |
| -------------------------------------- | --------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | URL project Supabase                                            |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key Supabase untuk akses frontend                   |
| `NEXT_PUBLIC_R2_ASSET_BASE_URL`        | Domain publik Cloudflare R2                                     |
| `GMAIL_USER`                           | Akun Gmail yang digunakan oleh Nodemailer                       |
| `GMAIL_APP_PASSWORD`                   | App Password dari akun Gmail                                    |
| `CONTACT_RECEIVER_EMAIL`               | Alamat email tujuan dari pesan yang dikirim melalui form kontak |

Jangan menggunakan Supabase Secret Key pada environment variable yang diawali dengan `NEXT_PUBLIC_` karena nilainya akan tersedia pada frontend.

Setelah mengubah `.env.local`, hentikan dan jalankan ulang development server.

---

### 3. Supabase Client

File Supabase client berada di:

```txt
src/lib/supabase/client.js
```

Konfigurasi client yang digunakan:

```javascript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith("https://") &&
  supabaseUrl.includes(".supabase.co") &&
  supabaseKey.length > 20,
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;
```

Website memiliki data fallback pada:

```txt
src/lib/constants.js
```

Jika Supabase belum dikonfigurasi, tabel kosong, atau query gagal, website akan menggunakan data project, sertifikat, dan komentar fallback tersebut.

---

### 4. Database Setup

Buka:

```txt
Supabase Dashboard
→ SQL Editor
→ New query
```

Jalankan query berikut:

```sql
BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.projects (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  description text,
  img text,
  link text,
  github text,
  pdf text,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  tech_stack jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_published boolean NOT NULL DEFAULT true,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.certificates (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  title text NOT NULL DEFAULT 'Certificate',
  img text NOT NULL,
  pdf_url text,
  type text NOT NULL DEFAULT 'pdf',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.portfolio_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  content text NOT NULL,
  user_name text NOT NULL,
  profile_image text NOT NULL DEFAULT '/img/screen/default-avatar.jpg',
  is_pinned boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS projects_title_unique
ON public.projects (title);

CREATE UNIQUE INDEX IF NOT EXISTS certificates_img_unique
ON public.certificates (img);

CREATE UNIQUE INDEX IF NOT EXISTS pinned_admin_comment_unique
ON public.portfolio_comments (user_name, is_pinned)
WHERE is_pinned = true;

CREATE INDEX IF NOT EXISTS projects_order_index_idx
ON public.projects (order_index, created_at DESC);

CREATE INDEX IF NOT EXISTS certificates_order_index_idx
ON public.certificates (order_index, created_at DESC);

CREATE INDEX IF NOT EXISTS portfolio_comments_order_idx
ON public.portfolio_comments (is_pinned DESC, created_at DESC);

COMMIT;
```

Tabel yang digunakan:

#### `projects`

Menyimpan judul, deskripsi, gambar, link live demo, repository GitHub, dokumen PDF, fitur utama, teknologi, status publikasi, dan urutan project.

#### `certificates`

Menyimpan judul sertifikat, gambar preview, dokumen PDF, jenis file, dan urutan sertifikat.

#### `portfolio_comments`

Menyimpan nama pengunjung, isi komentar, status pinned, avatar, dan waktu komentar dibuat.

Form kontak tidak disimpan ke database Supabase. Pesan dikirim langsung ke Gmail melalui Nodemailer.

---

### 5. Row Level Security

Jalankan query berikut untuk mengaktifkan RLS dan policy public:

```sql
BEGIN;

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read projects"
ON public.projects;

DROP POLICY IF EXISTS "public read certificates"
ON public.certificates;

DROP POLICY IF EXISTS "public read comments"
ON public.portfolio_comments;

DROP POLICY IF EXISTS "public insert comments"
ON public.portfolio_comments;

DROP POLICY IF EXISTS "public insert comment"
ON public.portfolio_comments;

CREATE POLICY "public read projects"
ON public.projects
FOR SELECT
TO anon, authenticated
USING (is_published = true);

CREATE POLICY "public read certificates"
ON public.certificates
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "public read comments"
ON public.portfolio_comments
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "public insert comments"
ON public.portfolio_comments
FOR INSERT
TO anon, authenticated
WITH CHECK (
  is_pinned = false
  AND profile_image = '/img/screen/default-avatar.jpg'
);

GRANT USAGE ON SCHEMA public
TO anon, authenticated;

GRANT SELECT
ON public.projects
TO anon, authenticated;

GRANT SELECT
ON public.certificates
TO anon, authenticated;

GRANT SELECT
ON public.portfolio_comments
TO anon, authenticated;

GRANT INSERT (
  content,
  user_name,
  profile_image,
  is_pinned
)
ON public.portfolio_comments
TO anon, authenticated;

REVOKE INSERT, UPDATE, DELETE
ON public.projects
FROM anon, authenticated;

REVOKE INSERT, UPDATE, DELETE
ON public.certificates
FROM anon, authenticated;

REVOKE UPDATE, DELETE
ON public.portfolio_comments
FROM anon, authenticated;

COMMIT;
```

---

### 6. Seed Komentar Admin

Jalankan query berikut untuk membuat komentar pinned milik Rifqi dan komentar default Faris:

```sql
BEGIN;

INSERT INTO public.portfolio_comments (
  id,
  content,
  user_name,
  profile_image,
  is_pinned,
  created_at
)
VALUES (
  'd5a0a800-bda0-44f8-ab94-526e12f34f6a',
  'Halo, terima kasih sudah mampir ke portofolio saya.',
  'Rifqi',
  'assets/rifqi.jpg',
  true,
  '2026-02-24 00:00:00+07'
)
ON CONFLICT (user_name, is_pinned)
WHERE is_pinned = true
DO UPDATE SET
  content = EXCLUDED.content,
  profile_image = EXCLUDED.profile_image,
  created_at = EXCLUDED.created_at;

INSERT INTO public.portfolio_comments (
  id,
  content,
  user_name,
  profile_image,
  is_pinned,
  created_at
)
VALUES (
  '3039eb92-6147-4c89-92a9-077b4837925c',
  'Portofolionya rapi dan bagus banget.',
  'Faris',
  '/img/screen/default-avatar.jpg',
  false,
  '2026-03-13 00:00:00+07'
)
ON CONFLICT (id)
DO UPDATE SET
  content = EXCLUDED.content,
  user_name = EXCLUDED.user_name,
  profile_image = EXCLUDED.profile_image,
  is_pinned = EXCLUDED.is_pinned,
  created_at = EXCLUDED.created_at;

COMMIT;
```

---

### 7. Run Locally

Jalankan development server:

```bash
npm run dev
```

Buka website melalui:

```txt
http://localhost:3000
```

Jalankan ESLint:

```bash
npm run lint
```

Lakukan production build:

```bash
npm run build
```

Jalankan hasil production build:

```bash
npm run start
```

---

## Pages & Features

### Public Visitor

- **Home** — Menampilkan hero, profil singkat, pengalaman, kemampuan, project, sertifikat, komentar, dan kontak
- **About** — Menampilkan informasi pribadi, kemampuan, statistik project, dan sertifikat
- **Experience** — Menampilkan pengalaman dan perjalanan pengembangan kemampuan
- **Projects** — Menampilkan daftar project yang berasal dari Supabase atau data fallback
- **Project Detail** — Menampilkan deskripsi, gambar, teknologi, fitur utama, live demo, GitHub, dan dokumen PDF
- **Certificates** — Menampilkan preview sertifikat dan tautan menuju dokumen PDF
- **Comments** — Menampilkan komentar pinned dan komentar dari pengunjung
- **Comment Form** — Pengunjung dapat mengirim komentar menggunakan avatar default
- **Contact** — Mengirim pesan dari website langsung menuju Gmail
- **Social Media** — Menampilkan LinkedIn, GitHub, Instagram, YouTube, Spotify, dan TikTok
- **Responsive Layout** — Mendukung tampilan desktop, tablet, dan mobile
- **Loading Screen** — Menampilkan animasi saat halaman pertama kali dimuat
- **Animated Background** — Menampilkan latar belakang dan animasi interaktif
- **Back to Top** — Memudahkan pengguna kembali ke bagian atas halaman

### Admin

Project belum memiliki halaman admin khusus.

Pemilik dapat melakukan pengelolaan berikut melalui Supabase Dashboard:

- **Projects** — Menambah, mengedit, mengurutkan, memublikasikan, atau menghapus project
- **Certificates** — Menambah, mengedit, mengurutkan, atau menghapus sertifikat
- **Comments** — Melihat, mengubah status pinned, atau menghapus komentar
- **Cloudflare R2** — Mengelola gambar, PDF, GIF, dan asset portofolio
- **Vercel** — Mengelola deployment dan environment variable

---

## Troubleshooting

- Pastikan Node.js, npm, dan Git sudah terpasang
- Pastikan sudah menjalankan `npm install`
- Pastikan file `.env.local` berada pada root project
- Restart development server setelah mengubah `.env.local`
- Pastikan `NEXT_PUBLIC_SUPABASE_URL` menggunakan URL project Supabase yang benar
- Pastikan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` menggunakan publishable key yang benar
- Jika project atau sertifikat tidak tampil, periksa tabel dan RLS Supabase
- Jika tabel kosong, website akan menggunakan data fallback dari `src/lib/constants.js`
- Jika komentar gagal dikirim, periksa policy `public insert comments`
- Pastikan komentar baru menggunakan `/img/screen/default-avatar.jpg`
- Jika foto pinned Rifqi tidak tampil, periksa file `assets/rifqi.jpg` di Cloudflare R2
- Jika asset R2 tidak tampil, periksa `NEXT_PUBLIC_R2_ASSET_BASE_URL`
- Jika avatar default tidak tampil, periksa `public/img/screen/default-avatar.jpg`
- Jika form kontak gagal, periksa `GMAIL_USER`, `GMAIL_APP_PASSWORD`, dan `CONTACT_RECEIVER_EMAIL`
- Pastikan Gmail App Password tidak mengandung spasi yang salah
- Jika perubahan data belum langsung tampil, tunggu proses revalidation atau restart development server
- Jalankan `npm run lint` untuk memeriksa masalah kode
- Jalankan `npm run build` untuk memastikan project dapat dibangun
- Jangan menyimpan Secret Key Supabase di repository atau environment variable frontend

---

## Credits & Contact

**Rifqi**

GitHub: [ki1bot](https://github.com/ki1bot)

Website: [https://www.rifqii.com](https://www.rifqii.com)

⭐ Jika project ini membantu atau menarik, jangan lupa memberikan star pada repository ini!
