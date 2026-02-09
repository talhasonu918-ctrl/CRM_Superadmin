// Product Management Types
export interface ProductVariantOption {
  id: string;
  name: string;
  price?: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  displayName: string;
  instructions?: string;
  minimumSelection: number;
  maximumSelection: number;
  options: ProductVariantOption[];
}

export interface ProductAddonOption {
  id: string;
  name: string;
  price?: number;
}

export interface ProductAddon {
  id: string;
  name: string;
  displayName: string;
  instructions?: string;
  minimumSelection: number;
  maximumSelection: number;
  options: ProductAddonOption[];
}

export interface BranchPricing {
  branchId: string;
  branchName: string;
  costPrice: number;
  meanPrice: number;
  retailPrice: number;
  salePrice: number;
  discount: number;
  discountType: 'Value' | 'Percentage';
  salesTax: number;
  salesTaxType: 'Value' | 'Percentage';
  grossMargin: number;
}

export interface VariantPricing {
  variantName: string;
  costPrice: number;
  retailPrice: number;
}

export interface Product {
  id: string;
  name: string;
  barCode?: string;
  genericName?: string;
  description?: string;
  pctCode?: string;
  category: string;
  subCategory: string;
  racks?: string;
  productType: string;
  assignedBranches: string[];
  supplier?: string;
  manufacturer?: string;
  showOnPos: boolean;
  isAutoReady: boolean;
  
  // Images
  productImage?: string;
  mobileImage?: string;
  webImage?: string;
  
  // Mobile/Web Config
  showInMobileApp: boolean;
  showInWebApp: boolean;
  summary?: string;
  detailDescription?: string;
  
  // Variants & Addons
  variants: ProductVariant[];
  addons: ProductAddon[];
  
  // Pricing
  branchPricing: BranchPricing[];
  variantPricing: VariantPricing[];
  
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData extends Partial<Product> {
  currentTab?: number;
}
