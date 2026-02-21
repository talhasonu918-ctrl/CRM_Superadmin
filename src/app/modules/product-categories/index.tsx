import React, { useState } from 'react';
import { Search, Plus, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import { ReusableModal } from '../../../components/ReusableModal';
import { DeleteConfirmModal } from '../../../components/DeleteConfirmModal';
import { CategoryTable } from './table/table';
import { AddCategoryForm, EditCategoryForm, ViewCategoryDetails, BulkDiscountForm } from './form';
import { Category } from './types';
import notify from '../../../utils/toast';

interface ProductCategoriesViewProps {
  isDarkMode: boolean;
}

export const ProductCategoriesView: React.FC<ProductCategoriesViewProps> = ({ isDarkMode }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bulkDiscountModalOpen, setBulkDiscountModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Partial<Category>>({});
  const [isSortedByNewest, setIsSortedByNewest] = useState(false);

  const handleAddCategory = (data: Partial<Category>) => {
    console.log('Add category:', data);

    // Generate unique ID
    const newCategory = {
      id: Date.now().toString(),
      categoryName: data.categoryName || '',
      subCategories: data.subCategories || '',
      createdAt: new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      productImage: data.productImage || 'https://via.placeholder.com/40',
      preparationTime: (data as any).preparationTime || '',
      branches: (data as any).branches || '',
      hsCode: (data as any).hsCode || '',
      showOnMobile: (data as any).showOnMobile || false,
      showOnWeb: (data as any).showOnWeb || false,
      showOnPOS: (data as any).showOnPOS || false,
    };

    // Get existing products from localStorage
    const productsStr = localStorage.getItem('products_list');
    let products = [];

    if (productsStr) {
      try {
        products = JSON.parse(productsStr);
      } catch (error) {
        console.error('Failed to parse products:', error);
        products = [];
      }
    }

    // Add new category to the beginning of the array
    products.unshift({
      id: newCategory.id,
      name: newCategory.categoryName,
      category: newCategory.categoryName,
      subCategory: newCategory.subCategories,
      createdAt: newCategory.createdAt,
      productImage: newCategory.productImage,
      mobileImage: newCategory.productImage,
      webImage: newCategory.productImage,
      preparationTime: newCategory.preparationTime,
      branches: newCategory.branches,
      hsCode: newCategory.hsCode,
      showOnMobile: newCategory.showOnMobile,
      showOnWeb: newCategory.showOnWeb,
      showOnPOS: newCategory.showOnPOS,
    });

    // Save to localStorage
    localStorage.setItem('products_list', JSON.stringify(products));

    // Trigger refresh event for table
    window.dispatchEvent(new Event('refreshCategories'));

    // Show success toast
    notify.success(`"${newCategory.categoryName}" added successfully!`, { icon: '✅' });

    setAddModalOpen(false);
  };
  const handleEditCategory = (data: Partial<Category>) => {
    console.log('Edit category:', data);
    setEditModalOpen(false);
  };

  const handleDeleteCategory = () => {
    if (selectedCategory.id) {
      // Get products from localStorage
      const productsStr = localStorage.getItem('products_list');

      if (productsStr) {
        try {
          const products = JSON.parse(productsStr);

          // Filter out the deleted product
          const updatedProducts = products.filter(
            (product: any) => product.id !== selectedCategory.id
          );

          // Save back to localStorage
          localStorage.setItem('products_list', JSON.stringify(updatedProducts));

          // Trigger refresh event for table
          window.dispatchEvent(new Event('refreshCategories'));

          window.dispatchEvent(new Event('refreshCategories'));

          console.log('✅ Product deleted successfully:', selectedCategory.id);
          notify.success(`"${selectedCategory.categoryName}" deleted successfully!`, { icon: '🗑️' });
        } catch (error) {
          console.error('❌ Failed to delete product:', error);
        }
      }
    }

    setDeleteModalOpen(false);
  };

  const handleBulkDiscount = () => {
    setBulkDiscountModalOpen(true);
  };

  const handleApplyBulkDiscount = (selectedProducts: string[], discount: number) => {
    // Get products from localStorage
    const productsStr = localStorage.getItem('products_list');

    if (productsStr) {
      try {
        const products = JSON.parse(productsStr);

        // Apply discount to selected products
        const updatedProducts = products.map((product: any) => {
          if (selectedProducts.includes(product.id)) {
            return { ...product, discount };
          }
          return product;
        });

        // Save back to localStorage
        localStorage.setItem('products_list', JSON.stringify(updatedProducts));

        // Trigger refresh event for table
        window.dispatchEvent(new Event('refreshCategories'));

        // Show success toast
        notify.success(`Discount of ${discount}% applied to ${selectedProducts.length} product(s)!`, { icon: '🏷️' });
      } catch (error) {
        console.error('Failed to apply discount:', error);
        notify.error('Failed to apply discount', { icon: '❌' });
      }
    }

    setBulkDiscountModalOpen(false);
  };

  const handleSortCategories = () => {
    setIsSortedByNewest(!isSortedByNewest);
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  const openViewModal = (category: Category) => {
    setSelectedCategory(category);
    setViewModalOpen(true);
  };

  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* LEFT: Title + Search */}
        <div className="flex w-full flex-col gap-4 md:flex-row md:items-center lg:flex-1">

          {/* Title */}
          <div className="flex items-center gap-2 px-3 md:px-0 pt-3 md:pt-0">
            <button
              onClick={() => {
                // Go back to /menu or /[company]/menu if company param exists
                const company = router.query.company as string | undefined;
                if (company) {
                  router.push(`/${company}/menu`);
                } else {
                  router.push('/menu');
                }
              }}
              className={`p-1.5 rounded-lg transition-all ${isDarkMode
                ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
            >
              <ArrowLeft size={24} />
            </button>
            <h1
              className={`text-xl md:text-2xl font-bold tracking-tight whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
            >
              Product Categories
            </h1>
          </div>

          {/* Search */}
          <div className="relative w-full px-3 md:px-0 md:max-w-sm">
            <Search
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'
                }`}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm outline-none transition-all ${isDarkMode
                ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20'
                : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20'
                }`}
            />
          </div>
        </div>

        {/* RIGHT: ACTION BUTTONS */}
        <div className="w-full lg:w-auto px-3 md:px-0">
          <div
            className="
        grid grid-cols-1
        sm:grid-cols-2
        lg:flex lg:flex-row
        gap-3
        w-full
      "
          >
            {/* Bulk Discount */}
            <button
              onClick={handleBulkDiscount}
              className="w-full lg:w-auto rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/10 shadow-sm hover:shadow-md"
            >
              Bulk Discount
            </button>

            {/* Sort Categories */}
            <button
              onClick={handleSortCategories}
              className="w-full lg:w-auto rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/10 shadow-sm hover:shadow-md"
            >
              Sort Categories {isSortedByNewest ? '(Newest)' : ''}
            </button>

            {/* Add Category */}
            <button
              onClick={() => setAddModalOpen(true)}
              className="w-full lg:w-auto flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/10 shadow-lg shadow-primary/30 hover:shadow-primary/40"
            >
              <Plus size={18} />
              Add Category
            </button>
          </div>
        </div>
      </div>
      {/* Table Section */}
      <CategoryTable
        isDarkMode={isDarkMode}
        onAddCategory={() => setAddModalOpen(true)}
        onEditCategory={openEditModal}
        onViewCategory={openViewModal}
        onDeleteCategory={openDeleteModal}
        onBulkDiscount={handleBulkDiscount}
        onSortCategories={handleSortCategories}
        isSortedByNewest={isSortedByNewest}
        searchTerm={searchTerm}
      />

      {/* Add Category Modal */}
      <ReusableModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Category"
        size="xl"
      >
        <AddCategoryForm
          onSubmit={handleAddCategory}
          onCancel={() => setAddModalOpen(false)}
          isDarkMode={isDarkMode}
        />
      </ReusableModal>

      {/* Edit Category Modal */}
      <ReusableModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Category"
        size="md"
      >
        <EditCategoryForm
          initialData={selectedCategory}
          onSubmit={handleEditCategory}
          onCancel={() => setEditModalOpen(false)}
          isDarkMode={isDarkMode}
        />
      </ReusableModal>

      {/* View Category Modal */}
      <ReusableModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Category Details"
        size="lg"
      >
        <ViewCategoryDetails
          category={selectedCategory}
          isDarkMode={isDarkMode}
        />
      </ReusableModal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteCategory}
        onCancel={() => setDeleteModalOpen(false)}
        title="Delete Category"
        message={`Are you sure you want to delete "${selectedCategory.categoryName}"? This action cannot be undone.`}
      />

      {/* Bulk Discount Modal */}
      <ReusableModal
        isOpen={bulkDiscountModalOpen}
        onClose={() => setBulkDiscountModalOpen(false)}
        title="Bulk Discount"
        size="xl"
      >
        <BulkDiscountForm
          onSubmit={handleApplyBulkDiscount}
          onCancel={() => setBulkDiscountModalOpen(false)}
          isDarkMode={isDarkMode}
        />
      </ReusableModal>
    </div>
  );
};