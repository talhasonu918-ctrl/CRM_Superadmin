import React from 'react';
import { Package, Calendar, MapPin, ArrowRight, X, Info, Boxes, Briefcase, Banknote } from 'lucide-react';
import { ReusableModal } from '../../../../../components/ReusableModal';
import { StockTransferEntry } from '../table/stocktransfer.Table';

interface StockTransferViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPrint: (transfer: StockTransferEntry) => void;
    transfer: StockTransferEntry;
    isDarkMode: boolean;
}

export const StockTransferViewModal: React.FC<StockTransferViewModalProps> = ({
    isOpen,
    onClose,
    onPrint,
    transfer,
    isDarkMode,
}) => {
    const DetailItem = ({ icon: Icon, label, value, colorClass = "" }: { icon: any, label: string, value: string | React.ReactNode, colorClass?: string }) => (
        <div className={`p-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50 hover:border-primary/30' : 'bg-slate-50/50 border-slate-100 hover:border-primary/20'}`}>
            <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-700/50 text-slate-400' : 'bg-white text-slate-400'} shadow-sm`}>
                    <Icon size={16} />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
            </div>
            <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} ${colorClass}`}>
                {value || '---'}
            </div>
        </div>
    );

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={onClose}
            title="Transfer Details"
            size="md"
            isDarkMode={isDarkMode}
        >
            <div className="space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar p-1">
                {/* Header Card */}
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-primary/5 border-primary/10' : 'bg-primary/5 border-primary/10'} flex items-center gap-5`}>
                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                        <Briefcase size={32} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500 border border-slate-100'}`}>
                                ID: {transfer.id}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 uppercase tracking-tighter`}>
                                Verified
                            </span>
                        </div>
                        <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{transfer.documentNo}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar size={12} className="text-primary" /> Transferred on {transfer.date}
                        </p>
                    </div>
                </div>

                {/* Transfer Path */}
                <div className={`p-5 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 relative ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="text-center w-full md:flex-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Source</p>
                        <div className={`p-3 rounded-xl w-full flex items-center justify-center gap-2 ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                            <MapPin size={16} className="text-primary" />
                            <span className="text-sm font-bold">{transfer.locationFrom}</span>
                        </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center px-4 relative">
                        <div className="h-px w-16 md:w-px md:h-12 bg-gradient-to-r md:bg-gradient-to-b from-transparent via-slate-300 dark:via-slate-700 to-transparent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 z-10 scale-110 rotate-90 md:rotate-0">
                            <ArrowRight size={20} />
                        </div>
                    </div>

                    <div className="text-center w-full md:flex-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Destination</p>
                        <div className={`p-3 rounded-xl w-full flex items-center justify-center gap-2 ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                            <MapPin size={16} className="text-emerald-500" />
                            <span className="text-sm font-bold">{transfer.locationTo}</span>
                        </div>
                    </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <DetailItem
                        icon={Package}
                        label="Total Products"
                        value={transfer.totalProducts}
                    />
                    <DetailItem
                        icon={Boxes}
                        label="Total Quantity"
                        value={transfer.totalQuantity}
                    />
                    <DetailItem
                        icon={Banknote}
                        label="Total Value"
                        value={`${transfer.totalValue.toLocaleString()} PKR`}
                        colorClass="text-emerald-500"
                    />
                </div>

                {/* Products Summary */}
                <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-700/50' : 'bg-slate-50/50 border-slate-100'}`}>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Info size={18} />
                        </div>
                        <h4 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Included Products</h4>
                    </div>

                    <div className={`leading-relaxed text-sm p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50 text-slate-300' : 'bg-white border border-slate-50 text-slate-600'}`}>
                        {transfer.productNames}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-4 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800">
                    <button
                        onClick={onClose}
                        className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        Close Details
                    </button>
                    <button
                        onClick={() => onPrint(transfer)}
                        className="flex-1 py-3 px-6 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        Print Receipt
                    </button>
                </div>
            </div>
        </ReusableModal>
    );
};
