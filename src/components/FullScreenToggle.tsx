import React, { useState, useEffect } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import { getThemeColors } from '../theme/colors';

interface FullScreenToggleProps {
    isDarkMode?: boolean;
    className?: string;
    targetId?: string;
}

export const FullScreenToggle: React.FC<FullScreenToggleProps> = ({
    isDarkMode = false,
    className = "",
    targetId
}) => {
    const theme = getThemeColors(isDarkMode);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            const element = targetId ? document.getElementById(targetId) : document.documentElement;
            if (element) {
                element.requestFullscreen().catch((err) => {
                    console.error(`Error attempting to enable full-screen mode: ${err.message}`);
                });
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    return (
        <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-lg transition-all duration-200 ${theme.neutral.hoverLight} ${theme.text.secondary} ${className}`}
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
        >
            {isFullscreen ? (
                <Minimize size={18} className="animate-in zoom-in duration-300" />
            ) : (
                <Maximize size={18} className="animate-in zoom-in duration-300" />
            )}
        </button>
    );
};
