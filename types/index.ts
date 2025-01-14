// Product related types
export type Product = {
  id: number;
  name: string;
  tagline: string;
  description: string;
  sku: string;
  price: number;
  image_url: string;
  category_id: number | null;
  updated_at: string;
  updated_by: string;
};

export type ProductFormData = Omit<Product, "id" | "updated_at" | "updated_by">;

// Category related types
export type Category = {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
};

export type CategoryFormData = Omit<
  Category,
  "id" | "created_at" | "updated_at"
>;

// Customer Segment related types
export type CustomerSegment = {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
};

export type CustomerSegmentFormData = Omit<
  CustomerSegment,
  "id" | "created_at" | "updated_at"
>;

// Customer related types
export type Customer = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  segments: CustomerSegment[];
};

export type CustomerFormData = {
  name: string;
  email: string;
  segment_ids: number[];
};

// List view types
export type ProductListItem = Pick<
  Product,
  "id" | "name" | "tagline" | "sku" | "price" | "image_url" | "updated_at"
>;

export type CategoryListItem = Pick<
  Category,
  "id" | "name" | "slug" | "updated_at"
>;

export type CustomerSegmentListItem = Pick<
  CustomerSegment,
  "id" | "name" | "slug" | "created_at"
>;

export type CustomerListItem = {
  id: number;
  name: string;
  email: string;
  segment_names: string | null;
  created_at: string;
};

// Form props types
export type ProductFormProps = {
  product?: Product;
  categories: Category[];
};

export type CategoryFormProps = {
  category?: Category;
};

export type CustomerSegmentFormProps = {
  segment?: CustomerSegment;
};

export type CustomerFormProps = {
  customer?: Customer;
  segments: CustomerSegment[];
};

export type CustomerListProps = {
  customers: CustomerListItem[];
};

// Page params types
export type ProductPageParams = {
  sku: string;
};

export type CategoryPageParams = {
  slug: string;
};

export type EditPageParams = {
  id: string;
};

// Filter and sort types
export type ProductFilterParams = {
  minPrice?: string;
  maxPrice?: string;
  sortBy?: "price_asc" | "price_desc" | "name_asc" | "name_desc";
};

// Server action result types
export type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
