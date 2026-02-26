import React, { useState } from 'react';
import { ReusableModal } from '../../../../../components/ReusableModal';
import { Upload, FileSpreadsheet, Download, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface ImportProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (data: any[]) => void;
    isDarkMode: boolean;
}

export const ImportProductModal: React.FC<ImportProductModalProps> = ({
    isOpen,
    onClose,
    onImport,
    isDarkMode,
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleImport = () => {
        setIsUploading(true);
        // Simulate parsing and importing
        setTimeout(() => {
            setIsUploading(false);
            setIsSuccess(true);
            onImport([]); // Pass empty for mock
        }, 2000);
    };

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={onClose}
            title="Import Products"
            size="md"
            isDarkMode={isDarkMode}
        >
            <div className="p-6 space-y-6">
                {!isSuccess ? (
                    <>
                        <div className={`p-4 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center py-10 ${file
                            ? 'border-primary bg-primary/5'
                            : isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'
                            }`}>
                            {file ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                                        <FileSpreadsheet size={32} />
                                    </div>
                                    <h4 className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{file.name}</h4>
                                    <p className="text-xs text-slate-500 mb-4">{(file.size / 1024).toFixed(2)} KB</p>
                                    <button
                                        onClick={() => setFile(null)}
                                        className="text-xs font-medium text-red-500 flex items-center gap-1 hover:underline"
                                    >
                                        <X size={12} /> Remove File
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                                        <Upload size={32} />
                                    </div>
                                    <h3 className={`text-base font-black mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        Choose Excel or CSV file
                                    </h3>
                                    <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6">
                                        Max file size 10MB. Make sure your file follows our template format.
                                    </p>
                                    <label className="cursor-pointer px-6 py-2.5 bg-primary text-white rounded-xl font-medium text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
                                        Browse Files
                                        <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
                                    </label>
                                </>
                            )}
                        </div>

                        <div className={`p-4 rounded-2xl flex items-center justify-between ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'
                            }`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                    <FileSpreadsheet className="text-primary text-xs" size={20} />
                                </div>
                                <div>
                                    <h4 className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Import Template</h4>
                                    <p className="text-[10px] text-slate-500">Download our sample format</p>
                                </div>
                            </div>
                            <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all">
                                <Download size={18} />
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all ${isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleImport}
                                disabled={!file || isUploading}
                                className="flex-1 py-3 bg-[#D6112C] text-white rounded-xl font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                            >
                                {isUploading ? 'Importing...' : 'Start Import'}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="py-10 text-center space-y-6">
                        <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto scale-110">
                            <CheckCircle2 size={48} />
                        </div>
                        <div>
                            <h3 className={`text-xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Success!</h3>
                            <p className="text-sm text-slate-500">
                                Your products have been imported and are now being processed.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-[#D6112C] text-white rounded-xl font-medium text-sm hover:opacity-90 transition-all shadow-lg shadow-red-500/20"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </ReusableModal>
    );
};
