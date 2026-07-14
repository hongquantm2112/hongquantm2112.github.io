import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, name, package, created_at, customers(full_name)")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <h1 className="mb-6 text-lg font-semibold text-neutral-900">Dự án</h1>

      {error ? (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error.message}
        </p>
      ) : null}

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
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(projects as any[])?.map((p) => (
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
                  {p.customers?.full_name ?? "—"}
                </td>
                <td className="px-4 py-2 text-neutral-600">{p.package}</td>
              </tr>
            ))}
            {projects?.length === 0 ? (
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
