"use client";

import { useState } from "react";
import { NodeType } from "@/generated/prisma/enums";
import { NODE_TYPE_LABELS, THEME_OPTIONS } from "@/lib/constants/canvas";
import type { PortfolioNode } from "./canvas-node";

interface CustomerOption {
  id: string;
  fullName: string;
}

export function NodePanel({
  node,
  customers,
  onClose,
  onSave,
}: {
  node: PortfolioNode;
  customers: CustomerOption[];
  onClose: () => void;
  onSave: (nodeId: string, inputData: Record<string, string>) => void;
}) {
  const [form, setForm] = useState<Record<string, string>>(() => ({
    ...node.data.inputData,
  }));
  const [saving, setSaving] = useState(false);

  function setField(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    await onSave(node.id, form);
    setSaving(false);
  }

  return (
    <aside className="flex w-80 shrink-0 flex-col border-l border-neutral-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900">
          {NODE_TYPE_LABELS[node.data.nodeType]}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-neutral-400 hover:text-neutral-700"
        >
          Đóng
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {node.data.nodeType === NodeType.CUSTOMER_INFO ? (
          <>
            <Field label="Chọn khách hàng có sẵn">
              <select
                value={form.customerId ?? ""}
                onChange={(e) => setField("customerId", e.target.value)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              >
                <option value="">— Nhập tay bên dưới —</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Họ tên">
              <input
                value={form.fullName ?? ""}
                onChange={(e) => setField("fullName", e.target.value)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Email">
              <input
                value={form.email ?? ""}
                onChange={(e) => setField("email", e.target.value)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Số điện thoại">
              <input
                value={form.phone ?? ""}
                onChange={(e) => setField("phone", e.target.value)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Ngành nghề / lĩnh vực">
              <input
                value={form.industry ?? ""}
                onChange={(e) => setField("industry", e.target.value)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </Field>
          </>
        ) : null}

        {node.data.nodeType === NodeType.EXPERIENCE ? (
          <>
            <Field label="Kinh nghiệm làm việc / thực tập">
              <textarea
                rows={4}
                value={form.workExperience ?? ""}
                onChange={(e) => setField("workExperience", e.target.value)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Dự án đã làm">
              <textarea
                rows={4}
                value={form.projects ?? ""}
                onChange={(e) => setField("projects", e.target.value)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Kỹ năng">
              <textarea
                rows={3}
                value={form.skills ?? ""}
                onChange={(e) => setField("skills", e.target.value)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Thành tích">
              <textarea
                rows={3}
                value={form.achievements ?? ""}
                onChange={(e) => setField("achievements", e.target.value)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </Field>
          </>
        ) : null}

        {node.data.nodeType === NodeType.THEME ? (
          <div className="space-y-2">
            {THEME_OPTIONS.map((theme) => (
              <label
                key={theme.id}
                className={`block cursor-pointer rounded-md border px-3 py-2 text-sm ${
                  form.themeId === theme.id
                    ? "border-neutral-900"
                    : "border-neutral-200 hover:border-neutral-400"
                }`}
              >
                <input
                  type="radio"
                  name="themeId"
                  value={theme.id}
                  checked={form.themeId === theme.id}
                  onChange={(e) => setField("themeId", e.target.value)}
                  className="sr-only"
                />
                <p className="font-medium text-neutral-900">{theme.name}</p>
                <p className="text-xs text-neutral-500">{theme.description}</p>
              </label>
            ))}
          </div>
        ) : null}

        {node.data.nodeType === NodeType.DESIGN_REQUEST ? (
          <Field label="Yêu cầu thiết kế (màu sắc, phong cách, muốn nhấn mạnh...)">
            <textarea
              rows={8}
              value={form.requestText ?? ""}
              onChange={(e) => setField("requestText", e.target.value)}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </Field>
        ) : null}

        {node.data.nodeType === NodeType.CONTENT_REVIEW ||
        node.data.nodeType === NodeType.PRODUCT ? (
          <p className="rounded-md bg-neutral-50 px-3 py-4 text-center text-sm text-neutral-400">
            Node này cần AI để hoạt động — sẽ hoàn thiện ở bước tích hợp
            Anthropic API.
          </p>
        ) : null}
      </div>

      {node.data.nodeType !== NodeType.CONTENT_REVIEW &&
      node.data.nodeType !== NodeType.PRODUCT ? (
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="mt-4 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {saving ? "Đang lưu..." : "Lưu"}
        </button>
      ) : null}
    </aside>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-neutral-600">{label}</label>
      {children}
    </div>
  );
}
