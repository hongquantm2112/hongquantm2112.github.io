import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateCustomer, createProjectForCustomer } from "../actions";
import { CustomerForm } from "../customer-form";
import { PACKAGE_LABELS, PACKAGE_OPTIONS } from "@/lib/constants/customer";

export default async function CustomerDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { id } = await params;
  const { error, saved } = await searchParams;

  const [customer, projects] = await Promise.all([
    prisma.customer.findUnique({ where: { id } }),
    prisma.project.findMany({
      where: { customerId: id },
      select: { id: true, name: true, package: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!customer) {
    notFound();
  }

  const boundUpdate = updateCustomer.bind(null, id);
  const boundCreateProject = createProjectForCustomer.bind(null, id);

  return (
    <div className="p-8">
      <Link href="/customers" className="text-sm text-neutral-500 hover:underline">
        ← Khách hàng
      </Link>
      <h1 className="mb-6 mt-2 text-lg font-semibold text-neutral-900">
        {customer.fullName}
      </h1>

      {error ? (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          Đã lưu thay đổi.
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-sm font-semibold text-neutral-700">
            Thông tin khách hàng
          </h2>
          <CustomerForm action={boundUpdate} customer={customer} submitLabel="Lưu thay đổi" />
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-neutral-700">
            Dự án đã tạo
          </h2>

          <div className="mb-4 overflow-hidden rounded-lg border border-neutral-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-neutral-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Tên dự án</th>
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
                    <td className="px-4 py-2 text-neutral-600">{PACKAGE_LABELS[p.package]}</td>
                  </tr>
                ))}
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-4 py-6 text-center text-neutral-400">
                      Chưa có dự án nào.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <details className="rounded-lg border border-neutral-200 p-4">
            <summary className="cursor-pointer text-sm font-medium text-neutral-800">
              + Tạo dự án mới
            </summary>
            <form action={boundCreateProject} className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">
                  Tên dự án
                </label>
                <input
                  name="project_name"
                  required
                  defaultValue={`Portfolio - ${customer.fullName}`}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">
                  Gói
                </label>
                <select
                  name="project_package"
                  required
                  defaultValue={customer.package ?? ""}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
                >
                  <option value="">— Chọn gói —</option>
                  {PACKAGE_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {PACKAGE_LABELS[p]}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Tạo dự án & mở canvas
              </button>
            </form>
          </details>
        </section>
      </div>
    </div>
  );
}
