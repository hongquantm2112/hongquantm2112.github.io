import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { NODE_TYPE_LABELS } from "@/lib/constants/canvas";
import type { NodeType } from "@/generated/prisma/enums";

export type PortfolioNodeData = {
  nodeType: NodeType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputData: Record<string, any>;
};

export type PortfolioNode = Node<PortfolioNodeData, "portfolio">;

export function CanvasNodeView({ data, selected }: NodeProps<PortfolioNode>) {
  const hasInput = Object.keys(data.inputData ?? {}).length > 0;

  return (
    <div
      className={`w-56 rounded-lg border bg-white px-4 py-3 shadow-sm ${
        selected ? "border-neutral-900" : "border-neutral-300"
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-neutral-400" />
      <p className="text-sm font-medium text-neutral-900">
        {NODE_TYPE_LABELS[data.nodeType]}
      </p>
      <p className="mt-0.5 text-xs text-neutral-400">
        {hasInput ? "Đã nhập dữ liệu" : "Chưa nhập dữ liệu"}
      </p>
      <button
        type="button"
        disabled
        title="Sẽ kích hoạt sau khi tích hợp AI"
        className="nodrag mt-2 w-full cursor-not-allowed rounded border border-neutral-200 py-1 text-xs text-neutral-300"
      >
        Run
      </button>
      <Handle type="source" position={Position.Right} className="!bg-neutral-400" />
    </div>
  );
}
