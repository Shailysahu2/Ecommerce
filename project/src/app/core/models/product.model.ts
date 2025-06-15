export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  sku: string;
  price: number;
  salePrice?: number;
  images: ProductImage[];
  category: Category;
  brand: Brand;
  tags: string[];
  attributes: ProductAttribute[];
  variants: ProductVariant[];
  inventory: ProductInventory;
  seo: ProductSEO;
  ratings: ProductRatings;
  reviews: Review[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
  isActive: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  isActive: boolean;
}

export interface ProductAttribute {
  name: string;
  value: string;
  type: 'text' | 'number' | 'boolean' | 'select';
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  salePrice?: number;
  attributes: { [key: string]: string };
  inventory: ProductInventory;
  images: ProductImage[];
}

export interface ProductInventory {
  quantity: number;
  lowStockThreshold: number;
  trackQuantity: boolean;
  allowBackorder: boolean;
  status: 'in_stock' | 'out_of_stock' | 'low_stock' | 'discontinued';
}

export interface ProductSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  slug: string;
}

export interface ProductRatings {
  average: number;
  count: number;
  distribution: { [key: number]: number };
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerified: boolean;
  sentiment?: 'positive' | 'neutral' | 'negative';
  helpfulCount: number;
  createdAt: Date;
}

export interface ProductFilter {
  categories?: string[];
  brands?: string[];
  priceRange?: { min: number; max: number };
  rating?: number;
  inStock?: boolean;
  onSale?: boolean;
  search?: string;
  sortBy?: 'name' | 'price' | 'rating' | 'newest' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}