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
      <div className="space-y-6 sm:space-y-8 animate-in fade-in zoom-in duration-300 max-h-[80vh] overflow-y-auto px-0.5 sm:px-1 pb-6 scrollbar-hidden">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-2">
          {/* Image Container */}
          <div className="relative group w-full sm:w-44 md:w-52 aspect-square flex-shrink-0">
            <div className={`w-full h-full rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-md ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-white'}`}>
              {deal.image ? (
                <img src={deal.image} alt={deal.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 select-none">
                  <Tag size={48} className="opacity-20" />
                  <span className="text-[10px] mt-2 font-black uppercase tracking-widest opacity-30">No Image</span>
                </div>
              )}
            </div>
            {/* Status Badge Over Image */}
            <div className="absolute -top-3 -right-3 sm:-top-2 sm:-right-2 z-10 shadow-lg">
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border-2 border-white dark:border-slate-800 ${deal.status === 'Active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {deal.status}
              </span>
            </div>
          </div>

          {/* Core Info */}
          <div className="flex-1 space-y-4 w-full text-center sm:text-left pt-1">
            <div className="space-y-1">
              <h2 className={`text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {deal.name}
              </h2>
              <p className={`text-sm sm:text-base font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {deal.displayName}
              </p>
            </div>

            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              {[deal.category, deal.subCategory, deal.mainBranch].filter(Boolean).map((tag, i) => (
                <span key={i} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${isDarkMode ? 'border-slate-700 bg-slate-800/50 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                  {tag}
                </span>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 bg-orange-500/10 px-5 py-2.5 rounded-2xl border border-orange-500/20">
              <span className="text-2xl font-black text-orange-500 tracking-tighter">₹{(deal.price ?? 0).toLocaleString()}</span>
              <div className="w-[1px] h-4 bg-orange-500/30 mx-1" />
              <span className="text-[10px] uppercase font-black text-orange-500/60 leading-none tracking-widest">Price</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Description Card */}
          <div className={`p-5 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-800/30 border-slate-700/50' : 'bg-slate-50/50 border-slate-200/60'}`}>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-0.5">Description</h4>
            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {deal.description || 'This deal has no description text provided yet.'}
            </p>
          </div>

          {/* Config Card */}
          <div className={`p-5 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-800/30 border-slate-700/50' : 'bg-slate-50/50 border-slate-200/60'}`}>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 ml-0.5">Availability Settings</h4>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              {[
                { label: 'POS System', value: deal.showInPOSOnly },
                { label: 'Mobile App', value: deal.showOnMobile },
                { label: 'Web Store', value: deal.showOnWeb },
                { label: 'Time Based', value: deal.isTimeSpecific }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{item.label}</span>
                  <span className={`text-xs font-black ${item.value ? 'text-green-500' : 'text-red-400'}`}>
                    {item.value ? '● ENABLED' : '○ DISABLED'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className={`relative overflow-hidden p-5 sm:p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-orange-500 flex items-center gap-2">
              <Package size={16} className="text-orange-500" /> 
              Included Items
            </h4>
            <span className="text-[10px] font-black px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-400 uppercase tracking-widest">
              {deal.products.length} Items Total
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {deal.products.length > 0 ? (
              deal.products.map((p, idx) => (
                <div key={idx} className={`flex items-center gap-4 p-3.5 rounded-2xl border transition-all group ${isDarkMode ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-100 hover:border-slate-200/80'} shadow-sm hover:shadow-md`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-400'} border border-transparent group-hover:border-orange-500/20 group-hover:text-orange-500`}>
                    {p.sequence}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-black uppercase tracking-tight truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {p.name}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                         Contribution: <span className="text-orange-500">₹{p.priceContribution}</span>
                      </span>
                      {p.allowAddOns && (
                        <span className="text-[8px] font-black uppercase tracking-[0.1em] px-1.5 py-0.5 bg-green-500/10 text-green-500 rounded border border-green-500/20">
                          Addons
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-loose">
                  No items configured for this deal
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end pt-4 sticky bottom-0 bg-white dark:bg-slate-900 pb-1 z-20 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-10 py-3.5 bg-primary dark:bg-slate-700 text-white rounded-2xl  text-[10px] tracking-[0.2em] hover:bg-slate-800  shadow-xl shadow-slate-900/10 select-none"
          >
            Finish View
          </button>
        </div>
      </div>
    </ReusableModal>
    // </ReusableModal>
  );
};

export default DealsViewModal;
