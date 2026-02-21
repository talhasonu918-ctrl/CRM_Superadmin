export interface ProductVariant {
  id: string;
  name: string;
  display: string;
  instructions: string;
  options: {
    small: boolean;
    medium: boolean;
    large: boolean;
  };
}

export interface ProductAddOn {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  barCode: string;
  genericName: string;
  description: string;
  showOnPos: boolean;
  pctCode: string;
  category: string;
  subCategory: string;
  racks: string;
  supplier: string;
  manufacturer: string;
  productType: string;
  assignedBranches: string;
  isAutoReady: boolean;
  price: number;
  image: string;
  available: boolean;
  rating: number;
  stock: number;
  // Mobile/Web Configuration
  summary: string;
  detailDescription: string;
  showInMobileApp: boolean;
  showInWebApp: boolean;
  mobileImage: string;
  webImage: string;
  // Product Variants
  variants: ProductVariant[];
  // Product Add-Ons
  addOns: ProductAddOn[];
}
