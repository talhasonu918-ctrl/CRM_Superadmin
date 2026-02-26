import React, { useState } from 'react';
import { ReusableModal } from '../../../../../components/ReusableModal';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface BulkUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updates: { category?: string; status?: string }) => void;
    affectedCount: number;
    categories: string[];
    isDarkMode: boolean;
}

export const BulkUpdateModal: React.FC<BulkUpdateModalProps> = ({
    isOpen,
    onClose,
    onUpdate,
    affectedCount,
    categories,
    isDarkMode,
}) => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const handleApply = () => {
        onUpdate({
            category: selectedCategory || undefined,
            status: selectedStatus || undefined,
        });
        onClose();
    };

    const selectClass = `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${isDarkMode
        ? 'bg-slate-800 border-slate-700 text-white focus:border-primary/50'
        : 'bg-slate-50 border-slate-200 focus:border-primary/50'
        }`;

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={onClose}
            title="Bulk Update Products"
            size="md"
            isDarkMode={isDarkMode}
        >
            <div className="p-6 space-y-6">
                <div className={`p-4 rounded-2xl flex items-start gap-3 ${isDarkMode ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-50 text-amber-600'
                    }`}>
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">
                        You are about to update <span className="font-medium">{affectedCount}</span> products simultaneously.
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-medium text-slate-500 uppercase mb-2 block">Change Category To</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className={selectClass}
                        >
                            <option value="">No Change</option>
                            {categories.filter(c => c !== 'All').map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-slate-500 uppercase mb-2 block">Change Status To</label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className={selectClass}
                        >
                            <option value="">No Change</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        onClick={onClose}
                        className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all ${isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApply}
                        disabled={!selectedCategory && !selectedStatus}
                        className="flex-1 py-3 bg-[#D6112C] text-white rounded-xl font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-red-500/20"
                    >
                        Apply Changes
                    </button>
                </div>
            </div>
        </ReusableModal>
    );
};
