import React, { useState, useEffect, useMemo } from 'react';
import { FiEdit, FiEye, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import { Search, List, LayoutGrid } from 'lucide-react';
import { useBranding } from '../../../contexts/BrandingContext';
import InfiniteTable from '../../../components/InfiniteTable';
import { useInfiniteTable } from '../../../hooks/useInfiniteTable';
import { ColumnDef } from '@tanstack/react-table';
import { CustomMultiSelect, CustomSelectOption } from '../../../components/CustomMultiSelect';

interface KDSProfile {
  id: string;
  name: string;
  subCategories: string[];
  orderTypes: string[];
  users: string[];
  createdAt: number;
}

interface KDSManagementProps {
  isDarkMode?: boolean;
  onViewKDS?: (profile: KDSProfile) => void;
}

interface KDSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: Omit<KDSProfile, 'id' | 'createdAt'>) => void;
  editProfile?: KDSProfile;
  isDarkMode?: boolean;
  isViewOnly?: boolean;
}

const KDSModal: React.FC<KDSModalProps> = ({ isOpen, onClose, onSave, editProfile, isDarkMode = false, isViewOnly = false }) => {
  const [kdsName, setKdsName] = useState('');
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [selectedOrderTypes, setSelectedOrderTypes] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Available options mapped to CustomSelectOption format
  const subCategoryOptions: CustomSelectOption[] = [
    { value: 'PIZZA-TRADITIONAL', label: 'PIZZA-TRADITIONAL' },
    { value: 'PIZZA-SPECIAL', label: 'PIZZA-SPECIAL' },
    { value: 'BURGER', label: 'BURGER' },
    { value: 'Fries & Nuggets-WINGS', label: 'Fries & Nuggets-WINGS' },
    { value: 'Fries & Nuggets-FRIES', label: 'Fries & Nuggets-FRIES' },
    { value: 'BROAST', label: 'BROAST' },
    { value: 'WRAPS', label: 'WRAPS' },
    { value: 'ROLL & SANDWICHES', label: 'ROLL & SANDWICHES' },
    { value: 'DEALS', label: 'DEALS' },
    { value: 'PASTA', label: 'PASTA' },
    { value: 'Inventory', label: 'Inventory' },
    { value: 'Sauces', label: 'Sauces' },
    { value: 'DRINKS-BEVERAGES', label: 'DRINKS-BEVERAGES' }
  ];

  const orderTypeOptions: CustomSelectOption[] = [
    { value: 'DineIn', label: 'DineIn' },
    { value: 'TakeAway', label: 'TakeAway' },
    { value: 'Delivery', label: 'Delivery' }
  ];

  const userOptions: CustomSelectOption[] = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Chef', label: 'Chef' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Kitchen Staff', label: 'Kitchen Staff' }
  ];

  useEffect(() => {
    if (editProfile) {
      setKdsName(editProfile.name);
      setSelectedSubCategories(editProfile.subCategories);
      setSelectedOrderTypes(editProfile.orderTypes);
      setSelectedUsers(editProfile.users);
    } else {
      setKdsName('');
      setSelectedSubCategories([]);
      setSelectedOrderTypes([]);
      setSelectedUsers([]);
    }
  }, [editProfile, isOpen]);

  const handleSave = () => {
    if (isViewOnly) return;
    if (!kdsName.trim()) {
      alert('Please enter KDS name');
      return;
    }

    onSave({
      name: kdsName,
      subCategories: selectedSubCategories,
      orderTypes: selectedOrderTypes,
      users: selectedUsers
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} scrollbar-hidden`}>
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all z-10 ${isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
        >
          <FiX className="w-6 h-6" />
        </button>

        <div className="p-4 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-primary px-8">
            {isViewOnly ? 'View KDS Profile' : (editProfile ? 'Edit KDS Profile' : 'Add New KDS Profile')}
          </h2>

          {/* Basic Information */}
          <div className="mb-8">
            <h3 className={`text-base sm:text-lg font-semibold mb-4 pb-2 border-b ${isDarkMode ? 'text-gray-200 border-gray-700' : 'text-gray-700 border-gray-100'}`}>
              Basic Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  KDS Name 
                </label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={kdsName}
                  onChange={(e) => setKdsName(e.target.value)}
                  placeholder="Enter KDS name"
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm ${isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                />
              </div>
            </div>
          </div>

          {/* Filtering Options */}
          <div className="mb-8 space-y-6">
            <h3 className={`text-base sm:text-lg font-semibold mb-2 pb-2 border-b ${isDarkMode ? 'text-gray-200 border-gray-700' : 'text-gray-700 border-gray-100'}`}>
              Filtering Options
            </h3>

            <div className="space-y-4">
              <CustomMultiSelect
                label="Select Sub Categories"
                options={subCategoryOptions}
                value={selectedSubCategories}
                onChange={setSelectedSubCategories}
                isDarkMode={isDarkMode}
                isDisabled={isViewOnly}
                placeholder="Search sub categories..."
              />

              <CustomMultiSelect
                label="Select Order Types"
                options={orderTypeOptions}
                value={selectedOrderTypes}
                onChange={setSelectedOrderTypes}
                isDarkMode={isDarkMode}
                isDisabled={isViewOnly}
                placeholder="Search order types..."
              />

              <CustomMultiSelect
                label="Select Users"
                options={userOptions}
                value={selectedUsers}
                onChange={setSelectedUsers}
                isDarkMode={isDarkMode}
                isDisabled={isViewOnly}
                placeholder="Search users..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
            <button
              onClick={onClose}
              className={`w-full sm:w-auto px-8 py-2.5 rounded-lg font-semibold transition-all ${isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
            >
              {isViewOnly ? 'Close' : 'Cancel'}
            </button>
            {!isViewOnly && (
              <button
                onClick={handleSave}
                className="w-full sm:w-auto px-10 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold transition-all shadow-md active:scale-95"
              >
                Save KDS
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const KDSManagement: React.FC<KDSManagementProps> = ({ isDarkMode = false, onViewKDS }) => {
  const { config } = useBranding();
  const [kdsProfiles, setKdsProfiles] = useState<KDSProfile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<KDSProfile | undefined>();
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Load KDS profiles from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('kdsProfiles');
    if (saved) {
      setKdsProfiles(JSON.parse(saved));
    } else {
      // Default profiles
      const defaultProfiles: KDSProfile[] = [
        {
          id: '1364',
          name: 'Kitchen',
          subCategories: ['PIZZA-TRADITIONAL', 'PIZZA-SPECIAL', 'BURGER', 'Fries & Nuggets-WINGS', 'Fries & Nuggets-FRIES', 'BROAST', 'WRAPS', 'ROLL & SANDWICHES', 'DEALS', 'PASTA', 'Inventory', 'Sauces'],
          orderTypes: ['DineIn', 'TakeAway', 'Delivery'],
          users: ['Admin'],
          createdAt: Date.now()
        },
        {
          id: '1423',
          name: 'Pizza & Pasta Item',
          subCategories: ['ROLL & SANDWICHES', 'PIZZA-TRADITIONAL', 'PASTA', 'PIZZA-SPECIAL'],
          orderTypes: ['DineIn', 'TakeAway', 'Delivery'],
          users: ['Admin', 'Chef'],
          createdAt: Date.now()
        },
        {
          id: '1424',
          name: 'Burgers & Fries Item',
          subCategories: ['Fries & Nuggets-WINGS', 'Fries & Nuggets-FRIES', 'BURGER', 'WRAPS', 'BROAST'],
          orderTypes: ['DineIn', 'TakeAway', 'Delivery'],
          users: ['Admin'],
          createdAt: Date.now()
        },
        {
          id: '1488',
          name: 'BAR',
          subCategories: ['DRINKS-BEVERAGES'],
          orderTypes: ['DineIn', 'TakeAway', 'Delivery'],
          users: ['Admin', 'Manager'],
          createdAt: Date.now()
        }
      ];
      setKdsProfiles(defaultProfiles);
      localStorage.setItem('kdsProfiles', JSON.stringify(defaultProfiles));
    }
  }, []);

  // Save to localStorage whenever profiles change
  useEffect(() => {
    if (kdsProfiles.length > 0) {
      localStorage.setItem('kdsProfiles', JSON.stringify(kdsProfiles));
    }
  }, [kdsProfiles]);

  const handleAddNew = () => {
    setEditingProfile(undefined);
    setIsViewOnly(false);
    setIsModalOpen(true);
  };

  const handleEdit = (profile: KDSProfile) => {
    setEditingProfile(profile);
    setIsViewOnly(false);
    setIsModalOpen(true);
  };

  const handleViewDetails = (profile: KDSProfile) => {
    setEditingProfile(profile);
    setIsViewOnly(true);
    setIsModalOpen(true);
  };

  const handleSave = (profileData: Omit<KDSProfile, 'id' | 'createdAt'>) => {
    if (editingProfile) {
      setKdsProfiles(prev => prev.map(p =>
        p.id === editingProfile.id
          ? { ...editingProfile, ...profileData }
          : p
      ));
    } else {
      const newProfile: KDSProfile = {
        id: (1000 + Math.floor(Math.random() * 9000)).toString(),
        ...profileData,
        createdAt: Date.now()
      };
      setKdsProfiles(prev => [...prev, newProfile]);
    }
  };

  const handleDelete = (id: string) => {
    setKdsProfiles(prev => prev.filter(p => p.id !== id));
  };

  const handleViewKDSDisplay = (profile: KDSProfile) => {
    if (onViewKDS) {
      onViewKDS(profile);
    }
  };

  const filteredProfiles = useMemo(() => kdsProfiles.filter(profile =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.subCategories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
  ), [kdsProfiles, searchQuery]);

  const columns = useMemo<ColumnDef<KDSProfile>[]>(() => [
    {
      accessorKey: 'id',
      header: 'SR#',
      cell: ({ row }) => (
        <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{row.original.id}</span>
      ),
      size: 60,
    },
    {
      accessorKey: 'name',
      header: 'KDS NAME',
      cell: ({ row }) => (
        <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">{row.original.name}</span>
      ),
      size: 150,
    },
    {
      accessorKey: 'subCategories',
      header: 'SUB CATEGORY',
      cell: ({ row }) => (
        <div
          className="flex flex-wrap gap-1 cursor-pointer hover:text-primary transition-colors min-w-[200px]"
          onClick={() => handleViewKDSDisplay(row.original)}
        >
          {row.original.subCategories.map((cat, idx) => (
            <span key={idx} className={`text-[10px] sm:text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600 font-medium'}`}>
              {cat}{idx < row.original.subCategories.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'ACTION',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2 pr-2">
          <button
            onClick={() => handleEdit(row.original)}
            className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
            title="Edit"
          >
            <FiEdit className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => handleViewDetails(row.original)}
            className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
            title="View Details"
          >
            <FiEye className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="p-1 text-red-400 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      ),
      size: 120,
    },
  ], [isDarkMode, handleEdit, handleDelete, handleViewDetails, handleViewKDSDisplay]);

  const { table, isLoading: isTableLoading } = useInfiniteTable<KDSProfile>({
    columns,
    data: filteredProfiles,
    pageSize: 10,
  });

  return (
    <>
      <div className={`min-h-screen p-3 sm:p-6 ${isDarkMode ? 'bg-[#1e1e2d] text-white' : 'bg-white text-gray-900'}`}>
        {/* Header */}
        <div className="mb-6 lg:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
            Kitchen Display System
          </h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full sm:w-48 lg:w-64 pl-9 pr-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-primary/20 text-gray-900 placeholder-gray-400'
                  }`}
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddNew}
                className="flex items-center justify-center gap-2 px-4 lg:px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold text-sm transition-all shadow-md active:scale-95 whitespace-nowrap"
              >
                <FiPlus className="w-4 h-4 sm:hidden" />
                <span>Add KDS +</span>
              </button>
          </div>
          
          </div>
          
        </div>
           <div className={`flex  mb-1 sm:mb-2 rounded-lg items-end justify-end ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'list'
                      ? 'bg-primary text-white shadow-sm'
                      : (isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500')
                    }`}
                >
                  <List size={20} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'grid'
                      ? 'bg-primary text-white shadow-sm'
                      : (isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500')
                    }`}
                >
                  <LayoutGrid size={20} />
                </button>
              </div>

        {/* Main Content Container */}
        {viewMode === 'list' ? (
          <div className={`rounded-xl overflow-hidden border ${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white shadow-sm border-gray-100'}`}>
            <div className="[&_thead]:bg-[#f8f9fc] dark:[&_thead]:bg-gray-800">
              <div className="overflow-x-auto custom-scrollbar">
                <InfiniteTable
                  table={table}
                  isLoading={isTableLoading}
                  isDarkMode={isDarkMode}
                  total={filteredProfiles.length}
                  noDataMessage="No KDS profiles found"
                  className="min-h-[400px]"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProfiles.map((profile) => (
              <div
                key={profile.id}
                className={`p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg ${isDarkMode
                  ? 'bg-gray-900 border-gray-800 text-white hover:border-primary/50'
                  : 'bg-white border-gray-200 shadow-sm text-gray-900 hover:border-primary/50'
                  }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1 min-w-0 pr-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-blue-50 text-blue-600'
                      }`}>
                      SR#{profile.id}
                    </span>
                    <h3 className="text-lg font-bold mt-3 text-gray-900 dark:text-gray-100 truncate flex items-center gap-2 group cursor-pointer" onClick={() => handleViewKDSDisplay(profile)}>
                      <span className="truncate">{profile.name}</span>
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleEdit(profile)}
                      className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                      title="Edit"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleViewDetails(profile)}
                      className="p-2 text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                      title="View Details"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(profile.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={`text-[10px] font-bold uppercase tracking-wider mb-2 block ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Sub Categories
                    </label>
                    <div className="flex flex-wrap gap-1.5 min-h-[48px]">
                      {profile.subCategories.slice(0, 4).map((cat, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-medium leading-relaxed border ${isDarkMode
                            ? 'bg-gray-800 border-gray-700 text-gray-300'
                            : 'bg-white border-gray-200 text-gray-700'
                            }`}
                        >
                          {cat}
                        </span>
                      ))}
                      {profile.subCategories.length > 4 && (
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-gray-500'
                          : 'bg-gray-50 border-gray-100 text-gray-400'
                          }`}>
                          +{profile.subCategories.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className={`text-[10px] font-bold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>ORDER TYPES</span>
                      <span className="text-xs font-semibold">{profile.orderTypes.join(', ')}</span>
                    </div>
                    <button
                      onClick={() => handleViewKDSDisplay(profile)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${isDarkMode
                        ? 'bg-primary text-white hover:bg-primary/90'
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                        }`}
                    >
                      Open Display
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <KDSModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editProfile={editingProfile}
        isDarkMode={isDarkMode}
        isViewOnly={isViewOnly}
      />
    </>
  );
};

export default KDSManagement;
