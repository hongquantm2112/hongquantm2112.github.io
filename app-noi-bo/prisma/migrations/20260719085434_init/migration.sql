-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('PDF', 'LANDING_PAGE', 'COMBO');

-- CreateEnum
CREATE TYPE "CustomerStatus" AS ENUM ('MOI_LIEN_HE', 'DANG_LAM', 'CHO_KHACH_DUYET', 'DA_GIAO', 'DA_THANH_TOAN', 'HUY');

-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('CUSTOMER_INFO', 'EXPERIENCE', 'THEME', 'DESIGN_REQUEST', 'CONTENT_REVIEW', 'PRODUCT');

-- CreateEnum
CREATE TYPE "NodeStatus" AS ENUM ('IDLE', 'RUNNING', 'DONE', 'ERROR', 'WAITING_REVIEW');

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "industry" TEXT,
    "source" TEXT,
    "package" "PackageType",
    "status" "CustomerStatus" NOT NULL DEFAULT 'MOI_LIEN_HE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "customerId" TEXT,
    "name" TEXT NOT NULL,
    "package" "PackageType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanvasNode" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "nodeType" "NodeType" NOT NULL,
    "positionX" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "positionY" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "inputData" JSONB NOT NULL DEFAULT '{}',
    "outputData" JSONB NOT NULL DEFAULT '{}',
    "status" "NodeStatus" NOT NULL DEFAULT 'IDLE',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CanvasNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanvasEdge" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "sourceNodeId" TEXT NOT NULL,
    "targetNodeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CanvasEdge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Customer_status_idx" ON "Customer"("status");

-- CreateIndex
CREATE INDEX "Customer_package_idx" ON "Customer"("package");

-- CreateIndex
CREATE INDEX "Project_customerId_idx" ON "Project"("customerId");

-- CreateIndex
CREATE INDEX "CanvasNode_projectId_idx" ON "CanvasNode"("projectId");

-- CreateIndex
CREATE INDEX "CanvasEdge_projectId_idx" ON "CanvasEdge"("projectId");

-- CreateIndex
CREATE INDEX "CanvasEdge_sourceNodeId_idx" ON "CanvasEdge"("sourceNodeId");

-- CreateIndex
CREATE INDEX "CanvasEdge_targetNodeId_idx" ON "CanvasEdge"("targetNodeId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvasNode" ADD CONSTRAINT "CanvasNode_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvasEdge" ADD CONSTRAINT "CanvasEdge_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvasEdge" ADD CONSTRAINT "CanvasEdge_sourceNodeId_fkey" FOREIGN KEY ("sourceNodeId") REFERENCES "CanvasNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvasEdge" ADD CONSTRAINT "CanvasEdge_targetNodeId_fkey" FOREIGN KEY ("targetNodeId") REFERENCES "CanvasNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
