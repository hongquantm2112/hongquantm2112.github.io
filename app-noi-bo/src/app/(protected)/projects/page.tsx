import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PACKAGE_LABELS } from "@/lib/constants/customer";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      name: true,
      package: true,
      customer: { select: { fullName: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <h1 className="mb-6 text-lg font-semibold text-neutral-900">Dự án</h1>

      <div className="overflow-hidden rounded-lg border border-neutral-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-2 font-medium">Tên dự án</th>
              <th className="px-4 py-2 font-medium">Khách hàng</th>
              <th className="px-4 py-2 font-medium">Gói</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-neutral-50">
                <td className="px-4 py-2">
                  <Link
                    href={`/projects/${p.id}`}
                    className="font-medium text-neutral-900 hover:underline"
                  >
                    {p.name}
                  </Link>
                </td>
                <td className="px-4 py-2 text-neutral-600">
                  {p.customer?.fullName ?? "—"}
                </td>
                <td className="px-4 py-2 text-neutral-600">{PACKAGE_LABELS[p.package]}</td>
              </tr>
            ))}
            {projects.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-neutral-400">
                  Chưa có dự án nào. Tạo dự án từ trang chi tiết khách hàng.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
