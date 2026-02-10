import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { tenantConfig } from '../config/tenant-color';
import { TenantBranding } from '../theme/types';

interface CompanyContextType {
    company: string | null;
    companyDetails: TenantBranding | null;
    isLoading: boolean;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const useCompany = () => {
    const context = useContext(CompanyContext);
    if (context === undefined) {
        throw new Error('useCompany must be used within CompanyProvider');
    }
    return context;
};

interface CompanyProviderProps {
    children: ReactNode;
}

export const CompanyProvider: React.FC<CompanyProviderProps> = ({ children }) => {
    const router = useRouter();
    const { company } = router.query;

    const [companyId, setCompanyId] = useState<string | null>(null);
    const [companyDetails, setCompanyDetails] = useState<TenantBranding | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!router.isReady) return;

        // Path segments for direct URL inspection
        const pathSegments = router.asPath.split('?')[0].split('/').filter(Boolean);
        const urlCompanyId = pathSegments[0];

        // Determine the active ID from query, URL or localStorage
        const queryCompany = typeof company === 'string' ? company : null;
        let activeId = urlCompanyId || queryCompany;

        if (!activeId && typeof window !== 'undefined') {
            activeId = localStorage.getItem('lastCompany');
        }

        // Always use tenantConfig ID to ensure absolute centralization
        setCompanyId(tenantConfig.id);
        setCompanyDetails(tenantConfig);

        if (typeof window !== 'undefined') {
            localStorage.setItem('lastCompany', tenantConfig.id);
        }

        // Forced Redirection logic
        const isInternalId = activeId === tenantConfig.id;
        const isAuthSegment = urlCompanyId === 'auth';
        const isDefaultSegment = urlCompanyId === 'default';

        // If the URL contains an ID that isn't the current master config ID, redirect
        if (urlCompanyId && !isInternalId && !isAuthSegment && !isDefaultSegment) {
            // Check if it's potentially an old ID like hot-n-yum
            const newPath = `/${tenantConfig.id}/${pathSegments.slice(1).join('/')}${router.asPath.includes('?') ? '?' + router.asPath.split('?')[1] : ''}`;

            if (router.asPath !== newPath) {
                router.replace(newPath);
            }
        }

        setIsLoading(false);
    }, [company, router.isReady, router.asPath]);

    return (
        <CompanyContext.Provider value={{ company: companyId, companyDetails, isLoading }}>
            {children}
        </CompanyContext.Provider>
    );
};
