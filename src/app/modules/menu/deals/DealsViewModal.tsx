import React from 'react';
import { Tag, Package } from 'lucide-react';
import { ReusableModal } from '../../../../components/ReusableModal';
import { Deal } from './types';

interface DealsViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal;
  isDarkMode: boolean;
}

const DealsViewModal: React.FC<DealsViewModalProps> = ({ isOpen, onClose, deal, isDarkMode }) => {
  return (
    <ReusableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Deal Details"
      size="lg"
      isDarkMode={isDarkMode}
    >
      <div className="space-y-6 animate-in fade-in zoom-in duration-300 max-h-[80vh] overflow-y-auto scrollbar-hidden pr-2">
        {/* Header Info */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden bg-primary/10 border-2 border-primary/20 flex-shrink-0 group relative shadow-lg">
            {deal.image ? (
              <img src={deal.image} alt={deal.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-primary/40">
                <Tag size={48} />
                <span className="text-[10px] mt-2 font-black uppercase tracking-tighter">No Image</span>
              </div>
            )}
            <div className="absolute top-2 right-2">
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${deal.status === 'Active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {deal.status}
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h2 className={`text-2xl font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{deal.name}</h2>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{deal.displayName}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                {deal.category}
              </span>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                {deal.subCategory}
              </span>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                {deal.mainBranch}
              </span>
            </div>

            <div className="inline-flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-xl">
              <span className="text-xl font-black text-orange-500 tracking-tighter">₹{(deal.price ?? 0).toLocaleString()}</span>
              <span className="text-[10px] uppercase font-black text-orange-500/60 leading-none">Price</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Description */}
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50/50 border-slate-200'}`}>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Description</h4>
            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{deal.description || 'No description provided.'}</p>
          </div>

          {/* Visibility Settings */}
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50/50 border-slate-200'}`}>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Availability</h4>
            <div className="space-y-2">
              {[
                { label: 'POS System', value: deal.showInPOSOnly },
                { label: 'Mobile App', value: deal.showOnMobile },
                { label: 'Web Platform', value: deal.showOnWeb },
                { label: 'Time Specific', value: deal.isTimeSpecific }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-bold">
                  <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>{item.label}</span>
                  <span className={item.value ? 'text-green-500' : 'text-red-400'}>{item.value ? 'YES' : 'NO'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className={`p-5 rounded-3xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-orange-500 mb-4 flex items-center gap-2">
            <Package size={14} /> Included Products
          </h4>
          <div className="space-y-3">
            {deal.products.length > 0 ? (
              deal.products.map((p, idx) => (
                <div key={idx} className={`flex items-center gap-4 p-3 rounded-2xl border transition-all hover:translate-x-1 ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'}`}>
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-xs font-black text-orange-500 flex-shrink-0">
                    {p.sequence}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{p.name}</p>
                    <p className="text-[10px] font-bold text-slate-400">Price Contribution: ₹{p.priceContribution}</p>
                  </div>
                  {p.allowAddOns && (
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-green-500/10 text-green-500 rounded-lg">
                      Add-ons Enabled
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No products included in this deal</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 active:scale-95 transition-all shadow-lg shadow-slate-900/10"
          >
            Close View
          </button>
        </div>
      </div>
    </ReusableModal>
  );
};

export default DealsViewModal;
