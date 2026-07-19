"use server";

import { prisma } from "@/lib/prisma";
import { NodeType } from "@/generated/prisma/client";

export async function createCanvasNode(
  projectId: string,
  nodeType: NodeType,
  positionX: number,
  positionY: number,
) {
  return prisma.canvasNode.create({
    data: { projectId, nodeType, positionX, positionY },
  });
}

export async function updateNodePosition(nodeId: string, positionX: number, positionY: number) {
  await prisma.canvasNode.update({
    where: { id: nodeId },
    data: { positionX, positionY },
  });
}

export async function updateNodeInput(nodeId: string, inputData: Record<string, string>) {
  await prisma.canvasNode.update({
    where: { id: nodeId },
    data: { inputData },
  });
}

export async function deleteCanvasNode(nodeId: string) {
  await prisma.canvasNode.delete({ where: { id: nodeId } });
}

export async function createCanvasEdge(
  projectId: string,
  sourceNodeId: string,
  targetNodeId: string,
) {
  return prisma.canvasEdge.create({
    data: { projectId, sourceNodeId, targetNodeId },
  });
}

export async function deleteCanvasEdge(edgeId: string) {
  await prisma.canvasEdge.delete({ where: { id: edgeId } });
}
