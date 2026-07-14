"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { CustomerStatus, PackageType } from "@/lib/supabase/types";

function readCustomerFields(formData: FormData) {
  const packageValue = String(formData.get("package") ?? "");
  return {
    full_name: String(formData.get("full_name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    industry: String(formData.get("industry") ?? "").trim() || null,
    source: String(formData.get("source") ?? "").trim() || null,
    package: (packageValue || null) as PackageType | null,
    status: String(formData.get("status") ?? "Moi lien he") as CustomerStatus,
    notes: String(formData.get("notes") ?? "").trim() || null,
  };
}

export async function createCustomer(formData: FormData) {
  const fields = readCustomerFields(formData);
  if (!fields.full_name) {
    redirect(`/customers/new?error=${encodeURIComponent("Vui lòng nhập họ tên khách hàng")}`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customers")
    .insert(fields)
    .select("id")
    .single();

  if (error || !data) {
    redirect(`/customers/new?error=${encodeURIComponent(error?.message ?? "Không tạo được khách hàng")}`);
  }

  revalidatePath("/customers");
  redirect(`/customers/${data.id}`);
}

export async function updateCustomer(customerId: string, formData: FormData) {
  const fields = readCustomerFields(formData);
  if (!fields.full_name) {
    redirect(`/customers/${customerId}?error=${encodeURIComponent("Vui lòng nhập họ tên khách hàng")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("customers").update(fields).eq("id", customerId);

  if (error) {
    redirect(`/customers/${customerId}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/customers");
  revalidatePath(`/customers/${customerId}`);
  redirect(`/customers/${customerId}?saved=1`);
}

export async function createProjectForCustomer(customerId: string, formData: FormData) {
  const projectName = String(formData.get("project_name") ?? "").trim();
  const packageValue = String(formData.get("project_package") ?? "") as PackageType;

  if (!projectName || !packageValue) {
    redirect(
      `/customers/${customerId}?error=${encodeURIComponent("Vui lòng nhập tên dự án và chọn gói")}`,
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({ customer_id: customerId, name: projectName, package: packageValue })
    .select("id")
    .single();

  if (error || !data) {
    redirect(
      `/customers/${customerId}?error=${encodeURIComponent(error?.message ?? "Không tạo được dự án")}`,
    );
  }

  revalidatePath(`/customers/${customerId}`);
  revalidatePath("/projects");
  redirect(`/projects/${data.id}`);
}
