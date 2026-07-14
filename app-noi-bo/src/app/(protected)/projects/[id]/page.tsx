import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("id, name, package, customer_id, customers(full_name)")
    .eq("id", id)
    .single();

  if (!project) {
    notFound();
  }

  return (
    <div className="p-8">
      <Link href="/projects" className="text-sm text-neutral-500 hover:underline">
        ← Dự án
      </Link>
      <h1 className="mb-1 mt-2 text-lg font-semibold text-neutral-900">
        {project.name}
      </h1>
      <p className="mb-6 text-sm text-neutral-500">
        Gói: {project.package}
        {project.customer_id ? (
          <>
            {" · "}
            <Link href={`/customers/${project.customer_id}`} className="hover:underline">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(project.customers as any)?.full_name}
            </Link>
          </>
        ) : null}
      </p>

      <div className="rounded-lg border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500">
        Canvas node-based (React Flow) sẽ được xây ở bước tiếp theo.
      </div>
    </div>
  );
}
