import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import { getThemeColors } from '../../../../theme/colors';

interface DashboardCardProps {
    icon: LucideIcon;
    title: string;
    isDarkMode: boolean;
    href?: string;
    onClick?: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
    icon: Icon,
    title,
    isDarkMode,
    href,
    onClick,
}) => {
    const router = useRouter();
    const theme = getThemeColors(isDarkMode);

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (href) {
            router.push(href);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`max-w-xs w-full p-6 rounded-xl border cursor-pointer transition-all duration-200 ${theme.neutral.card} ${theme.primary.border} hover:border-orange-600 hover:shadow-md`}
        >
            <div className="flex flex-col items-center text-center gap-4">
                <div
                    className={`p-3 rounded-lg ${theme.neutral.backgroundSecondary}`}
                >
                    <Icon size={28} className={theme.primary.text} />
                </div>
                <h3 className={`font-semibold whitespace-nowrap text-sm ${theme.text.primary}`}>
                    {title}
                </h3>
            </div>
        </div>
    );
};
