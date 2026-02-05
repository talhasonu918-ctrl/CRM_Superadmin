import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Search, Plus } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'rizzui';
import InfiniteTable from '../../../../components/InfiniteTable';
import { SearchInput } from '../../../../components/SearchInput';
import { useInfiniteTable } from '../../../../hooks/useInfiniteTable';
import { Category, getCategories } from '../types';
import { categoryColumns } from './columns';
import { getThemeColors } from '../../../../theme/colors';

interface CategoryTableProps {
  isDarkMode: boolean;
  onAddCategory?: () => void;
  onEditCategory?: (category: Category) => void;
  onViewCategory?: (category: Category) => void;
  onDeleteCategory?: (category: Category) => void;
  onBulkDiscount?: () => void;
  onSortCategories?: () => void;
  searchTerm?: string;
}

// Generate more mock categories for pagination
const generateMockCategories = (count: number, baseLength: number): Category[] => {
  const categories: Category[] = [];

  //   for (let i = 0; i < count; i++) {
  //     const num = baseLength + i + 1;
  //     categories.push({
  //       id: String(7848 - i),
  //       categoryName: `Category ${num}`,
  //       subCategories: `Sub Category ${num}`,
  //       createdAt: new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
  //     });
  //   }
  return categories;
};

const loadMoreCategories = async (currentLength: number): Promise<Category[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockCategories(10, currentLength));
    }, 500);
  });
};

export const CategoryTable: React.FC<CategoryTableProps> = ({
  isDarkMode,
  onAddCategory,
  onEditCategory,
  onViewCategory,
  onDeleteCategory,
  onBulkDiscount,
  onSortCategories,
  searchTerm = ''
}) => {
  const theme = getThemeColors(isDarkMode);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const loadData = useCallback(() => {
    console.log('🔄 Loading categories...');
    setIsLoadingData(true);
    const loadedCategories = getCategories();
    console.log('📊 Loaded categories data:', loadedCategories);
    setCategories(loadedCategories);
    setIsLoadingData(false);
    console.log('✅ Categories loaded and state updated.');
  }, []);

  useEffect(() => {
    loadData();

    // Refresh data when the window gets focus or when a manual refresh is triggered.
    window.addEventListener('focus', loadData);
    window.addEventListener('refreshCategories', loadData);

    return () => {
      window.removeEventListener('focus', loadData);
      window.removeEventListener('refreshCategories', loadData);
    };
  }, [loadData]);

  const columns = useMemo(
    () => categoryColumns({ onEdit: onEditCategory, onView: onViewCategory, onDelete: onDeleteCategory, isDarkMode }),
    [onEditCategory, onViewCategory, onDeleteCategory, isDarkMode]
  );

  const {
    table,
    isLoading: isTableLoading,
    hasNextPage,
    loadMore,
  } = useInfiniteTable<Category>({
    columns,
    data: categories, // Pass the state directly to the 'data' prop
    pageSize: 11,
    onLoadMore: () => loadMoreCategories(categories.length),
  });

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!table.getRowModel) return [];

    let filtered = table.getRowModel().rows;

    if (searchTerm) {
      filtered = filtered.filter((row: any) => {
        const category = row.original;
        const search = searchTerm.toLowerCase();
        return (
          category.categoryName.toLowerCase().includes(search) ||
          category.subCategories.toLowerCase().includes(search) ||
          category.id.includes(search)
        );
      });
    }

    return filtered;
  }, [table.getRowModel, searchTerm]);

  if (isLoadingData && categories.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500">Loading Categories...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <InfiniteTable
        isLoading={isTableLoading}
        table={table}
        total={filteredData.length}
        isDarkMode={isDarkMode}
        hasNextPage={hasNextPage}
        onLoadMore={loadMore}
        noDataMessage="No categories found. Try adding a new one."
      />

      {/* Record Count Footer */}
      {/* <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between">
          <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Showing <span className="font-semibold">{filteredData.length}</span> of <span className="font-semibold">{categories.length}</span> products
          </span>

          <div className="flex items-center gap-2">
            <button
              className={`p-1.5 rounded transition-colors ${isDarkMode
                ? 'hover:bg-slate-800 text-slate-500 hover:text-slate-300'
                : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'
                }`}
              disabled
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              className={`p-1.5 rounded transition-colors ${isDarkMode
                ? 'hover:bg-slate-800 text-slate-500 hover:text-slate-300'
                : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'
                }`}
              disabled
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
};
