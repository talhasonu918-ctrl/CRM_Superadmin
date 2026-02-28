import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, LayoutGrid, List, MoreVertical, Edit2, Trash2, MapPin, Eye } from 'lucide-react';
import { StockLocationTable } from './table/StockLocationTable';
import { StockLocationForm } from './form/StockLocationForm';
import { StockLocationViewModal } from './form/StockLocationViewModal';
import { StockLocation, INITIAL_LOCATIONS } from '../../pos/mockData';
import { getThemeColors } from '../../../../theme/colors';

const STORAGE_KEY = 'crm_stock_locations';

export const StockLocationView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingLocation, setViewingLocation] = useState<StockLocation | null>(null);

  const theme = getThemeColors(isDarkMode);
  const cardStyle = isDarkMode ? 'bg-[#1e2836]' : 'bg-white shadow-sm';
  const borderStyle = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
  const [locations, setLocations] = useState<StockLocation[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Error parsing stored locations', e);
        }
      }
    }
    return INITIAL_LOCATIONS;
  });

  const emptyLocation: StockLocation = {
    id: '',
    name: '',
    type: 'Warehouse',
    categoryName: '',
    parentId: '',
    createdAt: new Date().toLocaleString(),
    status: 'Active',
  };

  const [currentLocation, setCurrentLocation] = useState<StockLocation>(emptyLocation);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
  }, [locations]);

  const filteredLocations = useMemo(() => {
    return locations.filter(loc =>
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [locations, searchTerm]);

  const handleAdd = () => {
    setEditingId(null);
    setCurrentLocation({ ...emptyLocation, id: (Math.max(0, ...locations.map(l => parseInt(l.id) || 0)) + 1).toString() });
    setIsModalOpen(true);
  };

  const handleEdit = (location: StockLocation) => {
    setEditingId(location.id);
    setCurrentLocation(location);
    setIsModalOpen(true);
  };

  const handleView = (location: StockLocation) => {
    setViewingLocation(location);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      setLocations(locations.filter(l => l.id !== id));
    }
  };

  const handleSave = (location: StockLocation) => {
    setLocations(prev => {
      const exists = prev.some(l => l.id === location.id);
      if (exists) {
        return prev.map(l => (l.id === location.id ? location : l));
      } else {
        return [...prev, location];
      }
    });
    setEditingId(null);
    setCurrentLocation(emptyLocation);
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
          <h2 className={`text-xl font-bold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Stocks Locations
          </h2>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm outline-none transition-all ${isDarkMode
                ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-primary/50'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary/50'
                }`}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <div className={`flex items-center p-1 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'list'
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
                }`}
              title="List View"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'grid'
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
                }`}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-4 py-1.5 sm:px-6 sm:py-2 bg-primary text-white rounded-lg font-semibold text-[11px] sm:text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/10 active:scale-95 whitespace-nowrap"
          >
            <Plus size={18} /> Add Stock Location
          </button>
        </div>
      </div>
    {viewMode === 'list' ? (
        <StockLocationTable
          data={filteredLocations}
          isDarkMode={isDarkMode}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredLocations.map((location) => (
            <div
              key={location.id}
              className={`${cardStyle} rounded-xl p-5 border ${borderStyle} hover:shadow-lg transition-all relative group flex flex-col gap-4`}
            >
              <div className="flex justify-between items-start">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-primary' : 'bg-primary/10 text-primary'}`}>
                  <MapPin size={20} />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleView(location)}
                    className="p-1.5 hover:bg-primary/10 rounded-md transition-colors text-primary"
                    title="View"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => handleEdit(location)}
                    className="p-1.5 hover:bg-primary/10 rounded-md transition-colors text-primary"
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(location.id)}
                    className="p-1.5 hover:bg-red-500/10 rounded-md transition-colors text-red-500"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                    ID: {location.id}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${location.status === 'Active'
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : 'bg-red-500/10 text-red-500'
                    }`}>
                    {location.status}
                  </span>
                </div>
                <h3 className={`font-bold text-base ${textStyle} line-clamp-1`}>{location.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{location.type}</p>
              </div>

              {location.categoryName ? (
                <div className="pt-3 border-t border-dashed border-slate-700/20">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Categories</p>
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                    {location.categoryName}
                  </p>
                </div>
              ) : location.stockItems && location.stockItems.length > 0 ? (
                <div className="pt-3 border-t border-dashed border-slate-700/20">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Stock Items</p>
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                    {location.stockItems.map(i => i.itemName).join(', ')}
                  </p>
                </div>
              ) : null}

              <div className="mt-auto pt-3 flex items-center justify-between text-[10px] text-slate-500">
                <span>Created: {location.createdAt}</span>
              </div>
            </div>
          ))}
          {filteredLocations.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 ">
              No stock locations found matching your search.
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <StockLocationForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          location={currentLocation}
          isDarkMode={isDarkMode}
          editingId={editingId}
          allLocations={locations}
        />
      )}

      {isViewModalOpen && viewingLocation && (
        <StockLocationViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          location={viewingLocation}
          isDarkMode={isDarkMode}
          allLocations={locations}
        />
      )}
    </div>
  );
};

export default StockLocationView;

