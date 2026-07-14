# Portfolio Production — App nội bộ

Công cụ nội bộ (không public) để quản lý khách hàng và sản xuất từng dự án
portfolio bằng AI. Next.js (App Router) + TypeScript + Supabase (auth + DB) +
React Flow.

## Setup

1. Tạo project trên [Supabase](https://supabase.com), lấy `Project URL` và
   `anon public key` trong **Project Settings → API**.
2. Copy `.env.local.example` thành `.env.local` và điền:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY` (dùng ở các bước sau, khi tích hợp AI thật)
3. Chạy schema DB: mở **SQL Editor** trên Supabase, dán nội dung file
   `supabase/schema.sql` và Run.
4. Tạo tài khoản đăng nhập cho người dùng nội bộ: **Authentication → Users →
   Add user** (email/password), không có trang đăng ký công khai trong app.
5. Cài dependency và chạy dev server:

   ```bash
   npm install
   npm run dev
   ```

   Mở [http://localhost:3000](http://localhost:3000) — sẽ tự chuyển tới
   `/login` nếu chưa đăng nhập.

## Trạng thái hiện tại (Bước 1 — Setup)

- [x] Next.js 16 (App Router) + TypeScript + Tailwind
- [x] Supabase client (browser + server) qua `@supabase/ssr`
- [x] `proxy.ts` bảo vệ toàn bộ route, redirect `/login` nếu chưa auth
- [x] Trang đăng nhập email/password, đăng xuất
- [x] Schema DB cho cả 2 phần: `customers`, `projects`, `canvas_nodes`,
      `canvas_edges` (`supabase/schema.sql`), kèm Row Level Security
      (chỉ user đã đăng nhập mới truy cập, không phân quyền chi tiết)
- [x] Sidebar nav + placeholder `/customers`, `/projects`
- [ ] Phần 1 — Customer Management CRUD (bước tiếp theo)
- [ ] Phần 2 — Project Canvas (React Flow)
- [ ] Tích hợp Anthropic API cho từng node
- [ ] Export PDF / render Landing Page

## Kiến trúc thư mục

```
src/
  app/
    login/            # trang đăng nhập (public)
    (protected)/       # mọi route khác, yêu cầu đăng nhập
      customers/
      projects/
  lib/
    supabase/
      client.ts        # Supabase client phía browser
      server.ts        # Supabase client phía server (Server Components/Actions)
      proxy.ts          # session refresh + auth guard, dùng trong proxy.ts gốc
      types.ts          # types khớp schema DB
supabase/
  schema.sql            # chạy 1 lần trên Supabase SQL Editor
```
