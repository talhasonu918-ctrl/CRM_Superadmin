import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Users, Smartphone } from 'lucide-react';
import { DashboardCard } from './components/DashboardCard';
import { getThemeColors } from '../../../theme/colors';
import { ReusableModal } from '../../../components/ReusableModal';
import { OrganizationSettingsForm } from './practice/form/OrganizationSettingsForm';
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

  const cards = [
    {
      icon: Building2,
      title: 'Organization Settings',
      onClick: () => setOrganizationModalOpen(true),
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
      title: 'Mobile & Web Setting',
      href: '/settings/mobile',
    },
  ];

  return (
    <div className="p-6">
      {/* Dashboard Cards Grid */}
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-0">
          {cards.map((card, index) => (
            <DashboardCard
              key={index}
              icon={card.icon}
              title={card.title}
              isDarkMode={isDarkMode}
              href={card.href}
              onClick={card.onClick}
            />
          ))}
        </div>
      </div>

      {/* Organization Settings Modal */}
      <ReusableModal
        isOpen={organizationModalOpen}
        onClose={() => setOrganizationModalOpen(false)}
        title="Organization Settings"
        isDarkMode={isDarkMode}
        size="lg"
      >
        <OrganizationSettingsForm
          initialData={organizationData || {}}
          onSubmit={handleSubmit}
          onCancel={() => setOrganizationModalOpen(false)}
          isEditMode={!!organizationData}
          isDarkMode={isDarkMode}
        />
      </ReusableModal>
    </div>
  );
};
