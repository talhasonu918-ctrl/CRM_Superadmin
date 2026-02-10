import React, { useState } from 'react';
import { Search, Plus, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import { ReusableModal } from '../../../components/ReusableModal';
import { DeleteConfirmModal } from '../../../components/DeleteConfirmModal';
import { CategoryTable } from './table/table';
import { AddCategoryForm, EditCategoryForm, ViewCategoryDetails } from './form';
import { Category } from './types';
import { showToast } from './utils/toastUtils';

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
  const [selectedCategory, setSelectedCategory] = useState<Partial<Category>>({});
  const [isSortedByNewest, setIsSortedByNewest] = useState(false);

  const handleAddCategory = (data: Partial<Category>) => {
    console.log('Add category:', data);
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
          showToast(`"${selectedCategory.categoryName}" deleted successfully!`, '🗑️');
        } catch (error) {
          console.error('❌ Failed to delete product:', error);
        }
      }
    }

    setDeleteModalOpen(false);
  };

  const handleBulkDiscount = () => {
    showToast('Bulk Discount feature is coming soon!', '🏷️');
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
              onClick={() => router.push('/menu')}
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
                ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
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
              className="w-full lg:w-auto rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-700 shadow-sm hover:shadow-md"
            >
              Bulk Discount
            </button>

            {/* Sort Categories */}
            <button
              onClick={handleSortCategories}
              className="w-full lg:w-auto rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-700 shadow-sm hover:shadow-md"
            >
              Sort Categories {isSortedByNewest ? '(Newest)' : ''}
            </button>

            {/* Add Category */}
            <button
              onClick={() => router.push('/product-categories/add')}
              className="w-full lg:w-auto flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-700 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40"
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
        title="Add New Category"
        size="md"
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
    </div>
  );
};
