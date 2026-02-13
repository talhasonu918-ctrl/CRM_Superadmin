'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    FileText,
    Save,
    Clock,
    CheckCircle2,
    Info,
    Shield,
    ScrollText,
    History,
    ArrowLeft
} from 'lucide-react';
import { Button, Badge } from 'rizzui';
import toast from 'react-hot-toast';
import { useRouter, useParams } from 'next/navigation';
import { useTheme } from '@/src/contexts/ThemeContext';
import { getThemeColors } from '@/src/theme/colors';
import { ROUTES } from '@/src/const/constants';

// Import Quill directly
import 'quill/dist/quill.snow.css';

// Custom Quill Wrapper to avoid findDOMNode error in React 19
const QuillEditor = ({
    value,
    onChange,
    placeholder,
    isDarkMode
}: {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
    isDarkMode: boolean;
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && containerRef.current && !quillRef.current) {
            // Clear container to avoid double toolbars during hot reloads/strict mode
            containerRef.current.innerHTML = '';
            const editorDiv = document.createElement('div');
            containerRef.current.appendChild(editorDiv);

            import('quill').then((QuillModule) => {
                const Quill = QuillModule.default;

                quillRef.current = new Quill(editorDiv, {
                    theme: 'snow',
                    placeholder: '',
                    modules: {
                        toolbar: [
                            [{ 'header': [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            ['link', 'image'],
                            ['clean']
                        ],
                    }
                });

                // Set initial content
                if (value) {
                    quillRef.current.root.innerHTML = value;
                }

                // Handle text change
                quillRef.current.on('text-change', () => {
                    const content = quillRef.current.root.innerHTML;
                    onChange(content);
                });
            });
        }
    }, []);

    // Update content if value changes externally (e.g. tab switch)
    useEffect(() => {
        if (quillRef.current) {
            const currentContent = quillRef.current.root.innerHTML;
            if (value !== currentContent) {
                quillRef.current.root.innerHTML = value || '';
            }
        }
    }, [value]);

    return (
        <div className="quill-wrapper relative">
            <div ref={containerRef} className="min-h-[400px]" />
            <style jsx global>{`
                .ql-toolbar.ql-snow {
                    border: none !important;
                    border-bottom: 1px solid var(--color-border) !important;
                    padding: 12px 15px !important;
                    background: var(--color-surface) !important;
                }
                .ql-container.ql-snow {
                    border: none !important;
                    font-family: inherit !important;
                    height: auto !important;
                    min-height: 400px;
                }
                .ql-editor {
                    padding: 20px !important;
                    color: var(--color-text-primary) !important;
                    line-height: 1.6 !important;
                    min-height: 400px;
                }
                .ql-editor.ql-blank::before {
                    color: var(--color-text-secondary) !important;
                    opacity: 0.3;
                    left: 20px !important;
                    font-style: normal !important;
                }
                .ql-stroke {
                    stroke: var(--color-text-secondary) !important;
                }
                .ql-fill {
                    fill: var(--color-text-secondary) !important;
                }
                .ql-picker {
                    color: var(--color-text-primary) !important;
                }
                .ql-snow .ql-picker.ql-expanded .ql-picker-options {
                    background-color: var(--color-surface) !important;
                    border-color: var(--color-border) !important;
                    border-radius: 8px;
                }
            `}</style>
        </div>
    );
};

type PageType = 'about' | 'privacy' | 'terms';

interface PageContent {
    title: string;
    metaTitle: string;
    metaDescription: string;
    content: string;
    lastUpdated: string;
    status: 'Draft' | 'Saved';
}

const DEFAULT_CONTENT: Record<PageType, PageContent> = {
    about: {
        title: 'About Us',
        metaTitle: 'About Our Company - Premium CRM',
        metaDescription: 'Learn more about our mission and vision.',
        content: '<h1>About Us</h1><p>Welcome to our platform...</p>',
        lastUpdated: new Date().toLocaleString(),
        status: 'Saved'
    },
    privacy: {
        title: 'Privacy Policy',
        metaTitle: 'Privacy Policy - Your Data is Safe',
        metaDescription: 'Read how we protect your information.',
        content: '<h1>Privacy Policy</h1><p>Your privacy is important...</p>',
        lastUpdated: new Date().toLocaleString(),
        status: 'Saved'
    },
    terms: {
        title: 'Terms & Conditions',
        metaTitle: 'Terms of Service - Agreement',
        metaDescription: 'Our rules and guidelines for using the service.',
        content: '<h1>Terms & Conditions</h1><p>By using this service...</p>',
        lastUpdated: new Date().toLocaleString(),
        status: 'Saved'
    }
};

export const CMSView = () => {
    const router = useRouter();
    const params = useParams();
    const company = params?.company as string;
    const { isDarkMode } = useTheme();
    const theme = getThemeColors(isDarkMode);
    const [activeTab, setActiveTab] = useState<PageType>('about');
    const [pages, setPages] = useState<Record<PageType, PageContent>>(DEFAULT_CONTENT);
    const [isSaving, setIsSaving] = useState(false);

    // Load from localStorage
    useEffect(() => {
        const savedData = localStorage.getItem('cms_content');
        if (savedData) {
            try {
                setPages(JSON.parse(savedData));
            } catch (e) {
                console.error('Failed to parse CMS content', e);
            }
        }
    }, []);

    // Manual Save
    const handleSave = () => {
        setIsSaving(true);
        const updatedPages = {
            ...pages,
            [activeTab]: {
                ...pages[activeTab],
                status: 'Saved' as const,
                lastUpdated: new Date().toLocaleString()
            }
        };

        localStorage.setItem('cms_content', JSON.stringify(updatedPages));
        setPages(updatedPages);

        setTimeout(() => {
            setIsSaving(false);
            toast.success('Changes saved successfully!', {
                icon: <CheckCircle2 className="text-success" />,
                style: {
                    background: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                }
            });
        }, 800);
    };

    // Update Field
    const updateField = (field: keyof PageContent, value: string) => {
        setPages(prev => ({
            ...prev,
            [activeTab]: {
                ...prev[activeTab],
                [field]: value,
                status: 'Draft' as const
            }
        }));
    };

    const tabs = [
        { id: 'about', label: 'About Us', icon: Info },
        { id: 'privacy', label: 'Privacy Policy', icon: Shield },
        { id: 'terms', label: 'Terms & Conditions', icon: ScrollText },
    ];

    return (
        <div className="space-y-6 pb-20">
            {/* SaaS Tab Navigation */}
            <div className={`sticky top-0 z-20 ${isDarkMode ? 'bg-background/80' : 'bg-white/80'} backdrop-blur-md pt-2 pb-1 border-b ${theme.border.main}`}>
                <div className="flex gap-1 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as PageType)}
                                className={`relative flex items-center gap-2 px-6 py-3 text-sm font-semibold whitespace-nowrap group ${isActive
                                    ? theme.text.primary
                                    : `${theme.text.muted} hover:text-primary`
                                    }`}
                            >
                                <Icon size={18} className={isActive ? 'text-primary' : ''} />
                                {tab.label}
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Page Header Area */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => company ? router.push(ROUTES.SETTINGS(company)) : router.back()}
                        className={`p-2 rounded-lg border ${theme.border.main} ${theme.neutral.card} hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${theme.text.primary}`}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className={`text-2xl md:text-3xl font-semibold tracking-tight ${theme.text.primary}`}>
                                {pages[activeTab].title}
                            </h1>
                            <Badge
                                variant="flat"
                                className={pages[activeTab].status === 'Saved'
                                    ? 'bg-success/10 text-success'
                                    : 'bg-warning/10 text-warning'
                                }
                            >
                                {pages[activeTab].status}
                            </Badge>
                        </div>
                        <p className={`${theme.text.secondary} text-xs flex items-center gap-2`}>
                            <Clock size={14} />
                            Last saved: {pages[activeTab].lastUpdated}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        className="bg-primary hover:opacity-90 text-white shadow-lg shadow-primary/20 px-10 rounded-lg font-bold h-11"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Content'}
                    </Button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="">
                {/* Main Editor Card */}
                <div className=" space-y-6">
                    <div className={`${theme.neutral.card} border ${theme.border.main} rounded-2xl shadow-xl overflow-hidden`}>

                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className={`text-sm font-bold ${theme.text.secondary}`}>Page Title</label>
                                <input
                                    type="text"
                                    value={pages[activeTab].title}
                                    onChange={(e) => updateField('title', e.target.value)}
                                    className={`w-full text-xl font-semibold bg-transparent border-b-2 ${theme.border.main} focus:border-primary focus:outline-none transition-colors py-2 px-1 ${theme.text.primary}`}
                                    placeholder="Enter page title..."
                                />
                            </div>

                            <div className="space-y-4">
                                <label className={`text-sm font-bold ${theme.text.secondary}`}>Body Content</label>
                                <div className={`border ${theme.border.main} rounded-xl overflow-hidden`}>
                                    <QuillEditor
                                        value={pages[activeTab].content}
                                        onChange={(content) => updateField('content', content)}
                                        isDarkMode={isDarkMode}
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};
