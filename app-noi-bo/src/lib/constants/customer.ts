import type { CustomerStatus, PackageType } from "@/lib/supabase/types";

export const CUSTOMER_STATUS_LABELS: Record<CustomerStatus, string> = {
  "Moi lien he": "Mới liên hệ",
  "Dang lam": "Đang làm",
  "Cho khach duyet": "Chờ khách duyệt",
  "Da giao": "Đã giao",
  "Da thanh toan": "Đã thanh toán",
  Huy: "Huỷ",
};

export const CUSTOMER_STATUS_OPTIONS: CustomerStatus[] = [
  "Moi lien he",
  "Dang lam",
  "Cho khach duyet",
  "Da giao",
  "Da thanh toan",
  "Huy",
];

export const PACKAGE_OPTIONS: PackageType[] = ["PDF", "Landing Page", "Combo"];
