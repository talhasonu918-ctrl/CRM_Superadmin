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
import notify from '../../../../utils/toast';
import { useRouter, useParams } from 'next/navigation';
import { useAppSelector } from '../../../../redux/store';
import { getThemeColors } from '../../../../theme/colors';
import { ROUTES } from '../../../../const/constants';
import { CMSTable } from './table/table';
import { DeleteConfirmModal } from '../../../../components/DeleteConfirmModal';

// Import Quill directly
// Quill CSS is required for the editor to render correctly
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
                    placeholder: placeholder || 'Start writing...',
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
                .quill-wrapper .ql-toolbar.ql-snow {
                    border: none !important;
                    border-bottom: 1px solid var(--color-border) !important;
                    padding: 8px 10px !important;
                    background: var(--color-surface) !important;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px;
                }
                @media (min-width: 640px) {
                    .quill-wrapper .ql-toolbar.ql-snow {
                        padding: 12px 15px !important;
                        gap: 8px;
                    }
                }
                .ql-snow.ql-toolbar button, 
                .ql-snow .ql-toolbar button {
                    width: 28px !important;
                    height: 28px !important;
                    padding: 3px !important;
                }
                @media (min-width: 640px) {
                    .ql-snow.ql-toolbar button, 
                    .ql-snow .ql-toolbar button {
                        width: 32px !important;
                        height: 32px !important;
                        padding: 5px !important;
                    }
                }
                .ql-container.ql-snow {
                    border: none !important;
                    font-family: inherit !important;
                    height: auto !important;
                    min-height: 300px;
                }
                @media (min-width: 640px) {
                    .ql-container.ql-snow {
                        min-height: 400px;
                    }
                }
                .ql-editor {
                    padding: 16px !important;
                    color: var(--color-text-primary) !important;
                    line-height: 1.6 !important;
                    min-height: 300px;
                    font-size: 15px;
                }
                @media (min-width: 640px) {
                    .ql-editor {
                        padding: 24px !important;
                        min-height: 400px;
                        font-size: 16px;
                    }
                }
                .ql-editor.ql-blank::before {
                    color: var(--color-text-secondary) !important;
                    opacity: 0.3;
                    left: 16px !important;
                    font-style: normal !important;
                }
                @media (min-width: 640px) {
                    .ql-editor.ql-blank::before {
                        left: 24px !important;
                    }
                }
                .ql-stroke {
                    stroke: var(--color-text-secondary) !important;
                }
                .ql-fill {
                    fill: var(--color-text-secondary) !important;
                }
                .ql-picker {
                    color: var(--color-text-primary) !important;
                    height: 28px !important;
                }
                @media (min-width: 640px) {
                    .ql-picker {
                        height: 32px !important;
                    }
                }
                .ql-snow .ql-picker.ql-header {
                    width: 80px !important;
                }
                .ql-snow .ql-picker.ql-expanded .ql-picker-options {
                    background-color: var(--color-surface) !important;
                    border-color: var(--color-border) !important;
                    border-radius: 8px;
                    z-index: 50;
                }
                /* Hide some toolbar items on very small screens to keep it clean */
                @media (max-width: 400px) {
                    .ql-snow .ql-formats:nth-child(4),
                    .ql-snow .ql-formats:nth-child(5) {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
};

type PageType = string;

interface PageContent {
    title: string;
    metaTitle: string;
    metaDescription: string;
    content: string;
    lastUpdated: string;
    status: 'Draft' | 'Saved';
}

const DEFAULT_CONTENT: Record<string, PageContent> = {
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
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
    const theme = getThemeColors(isDarkMode);
    const [pages, setPages] = useState<Record<string, PageContent>>(DEFAULT_CONTENT);
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'edit' | 'preview' | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [pageToDelete, setPageToDelete] = useState<any>(null);

    // Load from localStorage
    useEffect(() => {
        const savedData = localStorage.getItem('cms_content');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Validate that all pages have titles
                const isValid = Object.values(parsed).every((page: any) => page && page.title);
                if (isValid) {
                    setPages(parsed);
                } else {
                    // Reset to default if data is corrupted
                    console.warn('Corrupted CMS data detected, resetting to defaults');
                    localStorage.removeItem('cms_content');
                }
            } catch (e) {
                console.error('Failed to parse CMS content', e);
                localStorage.removeItem('cms_content');
            }
        }
    }, []);

    // Manual Save
    const handleSave = () => {
        if (!selectedPage) return;
        setIsSaving(true);
        const updatedPages = {
            ...pages,
            [selectedPage]: {
                ...pages[selectedPage],
                status: 'Draft' as const, // Automatically set back to draft if edited? No, usually Saved if saved manually.
                lastUpdated: new Date().toLocaleString()
            }
        };

        // Actually the previous logic had a small bug where it wasn't setting status to 'Saved'
        const finalizedPages = {
            ...updatedPages,
            [selectedPage]: {
                ...updatedPages[selectedPage],
                status: 'Saved' as const
            }
        };

        localStorage.setItem('cms_content', JSON.stringify(finalizedPages));
        setPages(finalizedPages);

        setTimeout(() => {
            setIsSaving(false);
            notify.success('Changes saved successfully!', {
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
        if (!selectedPage) return;
        setPages(prev => ({
            ...prev,
            [selectedPage]: {
                ...prev[selectedPage],
                [field]: value,
                status: 'Draft' as const
            }
        }));
    };

    const handleEdit = (row: any) => {
        setSelectedPage(row.id);
        setViewMode('edit');
    };

    const handleView = (row: any) => {
        setSelectedPage(row.id);
        setViewMode('preview');
    };

    const handleDelete = (row: any) => {
        setPageToDelete(row);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!pageToDelete) return;

        const pageId = pageToDelete.id;
        setPages(prev => {
            const newPages = { ...prev };
            delete newPages[pageId];
            localStorage.setItem('cms_content', JSON.stringify(newPages));
            return newPages;
        });

        setIsDeleteModalOpen(false);
        setPageToDelete(null);
        notify.success('Page deleted successfully');
    };

    const handleBack = () => {
        setSelectedPage(null);
        setViewMode(null);
    };

    const handleAddPage = () => {
        const id = `page_${Date.now()}`;
        const newPage: PageContent = {
            title: 'New Page',
            metaTitle: 'New Page',
            metaDescription: '',
            content: '',
            lastUpdated: new Date().toLocaleString(),
            status: 'Draft'
        };

        setPages(prev => ({
            ...prev,
            [id]: newPage
        }));
        setSelectedPage(id);
        setViewMode('edit');
    };

    return (
        <div className="space-y-6 pb-20">
            {!selectedPage ? (
                <>
                    <div className="mb-4 px-1">
                        <Button
                            variant="outline"
                            onClick={() => router.push(ROUTES.SETTINGS(company))}
                            className={`flex items-center gap-2 px-3 py-1.5 h-auto text-sm font-medium transition-all ${theme.text.primary} hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg shadow-sm border`}
                        >
                            <ArrowLeft size={16} />
                            Back to Settings
                        </Button>
                    </div>
                    <CMSTable
                        isDarkMode={isDarkMode}
                        pages={pages}
                        onEdit={handleEdit}
                        onView={handleView}
                        onDelete={handleDelete}
                        onAddPage={handleAddPage}
                    />

                    <DeleteConfirmModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        title="Delete Content Page"
                        message={`Are you sure you want to delete "${pageToDelete?.name}"? This will permanently remove the page from your website.`}
                        onConfirm={handleConfirmDelete}
                        onCancel={() => setIsDeleteModalOpen(false)}
                        isDarkMode={isDarkMode}
                    />
                </>
            ) : (
                <>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleBack}
                                className={`p-2 rounded-lg border ${theme.border.main} ${theme.neutral.card} hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${theme.text.primary}`}
                            >
                                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                    <h1 className={`text-xl md:text-3xl font-semibold tracking-tight ${theme.text.primary} truncate max-w-[150px] sm:max-w-none`}>
                                        {pages[selectedPage].title}
                                    </h1>
                                    <Badge
                                        variant="flat"
                                        className={`text-[10px] md:text-xs ${pages[selectedPage].status === 'Saved'
                                            ? 'bg-success/10 text-success'
                                            : 'bg-warning/10 text-warning'
                                            }`}
                                    >
                                        {pages[selectedPage].status}
                                    </Badge>
                                </div>
                                <p className={`${theme.text.secondary} text-[10px] md:text-xs flex items-center gap-1.5`}>
                                    <Clock size={12} />
                                    Last saved: {pages[selectedPage].lastUpdated}
                                </p>
                            </div>
                        </div>
                        {viewMode === 'edit' && (
                            <Button
                                className="bg-primary hover:opacity-90 text-white shadow-lg shadow-primary/20 px-6 md:px-10 rounded-lg font-bold h-10 md:h-11 w-full sm:w-auto sm:ml-auto"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Saving...' : 'Save Content'}
                            </Button>
                        )}
                        {viewMode === 'preview' && (
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto sm:ml-auto h-10"
                                onClick={() => setViewMode('edit')}
                            >
                                Switch to Editor
                            </Button>
                        )}
                    </div>

                    {viewMode === 'preview' ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className={`${theme.neutral.card} rounded-2xl shadow-xl overflow-hidden p-4 sm:p-8 md:p-16 min-h-[600px] bg-white dark:bg-black/20`}>
                                <div className="max-w-4xl mx-auto space-y-6 sm:space-y-12">
                                    <div className="space-y-4 pb-6 sm:pb-8 border-b border-gray-100 dark:border-gray-800">
                                        <h2 className={`text-3xl  font-bold uppercase tracking-tight ${theme.text.primary}`}>
                                            {pages[selectedPage].title}
                                        </h2>
                                    </div>

                                    <div
                                        className={`prose prose-lg dark:prose-invert max-w-none website-preview ${theme.text.primary}`}
                                        dangerouslySetInnerHTML={{ __html: pages[selectedPage].content || '<p class="text-gray-400 ">No content to preview.</p>' }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className={`${theme.neutral.card} rounded-2xl shadow-xl overflow-hidden`}>
                                <div className="p-4 sm:p-6 space-y-6">
                                    <div className="space-y-2">
                                        <label className={`text-xs sm:text-sm font-bold ${theme.text.secondary}`}>Page Title</label>
                                        <input
                                            type="text"
                                            value={pages[selectedPage].title}
                                            onChange={(e) => updateField('title', e.target.value)}
                                            className={`w-full text-lg sm:text-xl font-semibold bg-transparent border-b-2 ${theme.border.main} focus:border-primary focus:outline-none transition-colors py-2 px-1 ${theme.text.primary}`}
                                            placeholder="Enter page title..."
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className={`text-xs sm:text-sm font-bold ${theme.text.secondary}`}>Body Content</label>
                                        <div className={`border ${theme.border.main} rounded-xl overflow-hidden shadow-sm`}>
                                            <QuillEditor
                                                value={pages[selectedPage].content}
                                                onChange={(content) => updateField('content', content)}
                                                isDarkMode={isDarkMode}
                                                placeholder=""
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
            <style jsx global>{`
                .website-preview h1 { font-size: 2.25rem; font-weight: 700; margin-bottom: 1.5rem; letter-spacing: -0.025em; }
                .website-preview h2 { font-size: 1.75rem; font-weight: 600; margin-top: 2.5rem; margin-bottom: 1.25rem; letter-spacing: -0.025em; }
                .website-preview h3 { font-size: 1.35rem; font-weight: 600; margin-top: 2rem; margin-bottom: 1rem; }
                .website-preview p { margin-bottom: 1.25rem; line-height: 1.75; opacity: 0.85; font-weight: 400; }
                .website-preview ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
                .website-preview ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.5rem; }
                .website-preview li { margin-bottom: 0.5rem; line-height: 1.75; opacity: 0.85; }
                .website-preview strong { font-weight: 600; }
            `}</style>
        </div>
    );
};
