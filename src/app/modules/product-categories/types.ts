export interface Category {
  id: string;
  categoryName: string;
  subCategories: string;
  createdAt: string;
  productImage?: string;
}

// Load categories from localStorage products
const loadCategoriesFromProducts = (): Category[] => {
  if (typeof window === 'undefined') {
    console.log('⚠️ Window is undefined');
    return [];
  }
  const productsStr = localStorage.getItem('products_list');
  console.log('📦 Raw localStorage products_list:', productsStr);

  if (!productsStr) {
    console.log('⚠️ No products found in localStorage');
    return [];
  }

  try {
    const products = JSON.parse(productsStr);
    console.log('✅ Parsed products from localStorage:', products);

    const categories = products.map((product: any) => ({
      id: product.id,
      categoryName: product.name || 'Unnamed Product',
      subCategories: product.subCategory || product.category || 'N/A',
      createdAt: product.createdAt || new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      productImage: product.productImage || product.mobileImage || product.webImage || 'https://via.placeholder.com/40',
    }));

    console.log('✅ Mapped categories:', categories);
    return categories;
  } catch (error) {
    console.error('❌ Failed to load products:', error);
    return [];
  }
};

export const mockCategories: Category[] = [];

export const getCategories = (): Category[] => {
  return loadCategoriesFromProducts();
};
