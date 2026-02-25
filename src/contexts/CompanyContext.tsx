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
            activeId = localStorage.getItem('lastCompany') || tenantConfig.id;
        }

        // Set the active company ID
        if (activeId) {
            setCompanyId(activeId);

            // Update localStorage
            if (typeof window !== 'undefined' && activeId !== 'auth') {
                localStorage.setItem('lastCompany', activeId);
            }
        }

        // For now, we use static tenantConfig, but in future this could come from API based on activeId
        setCompanyDetails(tenantConfig);

        setIsLoading(false);
    }, [company, router.isReady, router.asPath]);

    return (
        <CompanyContext.Provider value={{ company: companyId, companyDetails, isLoading }}>
            {children}
        </CompanyContext.Provider>
    );
};
