import React from 'react';
import { useRouter } from 'next/router';
import { getThemeColors } from '../../../../theme/colors';

interface DashboardCardProps {
    id: string;
    title: string;
    subtitle?: string;
    icon: React.ReactNode;
    href: string;
    isDarkMode: boolean;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
    id,
    title,
    subtitle,
    icon,
    href,
    isDarkMode,
}) => {
    const theme = getThemeColors(isDarkMode);
    const router = useRouter();

    const handleClick = () => {
        router.push(href);
    };

    return (
        <div
            onClick={handleClick}
            className={` relative cursor-pointer dark:bg-black group rounded-xl border p-6 flex  flex-col items-center justify-center gap-4 text-center transition-all duration-200
        ${theme.neutral.background} ${theme.border.main}  hover:shadow-md max-w-xs w-full
      `}
            style={{ minHeight: '140px' }}
        >
            {/* Icon Container */}
            <div className="flex items-center justify-center">
                <div className={`p-3 rounded-lg ${theme.neutral.card}`}>
                    {React.cloneElement(icon as React.ReactElement<any>, {
                        size: 28,
                        strokeWidth: 2,
                        className: 'text-orange-600 dark:text-orange-400'
                    })}
                </div>
            </div>

            {/* Title */}
            <div className="space-y-1">
                <h3 className={`font-semibold text-sm ${theme.text.primary}`}>
                    {title}
                </h3>
                {subtitle && (
                    <p className={`text-xs ${theme.text.muted}`}>
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
};
