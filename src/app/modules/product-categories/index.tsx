import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useRouter } from 'next/router';
import { ReusableModal } from '../../../components/ReusableModal';
import { DeleteConfirmModal } from '../../../components/DeleteConfirmModal';
import { CategoryTable } from './table/table';
import { AddCategoryForm, EditCategoryForm, ViewCategoryDetails } from './form';
import { Category } from './types';

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
          
          console.log('✅ Product deleted successfully:', selectedCategory.id);
        } catch (error) {
          console.error('❌ Failed to delete product:', error);
        }
      }
    }
    
    setDeleteModalOpen(false);
  };

  const handleBulkDiscount = () => {
    console.log('Bulk discount clicked');
  };

  const handleSortCategories = () => {
    console.log('Sort categories clicked');
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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Title and Search */}
        <div className="flex items-center gap-4 flex-1">
          <div>
            <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Product Categories
            </h1>
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                  : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
              }`}
            />
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleBulkDiscount}
            className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              isDarkMode
                ? 'bg-orange-500 text-white hover:bg-orange-700'
                : 'bg-orange-500 text-white hover:bg-orange-700'
            } shadow-sm hover:shadow-md`}
          >
            Bulk Discount
          </button>
          <button
            onClick={handleSortCategories}
            className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              isDarkMode
                ? 'bg-orange-500 text-white hover:bg-orange-700'
                : 'bg-orange-500 text-white hover:bg-orange-700'
            } shadow-sm hover:shadow-md`}
          >
            Sort Categories
          </button>
          <button
            onClick={() => router.push('/product-categories/add')}
            className={`px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all ${
              isDarkMode
                ? 'bg-orange-500 text-white hover:bg-orange-700'
                : 'bg-orange-500 text-white hover:bg-orange-700'
            } shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40`}
          >
            <Plus size={18} />
            Add Category
          </button>
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
        size="md"
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
