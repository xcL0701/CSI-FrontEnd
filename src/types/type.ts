export interface Like {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  desc: string;
  thumbnail: string;
  machine: Machine;
  model_3d: string;
  product_photos: Photo[];
  likes?: Like[];
}

interface Photo {
  id: number;
  photo: string;
}

export interface Machine {
  id: number;
  name: string;
  slug: string;
  photo: string;
  products: Product[];
}
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: "customer" | "admin";
}

export interface CartItems {
  id: number;
  product: Product;
  quantity: number;
}

export interface Cart {
  id: number;
  user_id: number;
  shipping_method?: "pickup" | "delivery";
  items: CartItems[];
}

// Order Item (tiap produk dalam order)
interface MinimalProduct {
  id: number;
  name: string;
  thumbnail: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product: MinimalProduct;
  unit_price: number;
  quantity: number;
  total_price: number;
}

// Order utama
export interface Order {
  id: string;
  user_id: number;
  shipping_method: "pickup" | "delivery";
  total_price: number;
  shipping_cost: number;
  initial_payment?: number;
  total_paid: number;
  calculated_total_paid: number; // ✅ tambahkan ini
  status: "pending" | "paid" | "installment" | "canceled";
  address: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  link?: {
    token: string;
  };
  payments?: Payment[];
}
export interface Payment {
  id: number;
  order_id: string;
  amount: number;
  proof: string;
  status: "pending" | "approved" | "rejected";
  paid_at?: string;
}
