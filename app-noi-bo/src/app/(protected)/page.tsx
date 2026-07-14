import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-lg font-semibold text-neutral-900">Workspace</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Quản lý khách hàng và sản xuất dự án portfolio.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/customers"
          className="rounded-md border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
        >
          Khách hàng →
        </Link>
        <Link
          href="/projects"
          className="rounded-md border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
        >
          Dự án →
        </Link>
      </div>
    </div>
  );
}
