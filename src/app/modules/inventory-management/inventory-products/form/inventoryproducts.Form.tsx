import React, { useState, useEffect, useRef } from 'react';
import { Package, Tag, Hash, Layout, Info, CheckCircle2, XCircle, DollarSign, Box, Briefcase, User, Search, Trash2, Globe, Building2, Check, ExternalLink, Image as ImageIcon, ChevronDown, Upload, X } from 'lucide-react';
import { ReusableModal } from '../../../../../components/ReusableModal';
import { InventoryProduct } from '../../../pos/mockData';
import { SearchableDropdown } from '../../../../../components/SearchableDropdown';

interface InventoryProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: InventoryProduct) => void;
  product: InventoryProduct;
  isDarkMode: boolean;
  editingId: string | null;
}

export const InventoryProductForm: React.FC<InventoryProductFormProps> = ({
  isOpen,
  onClose,
  onSave,
  product: initialProduct,
  isDarkMode,
  editingId,
}) => {
  const [activeTab, setActiveTab] = useState<'Summary' | 'Pricing'>('Summary');
  const [currentProduct, setCurrentProduct] = useState<InventoryProduct>(initialProduct);
  const [mainBranchOpen, setMainBranchOpen] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentProduct({
        ...initialProduct,
        uomConfig: initialProduct.uomConfig || [
          { uom: 'Kilogram', convUnit: 1, isDefault: true },
          { uom: 'Gram', convUnit: 1, isDefault: false }
        ],
        assignedBranches: initialProduct.assignedBranches || ['Main Branch'],
        productType: initialProduct.productType || 'Inventory',
        discountType: initialProduct.discountType || 'Value',
        saleTaxType: initialProduct.saleTaxType || 'Value',
        showOnPos: initialProduct.showOnPos ?? true,
      });
      setImagePreview(null);
      setActiveTab('Summary');
    }
  }, [initialProduct, isOpen]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setCurrentProduct(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setCurrentProduct(prev => ({ ...prev, image: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const productTypeOptions = [
    { value: 'Inventory', label: 'Inventory' },
    { value: 'Raw Material', label: 'Raw Material' },
    { value: 'Finished Good', label: 'Finished Good' },
    { value: 'Service', label: 'Service' }
  ];

  const branchOptions = [
    { value: 'Main Branch', label: 'Main Branch' },
    { value: 'Branch 1', label: 'Branch 1' },
    { value: 'Branch 2', label: 'Branch 2' },
    { value: 'Branch 3', label: 'Branch 3' }
  ];

  const uomUnits = [
    { value: 'Kilogram', label: 'Kilogram' },
    { value: 'Gram', label: 'Gram' },
    { value: 'Milligram', label: 'Milligram' },
    { value: 'Pound', label: 'Pound' },
    { value: 'Ounce', label: 'Ounce' },
    { value: 'Liter', label: 'Liter' },
    { value: 'Milliliter', label: 'Milliliter' },
    { value: 'Meter', label: 'Meter' },
    { value: 'Centimeter', label: 'Centimeter' },
    { value: 'Piece', label: 'Piece' },
    { value: 'Box', label: 'Box' },
    { value: 'Pack', label: 'Pack' },
    { value: 'Dozen', label: 'Dozen' },
    { value: 'Bundle', label: 'Bundle' },
    { value: 'Carton', label: 'Carton' }
  ];

  const inputClass = `w-full px-3 py-2 rounded-lg border outline-none transition-all text-sm font-medium ${isDarkMode
    ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-600 focus:border-primary focus:ring-1 focus:ring-primary/20'
    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary/20 shadow-sm'
    }`;

  const labelClass = `text-[11px] font-medium text-slate-500 uppercase tracking-tight mb-1 truncate`;

  const handleUOMAdd = () => {
    const newUom = { uom: 'Unit', convUnit: 1, isDefault: false };
    setCurrentProduct(prev => ({
      ...prev,
      uomConfig: [...(prev.uomConfig || []), newUom]
    }));
  };

  const handleUOMRemove = (index: number) => {
    setCurrentProduct(prev => ({
      ...prev,
      uomConfig: (prev.uomConfig || []).filter((_, i) => i !== index)
    }));
  };

  const updateUOM = (index: number, field: keyof NonNullable<InventoryProduct['uomConfig']>[0], value: any) => {
    setCurrentProduct(prev => {
      const newConfig = [...(prev.uomConfig || [])];
      if (field === 'isDefault' && value === true) {
        newConfig.forEach(item => item.isDefault = false);
      }
      newConfig[index] = { ...newConfig[index], [field]: value };
      return { ...prev, uomConfig: newConfig };
    });
  };

  return (
    <ReusableModal
      isOpen={isOpen}
      onClose={onClose}
      title={editingId ? "Update Product" : "Add Product"}
      size="xl"
      isDarkMode={isDarkMode}
    >
      <div className="flex flex-col h-[75vh]">
        {/* Tabs Header */}
        <div className={`flex items-center gap-6 px-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100/50'}`}>
          {(['Summary', 'Pricing'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2.5 text-xs font-medium border-b-2 transition-all relative ${activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {activeTab === 'Summary' ? (
            <div className="space-y-6">
              {/* Product Basic Information */}
              <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800 shadow-none' : 'bg-white border-slate-100 shadow-sm shadow-black/[0.02]'}`}>
                <h3 className="text-sm font-medium text-slate-900 mb-5">Product Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Name field with floating label style */}
                  <div className="md:col-span-1 border border-slate-200 rounded-lg p-3 group focus-within:border-primary transition-all">
                    <label className="block text-[10px] font-medium text-slate-400 uppercase mb-1">Name</label>
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={currentProduct.name}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                      className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-900 placeholder:text-slate-300"
                    />
                  </div>

                  {/* Bar Code */}
                  <div className="border border-slate-200 rounded-lg p-3 group focus-within:border-primary transition-all">
                    <label className="block text-[10px] font-medium text-slate-400 uppercase mb-1">Bar Code</label>
                    <input
                      type="text"
                      placeholder="Bar Code"
                      value={currentProduct.barcode}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, barcode: e.target.value })}
                      className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-900 placeholder:text-slate-300"
                    />
                  </div>

                  {/* Generic Name */}
                  <div className="border border-slate-200 rounded-lg p-3 group focus-within:border-primary transition-all">
                    <label className="block text-[10px] font-medium text-slate-400 uppercase mb-1">Generic Name</label>
                    <input
                      type="text"
                      placeholder="Generic Name"
                      value={currentProduct.genericName}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, genericName: e.target.value })}
                      className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-900 placeholder:text-slate-300"
                    />
                  </div>

                  {/* Description */}
                  <div className="border border-slate-200 rounded-lg p-3 group focus-within:border-primary transition-all">
                    <label className="block text-[10px] font-medium text-slate-400 uppercase mb-1">Description</label>
                    <input
                      type="text"
                      placeholder="Description"
                      value={currentProduct.description}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                      className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-900 placeholder:text-slate-300"
                    />
                  </div>

                  {/* PCT Code */}
                  <div className="border border-slate-200 rounded-lg p-3 group focus-within:border-primary transition-all">
                    <label className="block text-[10px] font-medium text-slate-400 uppercase mb-1">PCT Code</label>
                    <input
                      type="text"
                      placeholder="PCT Code"
                      value={currentProduct.pctCode}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, pctCode: e.target.value })}
                      className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-900 placeholder:text-slate-300"
                    />
                  </div>

                  {/* Category */}
                  <div className="border border-slate-200 rounded-lg p-3 group focus-within:border-primary transition-all relative">
                    <label className="block text-[10px] font-medium text-slate-400 uppercase mb-1">Category</label>
                    <div className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm font-medium text-slate-900">{currentProduct.category}</span>
                      <XCircle size={14} className="text-slate-300" onClick={() => setCurrentProduct({ ...currentProduct, category: '' })} />
                    </div>
                  </div>

                  {/* Sub Category */}
                  <div className="border border-slate-200 rounded-lg p-3 group focus-within:border-primary transition-all relative">
                    <label className="block text-[10px] font-medium text-slate-400 uppercase mb-1">Sub Category</label>
                    <div className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm font-medium text-slate-900">{currentProduct.subCategory}</span>
                      <XCircle size={14} className="text-slate-300" onClick={() => setCurrentProduct({ ...currentProduct, subCategory: '' })} />
                    </div>
                  </div>

                  {/* Racks */}
                  <div className="border border-slate-200 rounded-lg p-3 group focus-within:border-primary transition-all">
                    <label className="block text-[10px] font-medium text-slate-400 uppercase mb-1">Racks</label>
                    <input
                      type="text"
                      placeholder="Racks"
                      value={currentProduct.rack}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, rack: e.target.value })}
                      className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-900 placeholder:text-slate-300"
                    />
                  </div>

                  {/* Supplier */}
                  <div className="border border-slate-200 rounded-lg p-3 group focus-within:border-primary transition-all">
                    <label className="block text-[10px] font-medium text-slate-400 uppercase mb-1">Supplier</label>
                    <input
                      type="text"
                      placeholder="Supplier"
                      value={currentProduct.supplier}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, supplier: e.target.value })}
                      className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-900 placeholder:text-slate-300"
                    />
                  </div>

                  {/* Manufacturer */}
                  <div className="border border-slate-200 rounded-lg p-3 group focus-within:border-primary transition-all">
                    <label className="block text-[10px] font-medium text-slate-400 uppercase mb-1">Manufacturer</label>
                    <input
                      type="text"
                      placeholder="Manufacturer"
                      value={currentProduct.manufacturerName}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, manufacturerName: e.target.value })}
                      className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-900 placeholder:text-slate-300"
                    />
                  </div>

                  {/* Product Type */}
                  <div>
                    <label className="block text-[10px] font-medium text-slate-400 uppercase mb-2">Product Type</label>
                    <SearchableDropdown
                      options={productTypeOptions}
                      value={currentProduct.productType || 'Inventory'}
                      onChange={(val) => setCurrentProduct({ ...currentProduct, productType: val })}
                      isDarkMode={isDarkMode}
                      placeholder="Select Type"
                    />
                  </div>

                  {/* Assigned Branches */}
                  <div>
                    <label className="block text-[10px] font-medium text-slate-400 uppercase mb-2">Assigned Branches</label>
                    <SearchableDropdown
                      options={branchOptions}
                      value={currentProduct.assignedBranches?.[0] || 'Main Branch'}
                      onChange={(val) => setCurrentProduct({ ...currentProduct, assignedBranches: [val] })}
                      isDarkMode={isDarkMode}
                      placeholder="Select Branch"
                    />
                  </div>

                  {/* Image Upload Section */}
                  <div className="col-span-full">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 px-3 py-1.5 border border-dashed border-primary rounded-lg text-[10px] font-medium uppercase text-primary hover:bg-primary/5 transition-all"
                    >
                      <Upload size={14} />
                      Select Product Image
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    {imagePreview && (
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                        <span>✓ Image uploaded</span>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="text-red-500 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Checkboxes Area */}
                  <div className="col-span-full flex items-center gap-10 mt-4">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-4 h-4 rounded border flex  items-center justify-center transition-all ${currentProduct.showOnPos ? 'bg-primary border-primary' : 'border-slate-400 group-hover:border-primary'}`}>
                        {currentProduct.showOnPos && <Check size={12} className="text-white" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={currentProduct.showOnPos} onChange={e => setCurrentProduct({ ...currentProduct, showOnPos: e.target.checked })} />
                      <span className="text-xs font-medium text-slate-600">Show on Pos</span>
                    </label>
                    
                       <label className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-4 h-4 rounded border flex  items-center justify-center transition-all ${currentProduct.showOnPos ? 'bg-primary border-primary' : 'border-slate-400 group-hover:border-primary'}`}>
                        {currentProduct.showOnPos && <Check size={12} className="text-white" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={currentProduct.showOnPos} onChange={e => setCurrentProduct({ ...currentProduct, showOnPos: e.target.checked })} />
                      <span className="text-xs font-medium text-slate-600">Show on Web</span>
                    </label>
                       <label className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-4 h-4 rounded border flex  items-center justify-center transition-all ${currentProduct.showOnPos ? 'bg-primary border-primary' : 'border-slate-400 group-hover:border-primary'}`}>
                        {currentProduct.showOnPos && <Check size={12} className="text-white" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={currentProduct.showOnPos} onChange={e => setCurrentProduct({ ...currentProduct, showOnPos: e.target.checked })} />
                      <span className="text-xs font-medium text-slate-600">Show on  Mobile</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${currentProduct.isAutoReady ? 'bg-primary border-primary' : 'border-slate-400 group-hover:border-primary'}`}>
                        {currentProduct.isAutoReady && <Check size={12} className="text-white" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={currentProduct.isAutoReady} onChange={e => setCurrentProduct({ ...currentProduct, isAutoReady: e.target.checked })} />
                      <span className="text-xs font-medium text-slate-600">Is Auto Ready</span>
                    </label>


                  </div>
                </div>
              </div>

              {/* UOM Configuration */}
              <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm shadow-black/[0.01]'} max-w-sm`}>
                <h3 className="text-sm font-medium text-slate-900 mb-5">UOM Configuration</h3>

                <div className="border border-primary rounded-xl overflow-hidden">
                  <table className="w-full border-collapse">
                    <thead className="bg-[#F8F9FD]">
                      <tr className="border-b border-slate-100">
                        <th className="py-2.5 px-3 text-left text-[10px] font-medium uppercase text-slate-400">UOM</th>
                        <th className="py-2.5 px-3 text-left text-[10px] font-medium uppercase text-slate-400">Conv Unit</th>
                        <th className="py-2.5 px-3 text-center text-[10px] font-medium uppercase text-slate-400">Default</th>
                        <th className="py-2.5"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentProduct.uomConfig?.map((uom, idx) => (
                        <tr key={idx} className="group hover:bg-slate-50/50">
                          <td className="py-2 px-3">
                            <select
                              value={uom.uom}
                              onChange={(e) => updateUOM(idx, 'uom', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded p-2 text-xs font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 appearance-none cursor-pointer"
                            >
                              <option value="">Select Unit</option>
                              {uomUnits.map(unit => (
                                <option key={unit.value} value={unit.value}>{unit.label}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={uom.convUnit}
                              onChange={(e) => updateUOM(idx, 'convUnit', parseFloat(e.target.value) || 0)}
                              className="w-16 bg-transparent border border-slate-200 rounded p-1 text-xs outline-none focus:border-primary font-medium"
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={uom.isDefault}
                              onChange={(e) => updateUOM(idx, 'isDefault', e.target.checked)}
                              className="accent-primary w-3.5 h-3.5"
                            />
                          </td>
                          <td className="py-2 pr-2 text-right">
                            <button
                              onClick={() => handleUOMRemove(idx)}
                              className="text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={handleUOMAdd}
                  className="mt-3 text-[10px] font-medium uppercase text-primary hover:underline"
                >
                  + Add UOM
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Branch Wise Pricing */}
              <div className={`rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                {/* Header */}
                <button
                  onClick={() => setMainBranchOpen(!mainBranchOpen)}
                  className="w-full px-5 py-4 flex items-center gap-3 hover:bg-slate-50/50 transition-colors"
                >
                  <ChevronDown size={16} className={`text-primary transition-transform ${mainBranchOpen ? 'rotate-0' : '-rotate-90'}`} />
                  <h3 className="text-sm font-medium text-slate-900 ">Main Branch</h3>
                </button>

                {/* Content */}
                {mainBranchOpen && (
                  <div className={`px-5 pb-5 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-[#F1F5F9]">
                          <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-2">Gross Margin:</div>
                          <div className="text-xl font-medium text-slate-900">{(currentProduct.salePrice && currentProduct.costPrice ? ((currentProduct.salePrice - currentProduct.costPrice) / currentProduct.salePrice * 100) : 0).toFixed(2)}%</div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="border border-slate-200 rounded-lg p-3 focus-within:border-primary transition-colors">
                            <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-1">Cost Price</label>
                            <input type="number" value={currentProduct.costPrice} onChange={(e) => setCurrentProduct({ ...currentProduct, costPrice: parseFloat(e.target.value) || 0 })} className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-900" />
                          </div>
                          <div className="border border-slate-200 rounded-lg p-3 focus-within:border-primary transition-colors">
                            <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-1">Mean Price</label>
                            <input type="number" value={currentProduct.meanPrice} onChange={(e) => setCurrentProduct({ ...currentProduct, meanPrice: parseFloat(e.target.value) || 0 })} className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-900" />
                          </div>
                          <div className="border border-slate-200 rounded-lg p-3 focus-within:border-primary transition-colors">
                            <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-1">Retail Price</label>
                            <input type="number" value={currentProduct.retailPrice} onChange={(e) => setCurrentProduct({ ...currentProduct, retailPrice: parseFloat(e.target.value) || 0 })} className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-900" />
                          </div>
                          <div className="border border-slate-200 rounded-lg p-3 focus-within:border-primary transition-colors">
                            <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-1">Sale Price</label>
                            <input type="number" value={currentProduct.salePrice} onChange={(e) => setCurrentProduct({ ...currentProduct, salePrice: parseFloat(e.target.value) || 0 })} className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-900" />
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-2">Discount</label>
                          <input type="number" value={currentProduct.discount} onChange={(e) => setCurrentProduct({ ...currentProduct, discount: parseFloat(e.target.value) || 0 })} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 bg-transparent outline-none text-sm font-medium text-slate-900 focus:border-primary" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-2">Sale Tax</label>
                          <input type="number" value={currentProduct.saleTax} onChange={(e) => setCurrentProduct({ ...currentProduct, saleTax: parseFloat(e.target.value) || 0 })} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 bg-transparent outline-none text-sm font-medium text-slate-900 focus:border-primary" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-2">Discount Type</label>
                          <SearchableDropdown
                            options={[
                              { value: 'Value', label: 'Value' },
                              { value: 'Percentage', label: 'Percentage' }
                            ]}
                            value={currentProduct.discountType || 'Value'}
                            onChange={(val) => setCurrentProduct({ ...currentProduct, discountType: val as any })}
                            isDarkMode={isDarkMode}
                            placeholder="Select Type"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-2">Sales Tax Type</label>
                          <SearchableDropdown
                            options={[
                              { value: 'Value', label: 'Value' },
                              { value: 'Percentage', label: 'Percentage' }
                            ]}
                            value={currentProduct.saleTaxType || 'Value'}
                            onChange={(val) => setCurrentProduct({ ...currentProduct, saleTaxType: val as any })}
                            isDarkMode={isDarkMode}
                            placeholder="Select Type"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'} flex items-center justify-end gap-3`}>
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-medium text-xs transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-[#F8FAFC] border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
          >
            Back
          </button>
          <button
            onClick={() => onSave(currentProduct)}
            className="px-8 py-2 bg-primary text-white rounded-lg font-medium text-xs hover:bg-primary/90 shadow-sm active:scale-[0.98] transition-all"
          >
            {activeTab === 'Summary'
              ? (editingId ? 'Update Product' : 'Create Product')
              : (editingId ? 'Update Pricing' : 'Save Pricing')}
          </button>
        </div>
      </div>
    </ReusableModal>
  );
};

