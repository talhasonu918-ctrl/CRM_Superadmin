import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Users, Smartphone } from 'lucide-react';
import { DashboardCard } from './components/DashboardCard';
import { getThemeColors } from '../../../theme/colors';
import { ReusableModal } from '../../../components/ReusableModal';
import { OrganizationSettingsForm } from './practice/form/OrganizationSettingsForm';
import { MobileSettingsForm } from './mobile/form/MobileSettingsForm';
import { MobileSettings, defaultMobileSettings } from './mobile/types';
import { PracticeSetting } from './practice/types';

interface SettingsViewProps {
  isDarkMode: boolean;
}

const STORAGE_KEY = 'organization_settings';

export const SettingsView: React.FC<SettingsViewProps> = ({ isDarkMode }) => {
  const theme = getThemeColors(isDarkMode);
  const [organizationModalOpen, setOrganizationModalOpen] = useState(false);
  const [organizationData, setOrganizationData] = useState<Partial<PracticeSetting> | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setOrganizationData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading organization settings:', error);
      }
    }
  }, []);

  const handleSubmit = (data: Partial<PracticeSetting>) => {
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setOrganizationData(data);
    setOrganizationModalOpen(false);
  };

  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const [mobileSettingsData, setMobileSettingsData] = useState<Partial<MobileSettings> | null>(null);
  const cards = [
    {
      icon: Building2,
      title: 'Organization Settings',
      href: '/settings/organization',
    },
    {
      icon: MapPin,
      title: 'Branches',
      href: '/settings/branches',
    },
    {
      icon: Users,
      title: 'Users',
      href: '/settings/users',
    },
    {
      icon: Smartphone,
      title: 'Mobile Setting',
      href: '/settings/mobile',
    },
    {
      icon: Smartphone,
      title: 'Web Setting',
      href: '/settings/web',
    },
  ];

  return (
    <div className="p-6">
      {/* Dashboard Cards Grid */}
      <div className="w-full max-w-7xl mx-auto">
        <div className=" grid 
      gap-4 
      grid-cols-1 
      sm:grid-cols-2 
      md:grid-cols-3 
      lg:grid-cols-4 
      xl:grid-cols-5">
          {cards.map((card, index) => (
            <DashboardCard
              key={index}
              icon={card.icon}
              title={card.title}
              isDarkMode={isDarkMode}
              href={card.href}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
