import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

interface SearchableDropdownProps {
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    isDarkMode?: boolean;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select option',
    label,
    isDarkMode = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOption = options.find((option) => option.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {label && (
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                    {label}
                </label>
            )}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all cursor-pointer flex justify-between items-center ${isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-slate-50 border-slate-200 hover:border-orange-500'
                    }`}
            >
                <span className={!selectedOption ? 'text-slate-400' : ''}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div
                    className={`absolute z-50 w-full mt-1 rounded-lg border shadow-xl max-h-60 overflow-hidden flex flex-col ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                        }`}
                >
                    <div className={`p-2 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search..."
                                className={`w-full pl-9 pr-3 py-2 rounded-md text-sm outline-none ${isDarkMode ? 'bg-slate-700 text-white placeholder-slate-400' : 'bg-slate-100 text-slate-900'
                                    }`}
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                        setSearchTerm('');
                                    }}
                                    className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${isDarkMode
                                            ? 'hover:bg-slate-700 text-slate-200'
                                            : 'hover:bg-orange-50 text-slate-700 hover:text-orange-600'
                                        } ${value === option.value ? (isDarkMode ? 'bg-slate-700' : 'bg-orange-50 text-orange-600') : ''}`}
                                >
                                    {option.label}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-slate-400 text-center">No options found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
