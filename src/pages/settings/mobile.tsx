import React from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import { Layout } from '@/src/components/NavigationLayout';
import { getThemeColors } from '@/src/theme/colors';

export default function MobileSettings() {
    const router = useRouter();
    const isDarkMode = false;
    const theme = getThemeColors(isDarkMode);
    const cardStyle = `rounded-xl border shadow-sm p-8 ${theme.neutral.background} ${theme.border.main}`;
    const inputStyle = `w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${theme.input.background} ${theme.border.input} ${theme.text.primary}`;

    return (
        <Layout>
            <div className="space-y-6">
                {/* Back Button */}
                <button
                    onClick={() => router.push('/settings')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${theme.border.main} ${theme.text.muted} hover:${theme.text.primary} hover:border-orange-400`}
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm font-medium">Back to Settings</span>
                </button>

                <div className={cardStyle}>
                    <h4 className={`text-sm font-bold tracking-tight mb-6 ${theme.text.primary}`}>Mobile & Web Configuration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className={`text-[10px] font-extrabold uppercase tracking-widest ml-1 ${theme.text.muted}`}>App Version</label>
                            <input type="text" defaultValue="2.1.4" className={inputStyle} />
                        </div>
                        <div className="space-y-2">
                            <label className={`text-[10px] font-extrabold uppercase tracking-widest ml-1 ${theme.text.muted}`}>Web Version</label>
                            <input type="text" defaultValue="3.0.1" className={inputStyle} />
                        </div>
                        <div className="space-y-2">
                            <label className={`text-[10px] font-extrabold uppercase tracking-widest ml-1 ${theme.text.muted}`}>API Endpoint</label>
                            <input type="url" defaultValue="https://api.nexus-food.com/v1" className={inputStyle} />
                        </div>
                        <div className="space-y-2">
                            <label className={`text-[10px] font-extrabold uppercase tracking-widest ml-1 ${theme.text.muted}`}>Maintenance Mode</label>
                            <select className={inputStyle}>
                                <option>Disabled</option>
                                <option>Enabled</option>
                                <option>Scheduled</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className={`text-[10px] font-extrabold uppercase tracking-widest ml-1 ${theme.text.muted}`}>Push Notifications</label>
                            <select className={inputStyle}>
                                <option>Enabled</option>
                                <option>Disabled</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className={`text-[10px] font-extrabold uppercase tracking-widest ml-1 ${theme.text.muted}`}>Auto Updates</label>
                            <select className={inputStyle}>
                                <option>Enabled</option>
                                <option>Disabled</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button className={`px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-orange-500/10 active:scale-95 transition-all ${theme.button.primary}`}>
                            Save Settings
                        </button>
                        <button className={`border px-6 py-2 rounded-lg font-bold text-sm transition-all ${theme.button.secondary}`}>
                            Reset to Default
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
