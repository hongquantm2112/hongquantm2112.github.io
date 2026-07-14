import Link from "next/link";
import { createCustomer } from "../actions";
import { CustomerForm } from "../customer-form";

export default async function NewCustomerPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="p-8">
      <Link href="/customers" className="text-sm text-neutral-500 hover:underline">
        ← Khách hàng
      </Link>
      <h1 className="mb-6 mt-2 text-lg font-semibold text-neutral-900">
        Thêm khách hàng mới
      </h1>

      {error ? (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <CustomerForm action={createCustomer} submitLabel="Tạo khách hàng" />
    </div>
  );
}
