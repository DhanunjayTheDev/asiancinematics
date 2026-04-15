export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'super_admin' | 'support' | 'freelancer' | 'employee';
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Address {
  _id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: Category;
  isActive: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  category: Category;
  images: string[];
  stock: number;
  sku?: string;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  specifications?: Record<string, string>;
  createdAt: string;
}

export interface OrderItem {
  product: string | Product;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string | User;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'COD' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  assignedTo?: User;
  notes?: string;
  cancelReason?: string;
  createdAt: string;
}

export interface Service {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  icon?: string;
  image?: string;
  price?: number;
  isActive: boolean;
}

export interface ServiceTicket {
  _id: string;
  ticketNumber: string;
  user: string | User;
  service?: Service;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: User;
  comments: { _id: string; user: User; message: string; createdAt: string }[];
  attachments: string[];
  createdAt: string;
}

export interface SiteVisit {
  _id: string;
  date: string;
  timeSlot: string;
  location: { address: string; city: string; state: string; pincode: string };
  purpose: string;
  notes?: string;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo?: User;
  createdAt: string;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
