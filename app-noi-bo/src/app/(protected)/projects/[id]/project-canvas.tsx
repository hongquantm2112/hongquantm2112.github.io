"use client";

import { useCallback, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { NodeType } from "@/generated/prisma/enums";
import { CanvasNodeView, type PortfolioNode } from "./canvas-node";
import { NodeSidebar } from "./node-sidebar";
import { NodePanel } from "./node-panel";
import {
  createCanvasNode,
  updateNodePosition,
  updateNodeInput,
  deleteCanvasNode,
  createCanvasEdge,
  deleteCanvasEdge,
} from "./actions";

const nodeTypes = { portfolio: CanvasNodeView };

interface CustomerOption {
  id: string;
  fullName: string;
}

export function ProjectCanvas({
  projectId,
  initialNodes,
  initialEdges,
  customers,
}: {
  projectId: string;
  initialNodes: PortfolioNode[];
  initialEdges: Edge[];
  customers: CustomerOption[];
}) {
  return (
    <ReactFlowProvider>
      <CanvasInner
        projectId={projectId}
        initialNodes={initialNodes}
        initialEdges={initialEdges}
        customers={customers}
      />
    </ReactFlowProvider>
  );
}

function CanvasInner({
  projectId,
  initialNodes,
  initialEdges,
  customers,
}: {
  projectId: string;
  initialNodes: PortfolioNode[];
  initialEdges: Edge[];
  customers: CustomerOption[];
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;

  const handleAddNode = useCallback(
    async (nodeType: NodeType) => {
      const x = 100 + Math.random() * 200;
      const y = 100 + Math.random() * 200;
      const created = await createCanvasNode(projectId, nodeType, x, y);
      setNodes((nds) => [
        ...nds,
        {
          id: created.id,
          type: "portfolio",
          position: { x: created.positionX, y: created.positionY },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: { nodeType: created.nodeType, inputData: created.inputData as any },
        },
      ]);
    },
    [projectId, setNodes],
  );

  const handleNodeDragStop = useCallback((_: MouseEvent | TouchEvent, node: PortfolioNode) => {
    void updateNodePosition(node.id, node.position.x, node.position.y);
  }, []);

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      setEdges((eds) => addEdge(connection, eds));
      void createCanvasEdge(projectId, connection.source, connection.target);
    },
    [projectId, setEdges],
  );

  const handleNodesDelete = useCallback((deleted: PortfolioNode[]) => {
    deleted.forEach((n) => void deleteCanvasNode(n.id));
    setSelectedNodeId((current) => (deleted.some((n) => n.id === current) ? null : current));
  }, []);

  const handleEdgesDelete = useCallback((deleted: Edge[]) => {
    deleted.forEach((e) => void deleteCanvasEdge(e.id));
  }, []);

  const handleNodeClick: NodeMouseHandler<PortfolioNode> = useCallback((_, node) => {
    setSelectedNodeId(node.id);
  }, []);

  const handleSaveNodeInput = useCallback(
    (nodeId: string, inputData: Record<string, string>) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, inputData } } : n)),
      );
      return updateNodeInput(nodeId, inputData);
    },
    [setNodes],
  );

  return (
    <div className="flex flex-1 overflow-hidden">
      <NodeSidebar onAddNode={handleAddNode} />
      <div className="relative flex-1">
        <div className="absolute right-4 top-4 z-10">
          <button
            type="button"
            disabled
            title="Sẽ kích hoạt sau khi tích hợp AI"
            className="cursor-not-allowed rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-400 shadow-sm"
          >
            Run tổng
          </button>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
          onNodeDragStop={handleNodeDragStop}
          onNodesDelete={handleNodesDelete}
          onEdgesDelete={handleEdgesDelete}
          onNodeClick={handleNodeClick}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      {selectedNode ? (
        <NodePanel
          node={selectedNode}
          customers={customers}
          onClose={() => setSelectedNodeId(null)}
          onSave={handleSaveNodeInput}
        />
      ) : null}
    </div>
  );
}
