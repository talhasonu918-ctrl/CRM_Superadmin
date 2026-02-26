// 'use client';

// import React from 'react';
// import { Search, Plus, Calendar, LayoutGrid, List } from 'lucide-react';
// import { ExportButton } from '@/src/components/ExportButton';
// import type { InventoryItem } from '@/src/app/modules/pos/mockData';

// interface InventoryFormProps {
//   isDarkMode: boolean;
//   search: string;
//   onSearchChange: (v: string) => void;
//   onAddClick: () => void;
//   filteredData: InventoryItem[];
//   startDate: string;
//   onStartDateChange: (v: string) => void;
//   endDate: string;
//   onEndDateChange: (v: string) => void;
//   viewType: 'grid' | 'list';
//   onViewTypeChange: (type: 'grid' | 'list') => void;
// }

// export const InventoryForm: React.FC<InventoryFormProps> = ({
//   isDarkMode,
//   search,
//   onSearchChange,
//   onAddClick,
//   filteredData,
//   startDate,
//   onStartDateChange,
//   endDate,
//   onEndDateChange,
//   viewType,
//   onViewTypeChange,
// }) => {
//   return (
//     <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800">
//       <div className="text-base sm:text-lg font-bold">Product List</div>
      
//       <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full lg:w-auto">
//         {/* Date Range Group */}
//         <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
//           <div className="relative flex-1 sm:flex-initial">
//             <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => onStartDateChange(e.target.value)}
//               className={`pl-8 pr-2 py-2 rounded-lg text-[10px] sm:text-xs outline-none transition-all w-full sm:w-[130px] ${
//                 isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-orange-500'
//               } border`}
//             />
//           </div>
//           <span className="text-slate-400 text-[10px] sm:text-xs font-bold px-1">To</span>
//           <div className="relative flex-1 sm:flex-initial">
//             <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => onEndDateChange(e.target.value)}
//               className={`pl-8 pr-2 py-2 rounded-lg text-[10px] sm:text-xs outline-none transition-all w-full sm:w-[130px] ${
//                 isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-orange-500'
//               } border`}
//             />
//           </div>
//         </div>

//         <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
//           <div className="relative flex-1 sm:flex-initial">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//             <input
//               type="text"
//               placeholder="Search product..."
//               value={search}
//               onChange={(e) => onSearchChange(e.target.value)}
//               className={`w-full sm:min-w-[180px] lg:min-w-[200px] pl-9 pr-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm outline-none transition-all ${
//                 isDarkMode 
//                   ? 'bg-slate-800 border border-slate-700 text-white' 
//                   : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-orange-500 text-slate-900'
//               }`}
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             {/* View Switcher */}
//             <div className={`hidden sm:flex items-center p-1 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
//               <button
//                 onClick={() => onViewTypeChange('list')}
//                 className={`p-1.5 rounded-md transition-all ${viewType === 'list' 
//                   ? (isDarkMode ? 'bg-slate-700 text-primary shadow-sm' : 'bg-white text-primary shadow-sm') 
//                   : 'text-slate-400 hover:text-slate-600'}`}
//                 title="List View"
//               >
//                 <List size={18} />
//               </button>
//               <button
//                 onClick={() => onViewTypeChange('grid')}
//                 className={`p-1.5 rounded-md transition-all ${viewType === 'grid' 
//                   ? (isDarkMode ? 'bg-slate-700 text-primary shadow-sm' : 'bg-white text-primary shadow-sm') 
//                   : 'text-slate-400 hover:text-slate-600'}`}
//                 title="Grid View"
//               >
//                 <LayoutGrid size={18} />
//               </button>
//             </div>

//             <ExportButton
//               filename="Inventory_Report"
//               title="Inventory Management Report"
//               isDarkMode={isDarkMode}
//               headers={['Product Name', 'Category', 'Stock', 'Min Stock', 'Price', 'SalesCount', 'Status', 'Last Updated']}
//               data={filteredData.map(item => [
//                 item.name,
//                 item.category,
//                 item.stock,
//                 item.minStock,
//                 item.price,
//                 item.salesCount || 0,
//                 item.status,
//                 item.lastUpdated || '-'
//               ])}
//             />
//             <button
//               onClick={onAddClick}
//               className="bg-primary text-white p-2 px-2 py-1.5  sm:px-4 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all whitespace-nowrap"
//             >
//               <Plus className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ml-1 opacity-70"  /> <span className="hidden sm:inline">Add Product</span><span className="sm:hidden text-[10px]">Add</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InventoryForm;

