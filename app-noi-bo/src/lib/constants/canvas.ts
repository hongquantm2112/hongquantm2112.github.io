import { NodeType } from "@/generated/prisma/enums";

export const NODE_TYPE_LABELS: Record<NodeType, string> = {
  CUSTOMER_INFO: "Thông tin khách hàng",
  EXPERIENCE: "Kinh nghiệm",
  THEME: "Theme portfolio",
  DESIGN_REQUEST: "Request thiết kế",
  CONTENT_REVIEW: "Xác nhận nội dung",
  PRODUCT: "Sản phẩm",
};

export const NODE_TYPE_OPTIONS: NodeType[] = [
  NodeType.CUSTOMER_INFO,
  NodeType.EXPERIENCE,
  NodeType.THEME,
  NodeType.DESIGN_REQUEST,
  NodeType.CONTENT_REVIEW,
  NodeType.PRODUCT,
];

export interface ThemeOption {
  id: string;
  name: string;
  description: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  { id: "minimal", name: "Minimal", description: "Tối giản, nhiều khoảng trắng, tập trung vào nội dung" },
  { id: "corporate", name: "Corporate", description: "Chuyên nghiệp, chỉn chu, phù hợp môi trường doanh nghiệp" },
  { id: "creative", name: "Creative", description: "Phá cách, nổi bật, nhấn mạnh yếu tố sáng tạo" },
];
