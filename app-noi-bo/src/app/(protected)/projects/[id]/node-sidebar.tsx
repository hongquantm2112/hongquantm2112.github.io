import { NODE_TYPE_LABELS, NODE_TYPE_OPTIONS } from "@/lib/constants/canvas";
import type { NodeType } from "@/generated/prisma/enums";

export function NodeSidebar({
  onAddNode,
}: {
  onAddNode: (nodeType: NodeType) => void;
}) {
  return (
    <aside className="flex w-56 shrink-0 flex-col gap-2 border-r border-neutral-200 bg-neutral-50 p-4">
      <p className="mb-1 text-xs font-semibold uppercase text-neutral-500">
        Thêm node
      </p>
      {NODE_TYPE_OPTIONS.map((nodeType) => (
        <button
          key={nodeType}
          type="button"
          onClick={() => onAddNode(nodeType)}
          className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-left text-sm text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100"
        >
          + {NODE_TYPE_LABELS[nodeType]}
        </button>
      ))}
    </aside>
  );
}
