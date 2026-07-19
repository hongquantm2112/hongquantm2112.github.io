"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CustomerStatus, PackageType } from "@/generated/prisma/client";

function readCustomerFields(formData: FormData) {
  const packageValue = String(formData.get("package") ?? "");
  return {
    fullName: String(formData.get("full_name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    industry: String(formData.get("industry") ?? "").trim() || null,
    source: String(formData.get("source") ?? "").trim() || null,
    package: (packageValue || null) as PackageType | null,
    status: String(formData.get("status") ?? CustomerStatus.MOI_LIEN_HE) as CustomerStatus,
    notes: String(formData.get("notes") ?? "").trim() || null,
  };
}

export async function createCustomer(formData: FormData) {
  const fields = readCustomerFields(formData);
  if (!fields.fullName) {
    redirect(`/customers/new?error=${encodeURIComponent("Vui lòng nhập họ tên khách hàng")}`);
  }

  const customer = await prisma.customer.create({ data: fields });

  revalidatePath("/customers");
  redirect(`/customers/${customer.id}`);
}

export async function updateCustomer(customerId: string, formData: FormData) {
  const fields = readCustomerFields(formData);
  if (!fields.fullName) {
    redirect(`/customers/${customerId}?error=${encodeURIComponent("Vui lòng nhập họ tên khách hàng")}`);
  }

  await prisma.customer.update({ where: { id: customerId }, data: fields });

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

  const project = await prisma.project.create({
    data: { customerId, name: projectName, package: packageValue },
  });

  revalidatePath(`/customers/${customerId}`);
  revalidatePath("/projects");
  redirect(`/projects/${project.id}`);
}
