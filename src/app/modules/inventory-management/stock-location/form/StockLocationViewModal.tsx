import React from 'react';
import { MapPin, Tag, Layers, Calendar, Info, CheckCircle2, XCircle, Building2, Boxes } from 'lucide-react';
import { ReusableModal } from '../../../../../components/ReusableModal';
import { StockLocation } from '../../../pos/mockData';

interface StockLocationViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    location: StockLocation;
    isDarkMode: boolean;
    allLocations: StockLocation[];
}

export const StockLocationViewModal: React.FC<StockLocationViewModalProps> = ({
    isOpen,
    onClose,
    location,
    isDarkMode,
    allLocations
}) => {
    const parentLocation = allLocations.find(l => l.id === location.parentId);

    const DetailItem = ({ icon: Icon, label, value, colorClass = "" }: { icon: any, label: string, value: string | React.ReactNode, colorClass?: string }) => (
        <div className={`p-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50 hover:border-primary/30' : 'bg-slate-50/50 border-slate-100 hover:border-primary/20'}`}>
            <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-700/50 text-slate-400' : 'bg-white text-slate-400'} shadow-sm`}>
                    <Icon size={16} />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
            </div>
            <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'} ${colorClass}`}>
                {value || '---'}
            </div>
        </div>
    );

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={onClose}
            title="Stock Location Details"
            size="lg"
            isDarkMode={isDarkMode}
        >
            <div className="space-y-6">
                {/* Header Profile Section */}
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-primary/5 border-primary/10' : 'bg-primary/5 border-primary/10'} flex items-center gap-5`}>
                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                        <Building2 size={32} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500 border border-slate-100'}`}>
                                ID: {location.id}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1 ${location.status === 'Active'
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : 'bg-red-500/10 text-red-500'
                                }`}>
                                {location.status === 'Active' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                                {location.status}
                            </span>
                        </div>
                        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{location.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin size={12} className="text-primary" /> {location.type} Location
                        </p>
                    </div>
                </div>

                {/* Primary Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem
                        icon={Building2}
                        label="Parent Location"
                        value={parentLocation ? (
                            <div className="flex items-center gap-1.5">
                                <span className="text-primary font-bold">{parentLocation.name}</span>
                                <span className="text-[10px] text-slate-400">({parentLocation.type})</span>
                            </div>
                        ) : 'Independent Location'}
                    />
                    <DetailItem
                        icon={Layers}
                        label="Location Type"
                        value={location.type}
                    />
                    <DetailItem
                        icon={Calendar}
                        label="Created At"
                        value={location.createdAt}
                    />
                    <DetailItem
                        icon={Info}
                        label="Status"
                        value={location.status}
                        colorClass={location.status === 'Active' ? 'text-emerald-500' : 'text-red-500'}
                    />
                </div>

                {/* Categories / Items Section */}
                <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-700/50' : 'bg-slate-50/50 border-slate-100'}`}>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Boxes size={18} />
                        </div>
                        <h4 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Associated Categories & Items</h4>
                    </div>

                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-white border border-slate-50'} leading-relaxed text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        {location.categoryName || (location.stockItems && location.stockItems.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {location.stockItems.map((item, idx) => (
                                    <span key={idx} className={`px-2 py-1 rounded-md text-[11px] font-medium ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                        {item.itemName} ({item.quantity} {item.unit})
                                    </span>
                                ))}
                            </div>
                        ) : 'No categories or specific items associated with this location yet.')}
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end pt-4 border-t border-dashed border-slate-700/20">
                    <button
                        onClick={onClose}
                        className="px-10 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
                    >
                        Close View
                    </button>
                </div>
            </div>
        </ReusableModal>
    );
};
