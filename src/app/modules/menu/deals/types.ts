export interface ProductSelection {
  productId: string;
  name: string;
  priceContribution: number;
  allowAddOns: boolean;
  sequence: number;
}

export interface SelectionSection {
  id: string;
  name: string;
  instructions: string;
  priceContribution: number;
  minSelection: number;
  maxSelection: number;
  items: ProductSelection[];
}

export interface Deal {
  id: string;
  name: string;
  displayName: string;
  description: string;
  price: number;
  category: string;
  subCategory: string;
  mainBranch: string;
  status: 'Active' | 'Inactive';
  showInPOSOnly: boolean;
  orderTypes: string[];
  isTimeSpecific: boolean;
  showOnMobile: boolean;
  showOnWeb: boolean;
  image?: string;
  products: ProductSelection[];
  selectionSections: SelectionSection[];
}
