import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PACKAGE_LABELS } from "@/lib/constants/customer";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      package: true,
      customerId: true,
      customer: { select: { fullName: true } },
    },
  });

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
        Gói: {PACKAGE_LABELS[project.package]}
        {project.customerId ? (
          <>
            {" · "}
            <Link href={`/customers/${project.customerId}`} className="hover:underline">
              {project.customer?.fullName}
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
