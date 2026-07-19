import Link from "next/link";
import { auth } from "@/auth";
import { signOut } from "@/app/login/actions";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col border-r border-neutral-200 bg-neutral-50 px-4 py-6">
        <p className="mb-6 px-2 text-sm font-semibold text-neutral-900">
          Portfolio Production
        </p>
        <nav className="flex flex-1 flex-col gap-1 text-sm">
          <Link
            href="/customers"
            className="rounded-md px-2 py-1.5 text-neutral-700 hover:bg-neutral-200"
          >
            Khách hàng
          </Link>
          <Link
            href="/projects"
            className="rounded-md px-2 py-1.5 text-neutral-700 hover:bg-neutral-200"
          >
            Dự án
          </Link>
        </nav>
        <div className="mt-6 border-t border-neutral-200 pt-4">
          <p className="mb-2 truncate px-2 text-xs text-neutral-500">
            {user?.email}
          </p>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full rounded-md px-2 py-1.5 text-left text-sm text-neutral-700 hover:bg-neutral-200"
            >
              Đăng xuất
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
