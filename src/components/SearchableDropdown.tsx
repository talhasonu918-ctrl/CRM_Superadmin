import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    size,
    FloatingPortal,
} from '@floating-ui/react';

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

    const { refs, floatingStyles } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [
            offset(4),
            flip(),
            shift(),
            size({
                apply({ rects, elements }) {
                    Object.assign(elements.floating.style, {
                        width: `${rects.reference.width}px`,
                        maxHeight: '250px',
                    });
                },
            }),
        ],
        whileElementsMounted: autoUpdate,
    });

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOption = options.find((option) => option.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                refs.domReference.current &&
                !refs.domReference.current.contains(event.target as Node) &&
                refs.floating.current &&
                !refs.floating.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, refs]);

    return (
        <div className="w-full">
            {label && (
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                    {label}
                </label>
            )}
            <div
                ref={refs.setReference}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all cursor-pointer flex justify-between items-center ${isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-slate-50 border-slate-200 hover:border-primary/10'
                    }`}
            >
                <span className={!selectedOption ? 'text-slate-400' : ''}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <FloatingPortal>
                    <div
                        ref={refs.setFloating}
                        style={floatingStyles}
                        className={`z-[99999] rounded-lg border shadow-2xl flex flex-col overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-700 shadow-black/50' : 'bg-white border-slate-200 shadow-slate-200'
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
                                    className={`w-full pl-9 pr-3 py-2 rounded-md text-sm outline-none ${isDarkMode ? 'bg-slate-800 text-white placeholder-slate-500' : 'bg-slate-100 text-slate-900'
                                        }`}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="overflow-y-auto custom-scrollbar">
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
                                            ? 'hover:bg-slate-800 text-slate-200'
                                            : 'hover:bg-orange-50 text-slate-700 hover:text-primary'
                                            } ${value === option.value ? (isDarkMode ? 'bg-slate-800' : 'bg-orange-50 text-primary') : ''}`}
                                    >
                                        {option.label}
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-sm text-slate-400 text-center">No options found</div>
                            )}
                        </div>
                    </div>
                </FloatingPortal>
            )}
        </div>
    );
};
