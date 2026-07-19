# Portfolio Production — App nội bộ

Công cụ nội bộ (không public) để quản lý khách hàng và sản xuất từng dự án
portfolio bằng AI. Next.js (App Router) + TypeScript + Auth.js (đăng nhập
Google) + Neon Postgres (Prisma) + React Flow.

## Setup

1. **Neon** ([neon.tech](https://neon.tech)) → tạo project mới (free tier)
   → vào **Connection Details**, lấy 2 connection string:
   - **Pooled connection** → dùng cho `DATABASE_URL`
   - **Direct connection** → dùng cho `DIRECT_URL` (chỉ dùng khi migrate)
2. **Google Cloud Console** → tạo OAuth Client ID loại "Web application":
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
   - Lấy **Client ID** và **Client Secret**
3. Copy `.env.local.example` thành `.env.local` và điền:
   - `DATABASE_URL`, `DIRECT_URL` (từ Neon)
   - `AUTH_SECRET` (tạo bằng `npx auth secret`)
   - `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` (từ Google Cloud Console)
   - `ANTHROPIC_API_KEY` (dùng ở các bước sau, khi tích hợp AI thật)
4. Cài dependency, generate Prisma Client, tạo bảng, chạy dev server:

   ```bash
   npm install
   npx prisma migrate dev
   npm run dev
   ```

   Mở [http://localhost:3000](http://localhost:3000) — sẽ tự chuyển tới
   `/login` nếu chưa đăng nhập. Bấm "Đăng nhập bằng Google" — **bất kỳ tài
   khoản Google nào cũng đăng nhập được**, không có giới hạn danh sách email
   (đây là đánh đổi đã chọn có ý thức để giữ đơn giản; nếu sau này muốn giới
   hạn, thêm 1 điều kiện check `req.auth.user.email` trong `src/proxy.ts`).
5. Xem/sửa dữ liệu trực quan: `npx prisma studio`.

## Trạng thái hiện tại

**Bước 1 — Setup**

- [x] Next.js 16 (App Router) + TypeScript + Tailwind
- [x] Auth.js v5, đăng nhập bằng Google (JWT session, không lưu bảng User)
- [x] `proxy.ts` bảo vệ toàn bộ route, redirect `/login` nếu chưa auth
- [x] Neon Postgres + Prisma, schema cho cả 2 phần: `Customer`, `Project`,
      `CanvasNode`, `CanvasEdge` (`prisma/schema.prisma`)

**Bước 2 — Phần 1: Customer Management**

- [x] Bảng danh sách khách hàng: search theo tên/email, filter theo
      trạng thái + gói (`/customers`)
- [x] Thêm khách hàng mới (`/customers/new`)
- [x] Trang chi tiết khách hàng: xem/sửa thông tin, xem danh sách dự án
      đã link (`/customers/[id]`)
- [x] Nút "Tạo dự án mới" từ trang chi tiết khách hàng → tạo `Project`
      gắn sẵn `customerId`, chuyển sang `/projects/[id]`
- [x] Danh sách dự án thật (`/projects`)

**Còn lại**

- [ ] Phần 2 — Project Canvas (React Flow): tạo/xoá/nối node
- [ ] Tích hợp Anthropic API cho từng node
- [ ] Export PDF / render Landing Page
- [ ] (Tương lai) Form public để khách hàng tự điền thông tin, tự đổ dữ
      liệu vào `Customer`/`Project`/`CanvasNode` — kiến trúc hiện tại
      (Neon Postgres thật) đã hỗ trợ sẵn, chỉ cần thêm 1 route ngoài
      `(protected)`

## Kiến trúc thư mục

```
src/
  app/
    login/              # trang đăng nhập (public)
    api/auth/[...nextauth]/route.ts  # Auth.js route handler
    (protected)/         # mọi route khác, yêu cầu đăng nhập
      customers/
      projects/
  auth.ts                # cấu hình Auth.js (Google provider)
  lib/
    prisma.ts             # Prisma Client singleton (Neon adapter)
    constants/customer.ts # label tiếng Việt cho enum Prisma
  generated/prisma/       # Prisma Client generated code (không commit)
  proxy.ts                 # auth guard cho mọi route
prisma/
  schema.prisma            # định nghĩa models + enums
  migrations/               # lịch sử migration
prisma.config.ts             # cấu hình CLI Prisma (đọc .env.local)
```
