import Link from "next/link";
import { notFound } from "next/navigation";
import type { Edge } from "@xyflow/react";
import { prisma } from "@/lib/prisma";
import { PACKAGE_LABELS } from "@/lib/constants/customer";
import { ProjectCanvas } from "./project-canvas";
import type { PortfolioNode } from "./canvas-node";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, customers] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        package: true,
        customerId: true,
        customer: { select: { fullName: true } },
        nodes: true,
        edges: true,
      },
    }),
    prisma.customer.findMany({
      select: { id: true, fullName: true },
      orderBy: { fullName: "asc" },
    }),
  ]);

  if (!project) {
    notFound();
  }

  const initialNodes: PortfolioNode[] = project.nodes.map((n) => ({
    id: n.id,
    type: "portfolio",
    position: { x: n.positionX, y: n.positionY },
    data: {
      nodeType: n.nodeType,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      inputData: n.inputData as any,
    },
  }));

  const initialEdges: Edge[] = project.edges.map((e) => ({
    id: e.id,
    source: e.sourceNodeId,
    target: e.targetNodeId,
  }));

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="border-b border-neutral-200 px-8 py-4">
        <Link href="/projects" className="text-sm text-neutral-500 hover:underline">
          ← Dự án
        </Link>
        <h1 className="mb-1 mt-2 text-lg font-semibold text-neutral-900">
          {project.name}
        </h1>
        <p className="text-sm text-neutral-500">
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
      </div>

      <ProjectCanvas
        projectId={project.id}
        initialNodes={initialNodes}
        initialEdges={initialEdges}
        customers={customers}
      />
    </div>
  );
}
