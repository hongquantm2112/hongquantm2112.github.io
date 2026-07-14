import {
  CUSTOMER_STATUS_LABELS,
  CUSTOMER_STATUS_OPTIONS,
  PACKAGE_OPTIONS,
} from "@/lib/constants/customer";
import type { Customer } from "@/lib/supabase/types";

export function CustomerForm({
  action,
  customer,
  submitLabel,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (formData: FormData) => Promise<any>;
  customer?: Customer;
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-xl space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Họ tên *
        </label>
        <input
          name="full_name"
          required
          defaultValue={customer?.full_name}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Email
          </label>
          <input
            name="email"
            type="email"
            defaultValue={customer?.email ?? ""}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Số điện thoại
          </label>
          <input
            name="phone"
            defaultValue={customer?.phone ?? ""}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Ngành nghề / lĩnh vực
          </label>
          <input
            name="industry"
            defaultValue={customer?.industry ?? ""}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Nguồn dẫn
          </label>
          <input
            name="source"
            placeholder="referral / organic / kênh..."
            defaultValue={customer?.source ?? ""}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Gói đã mua
          </label>
          <select
            name="package"
            defaultValue={customer?.package ?? ""}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          >
            <option value="">— Chưa chọn —</option>
            {PACKAGE_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Trạng thái
          </label>
          <select
            name="status"
            defaultValue={customer?.status ?? "Moi lien he"}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          >
            {CUSTOMER_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {CUSTOMER_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Ghi chú
        </label>
        <textarea
          name="notes"
          rows={4}
          defaultValue={customer?.notes ?? ""}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
      >
        {submitLabel}
      </button>
    </form>
  );
}
