export type PackageType = "PDF" | "Landing Page" | "Combo";

export type CustomerStatus =
  | "Moi lien he"
  | "Dang lam"
  | "Cho khach duyet"
  | "Da giao"
  | "Da thanh toan"
  | "Huy";

export type NodeType =
  | "customer_info"
  | "experience"
  | "theme"
  | "design_request"
  | "content_review"
  | "product";

export type NodeStatus = "idle" | "running" | "done" | "error" | "waiting_review";

export interface Customer {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  industry: string | null;
  source: string | null;
  package: PackageType | null;
  status: CustomerStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  customer_id: string | null;
  name: string;
  package: PackageType;
  created_at: string;
  updated_at: string;
}

export interface CanvasNode {
  id: string;
  project_id: string;
  node_type: NodeType;
  position_x: number;
  position_y: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input_data: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  output_data: Record<string, any>;
  status: NodeStatus;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface CanvasEdge {
  id: string;
  project_id: string;
  source_node_id: string;
  target_node_id: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: Customer;
        Insert: Partial<Customer> & { full_name: string };
        Update: Partial<Customer>;
      };
      projects: {
        Row: Project;
        Insert: Partial<Project> & { name: string; package: PackageType };
        Update: Partial<Project>;
      };
      canvas_nodes: {
        Row: CanvasNode;
        Insert: Partial<CanvasNode> & { project_id: string; node_type: NodeType };
        Update: Partial<CanvasNode>;
      };
      canvas_edges: {
        Row: CanvasEdge;
        Insert: Partial<CanvasEdge> & {
          project_id: string;
          source_node_id: string;
          target_node_id: string;
        };
        Update: Partial<CanvasEdge>;
      };
    };
  };
}
