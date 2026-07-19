import { CustomerStatus, PackageType } from "@/generated/prisma/enums";

export const CUSTOMER_STATUS_LABELS: Record<CustomerStatus, string> = {
  MOI_LIEN_HE: "Mới liên hệ",
  DANG_LAM: "Đang làm",
  CHO_KHACH_DUYET: "Chờ khách duyệt",
  DA_GIAO: "Đã giao",
  DA_THANH_TOAN: "Đã thanh toán",
  HUY: "Huỷ",
};

export const CUSTOMER_STATUS_OPTIONS: CustomerStatus[] = [
  CustomerStatus.MOI_LIEN_HE,
  CustomerStatus.DANG_LAM,
  CustomerStatus.CHO_KHACH_DUYET,
  CustomerStatus.DA_GIAO,
  CustomerStatus.DA_THANH_TOAN,
  CustomerStatus.HUY,
];

export const PACKAGE_LABELS: Record<PackageType, string> = {
  PDF: "PDF",
  LANDING_PAGE: "Landing Page",
  COMBO: "Combo",
};

export const PACKAGE_OPTIONS: PackageType[] = [
  PackageType.PDF,
  PackageType.LANDING_PAGE,
  PackageType.COMBO,
];
