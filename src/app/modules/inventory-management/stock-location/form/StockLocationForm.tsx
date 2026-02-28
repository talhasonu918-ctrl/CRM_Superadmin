import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Info, Tag, Layers, ChevronDown } from 'lucide-react';
import { ReusableModal } from '../../../../../components/ReusableModal';
import { SearchableDropdown } from '../../../../../components/SearchableDropdown';
import { StockLocation } from '../../../pos/mockData';

interface StockLocationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (location: StockLocation) => void;
  location: StockLocation;
  isDarkMode: boolean;
  editingId: string | null;
  allLocations: StockLocation[];
}

export const StockLocationForm: React.FC<StockLocationFormProps> = ({
  isOpen,
  onClose,
  onSave,
  location: initialLocation,
  isDarkMode,
  editingId,
  allLocations
}) => {
  const [currentLocation, setCurrentLocation] = useState<StockLocation>(initialLocation);
  const [parentLocationId, setParentLocationId] = useState<string>(initialLocation.parentId || '');

  useEffect(() => {
    setCurrentLocation(initialLocation);
    setParentLocationId(initialLocation.parentId || '');
  }, [initialLocation]);

  useEffect(() => {
    if (parentLocationId && !editingId) {
      const parent = allLocations.find(l => l.id === parentLocationId);
      if (parent) {
        setCurrentLocation(prev => ({ ...prev, type: parent.type }));
      }
    }
  }, [parentLocationId, allLocations, editingId]);

  const inputClass = `w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all text-sm font-medium ${
    isDarkMode 
      ? 'bg-slate-900/50 border-slate-700/50 text-white placeholder-slate-600 focus:border-[#0070AC] focus:ring-4 focus:ring-[#0070AC]/5' 
      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#0070AC] focus:ring-4 focus:ring-[#0070AC]/5'
  }`;

  const labelClass = `flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2 ${
    isDarkMode ? 'text-slate-300' : 'text-slate-700'
  }`;

  const typeOptions = useMemo(() => {
    const defaultTypes = ['Warehouse', 'Store', 'Kitchen', 'Cold Storage', 'Dry Store', 'Beverage Store'];
    const existingTypes = Array.from(new Set(allLocations.map(loc => loc.type))).filter(Boolean);
    const combined = Array.from(new Set([...defaultTypes, ...existingTypes]));
    
    return combined.map(type => ({
      value: type,
      label: type
    }));
  }, [allLocations]);

  const parentOptions = useMemo(() => {
    return allLocations
      .filter(loc => loc.id !== editingId && !loc.parentId)
      .map(loc => ({
        value: loc.id,
        label: loc.name
      }));
  }, [allLocations, editingId]);

  const handleSave = () => {
    onSave({
      ...currentLocation,
      parentId: parentLocationId || undefined
    });
  };

  return (
    <ReusableModal
      isOpen={isOpen}
      onClose={onClose}
      title={editingId ? "Edit Stock Location" : "Add New Stock Location"}
      size="lg"
      isDarkMode={isDarkMode}
    >
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
        {/* Decorative Header */}
        <div className={`p-3 sm:p-4 rounded-2xl border ${isDarkMode ? 'bg-primary/5 border-primary/10' : 'bg-primary/5 border-primary/10'} flex items-center gap-3 sm:gap-4`}>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
            <MapPin size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div>
            <h4 className={`font-medium text-xs sm:text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Identity & Configuration
            </h4>
            <p className="text-[10px] sm:text-xs text-slate-500">
              {parentLocationId ? 'Defining sub-location for existing point' : 'Define your stock point and its organizational type.'}
            </p>
          </div>
        </div>

        <div className={`p-4 sm:p-6 rounded-2xl border ${isDarkMode ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50/50'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Step 1: Select Existing Location (Optional) */}
            <div className="space-y-1 col-span-full">
              <label className={labelClass}>
                <Layers size={12} /> Select Existing Location (Optional)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <SearchableDropdown
                    options={parentOptions}
                    value={parentLocationId}
                    onChange={(val) => setParentLocationId(val)}
                    isDarkMode={isDarkMode}
                    placeholder="Choose Main Store, Warehouse etc..."
                  />
                </div>
                {parentLocationId && (
                  <button
                    onClick={() => setParentLocationId('')}
                    className={`w-full sm:w-auto px-3 py-2.5 sm:py-2 rounded-xl border text-xs font-semibold whitespace-nowrap active:scale-95 transition-all ${
                      isDarkMode 
                        ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' 
                        : 'bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    Clear
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 ">
                {parentLocationId ? 'New item will be a sub-location of the selection.' : 'Leave empty to create a new parent location.'}
              </p>
            </div>

            <div className="space-y-1 ">
              <label className={labelClass}>
                <Tag size={12} /> {parentLocationId ? 'Sub-Location Name' : 'Location Name'}
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
                  <Info size={16} />
                </div>
                <input
                  type="text"
                  placeholder={parentLocationId ? "e.g., Meat Section" : "e.g., Main Central Store"}
                  value={currentLocation.name}
                  onChange={(e) => setCurrentLocation({ ...currentLocation, name: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>
                <Layers size={12} /> Stock Location Type
              </label>
              <SearchableDropdown
                options={typeOptions}
                value={currentLocation.type}
                onChange={(val) => setCurrentLocation({ ...currentLocation, type: val })}
                isDarkMode={isDarkMode}
                placeholder="Select or Search Type"
              />
            </div>

            <div className="space-y-1 col-span-full">
              <label className={labelClass}>
                <Tag size={12} /> Categories / Items (Optional)
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-2.5 text-slate-500 group-focus-within:text-primary transition-colors">
                  <Layers size={16} />
                </div>
                <textarea
                  placeholder="e.g. Meat items, Frozen chicken, Dairy products..."
                  value={currentLocation.categoryName}
                  onChange={(e) => setCurrentLocation({ ...currentLocation, categoryName: e.target.value })}
                  rows={2}
                  className={`${inputClass} !pl-10 !py-2.5 resize-none`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-dashed border-slate-700/20">
          <button
            onClick={onClose}
            className={`w-full sm:w-auto px-8 py-2.5 rounded-xl font-medium text-sm transition-all ${
              isDarkMode 
                ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Back
          </button>
          <button
            onClick={handleSave}
            className="w-full sm:flex-1 md:flex-none px-10 py-2.5 bg-primary text-white rounded-xl text-sm hover:bg-[#0070AC]/90 shadow-lg shadow-[#0070AC]/25 active:scale-[0.98] transition-all"
          >
            {editingId ? "Update Location" : "Save Stock Location"}
          </button>
        </div>
      </div>
    </ReusableModal>
  );
};

