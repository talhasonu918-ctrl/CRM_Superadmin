import React, { useState } from 'react';
import { KDSManagement } from './KDSManagement';
import { KitchenDisplayView } from './index';

interface KDSProfile {
  id: string;
  name: string;
  subCategories: string[];
  orderTypes: string[];
  users: string[];
  createdAt: number;
}

interface KDSWrapperProps {
  isDarkMode?: boolean;
}

export const KDSWrapper: React.FC<KDSWrapperProps> = ({ isDarkMode = false }) => {
  const [activeProfile, setActiveProfile] = useState<KDSProfile | null>(null);
  const [showTable, setShowTable] = useState(true);

  const handleViewKDS = (profile: KDSProfile) => {
    setActiveProfile(profile);
    setShowTable(false);
  };

  const handleBackToTable = () => {
    setShowTable(true);
    setActiveProfile(null);
  };

  // Always show table first, then switch to cards when profile is selected
  return showTable ? (
    <KDSManagement isDarkMode={isDarkMode} onViewKDS={handleViewKDS} />
  ) : (
    <KitchenDisplayView isDarkMode={isDarkMode} activeProfile={activeProfile} onBackToTable={handleBackToTable} />
  );
};

export default KDSWrapper;
