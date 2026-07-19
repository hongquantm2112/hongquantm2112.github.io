import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  CUSTOMER_STATUS_LABELS,
  CUSTOMER_STATUS_OPTIONS,
  PACKAGE_LABELS,
  PACKAGE_OPTIONS,
} from "@/lib/constants/customer";
import { CustomerStatus, PackageType, Prisma } from "@/generated/prisma/client";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; package?: string }>;
}) {
  const { q, status, package: pkg } = await searchParams;

  const where: Prisma.CustomerWhereInput = {
    ...(q
      ? {
          OR: [
            { fullName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(status ? { status: status as CustomerStatus } : {}),
    ...(pkg ? { package: pkg as PackageType } : {}),
  };

  const customers = await prisma.customer.findMany({
    where,
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      package: true,
      status: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-neutral-900">Khách hàng</h1>
        <Link
          href="/customers/new"
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-800"
        >
          + Thêm khách hàng
        </Link>
      </div>

      <form className="mb-6 flex flex-wrap gap-3" method="get">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Tìm theo tên hoặc email..."
          className="w-64 rounded-md border border-neutral-300 px-3 py-1.5 text-sm focus:border-neutral-500 focus:outline-none"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm focus:border-neutral-500 focus:outline-none"
        >
          <option value="">Tất cả trạng thái</option>
          {CUSTOMER_STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {CUSTOMER_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <select
          name="package"
          defaultValue={pkg ?? ""}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm focus:border-neutral-500 focus:outline-none"
        >
          <option value="">Tất cả gói</option>
          {PACKAGE_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {PACKAGE_LABELS[p]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100"
        >
          Lọc
        </button>
        {q || status || pkg ? (
          <Link
            href="/customers"
            className="rounded-md px-3 py-1.5 text-sm text-neutral-500 hover:text-neutral-800"
          >
            Xoá bộ lọc
          </Link>
        ) : null}
      </form>

      <div className="overflow-hidden rounded-lg border border-neutral-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-2 font-medium">Họ tên</th>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">SĐT</th>
              <th className="px-4 py-2 font-medium">Gói</th>
              <th className="px-4 py-2 font-medium">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-neutral-50">
                <td className="px-4 py-2">
                  <Link
                    href={`/customers/${c.id}`}
                    className="font-medium text-neutral-900 hover:underline"
                  >
                    {c.fullName}
                  </Link>
                </td>
                <td className="px-4 py-2 text-neutral-600">{c.email ?? "—"}</td>
                <td className="px-4 py-2 text-neutral-600">{c.phone ?? "—"}</td>
                <td className="px-4 py-2 text-neutral-600">
                  {c.package ? PACKAGE_LABELS[c.package] : "—"}
                </td>
                <td className="px-4 py-2">
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">
                    {CUSTOMER_STATUS_LABELS[c.status]}
                  </span>
                </td>
              </tr>
            ))}
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
                  Chưa có khách hàng nào khớp bộ lọc.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
