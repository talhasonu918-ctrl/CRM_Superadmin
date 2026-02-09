import React, { useState, useEffect } from 'react';
import { ReusableModal } from '../../../../components/ReusableModal';
import { OrganizationSettingsForm } from './form/OrganizationSettingsForm';
import { PracticeSetting } from './types';
import { getThemeColors } from '../../../../theme/colors';
import { Settings } from 'lucide-react';

interface PracticeViewProps {
  isDarkMode: boolean;
}

const STORAGE_KEY = 'organization_settings';

export const PracticeView: React.FC<PracticeViewProps> = ({ isDarkMode }) => {
  const theme = getThemeColors(isDarkMode);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-semibold ${theme.text.primary}`}>
            Organization Settings
          </h2>
          <p className={`text-sm mt-1 ${theme.text.muted}`}>
            Manage your organization configuration and details
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${theme.button.primary}`}
        >
          <Settings size={18} />
          {organizationData ? 'Edit Settings' : 'Configure Settings'}
        </button>
      </div>

      {/* Display Current Settings */}
      {organizationData ? (
        <div className={`rounded-xl border p-6 ${theme.neutral.background} ${theme.border.main}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Organization Name */}
            <div>
              <label className={`text-xs font-semibold uppercase tracking-wider ${theme.text.muted}`}>
                Organization Name
              </label>
              <p className={`mt-1 text-sm font-medium ${theme.text.primary}`}>
                {organizationData.practiceName || '-'}
              </p>
            </div>

            {/* Currency */}
            <div>
              <label className={`text-xs font-semibold uppercase tracking-wider ${theme.text.muted}`}>
                Currency
              </label>
              <p className={`mt-1 text-sm font-medium ${theme.text.primary}`}>
                {organizationData.currency || '-'}
              </p>
            </div>

            {/* Timezone */}
            <div>
              <label className={`text-xs font-semibold uppercase tracking-wider ${theme.text.muted}`}>
                Timezone
              </label>
              <p className={`mt-1 text-sm font-medium ${theme.text.primary}`}>
                {organizationData.timezone || '-'}
              </p>
            </div>

            {/* Locale */}
            <div>
              <label className={`text-xs font-semibold uppercase tracking-wider ${theme.text.muted}`}>
                Locale
              </label>
              <p className={`mt-1 text-sm font-medium ${theme.text.primary}`}>
                {organizationData.locale || '-'}
              </p>
            </div>

            {/* Plan Name */}
            <div>
              <label className={`text-xs font-semibold uppercase tracking-wider ${theme.text.muted}`}>
                Plan Name
              </label>
              <p className={`mt-1 text-sm font-medium ${theme.text.primary}`}>
                {organizationData.planName || '-'}
              </p>
            </div>

            {/* Billing Cycle */}
            <div>
              <label className={`text-xs font-semibold uppercase tracking-wider ${theme.text.muted}`}>
                Billing Cycle
              </label>
              <p className={`mt-1 text-sm font-medium ${theme.text.primary} capitalize`}>
                {organizationData.billingCycle || '-'}
              </p>
            </div>

            {/* Tax Percentage */}
            <div>
              <label className={`text-xs font-semibold uppercase tracking-wider ${theme.text.muted}`}>
                Tax Percentage
              </label>
              <p className={`mt-1 text-sm font-medium ${theme.text.primary}`}>
                {organizationData.defaultTaxPercentage ? `${organizationData.defaultTaxPercentage}%` : '-'}
              </p>
            </div>

            {/* Service Charge */}
            <div>
              <label className={`text-xs font-semibold uppercase tracking-wider ${theme.text.muted}`}>
                Service Charge
              </label>
              <p className={`mt-1 text-sm font-medium ${theme.text.primary}`}>
                {organizationData.serviceChargePercentage ? `${organizationData.serviceChargePercentage}%` : '-'}
              </p>
            </div>

            {/* Minimum Order Value */}
            <div>
              <label className={`text-xs font-semibold uppercase tracking-wider ${theme.text.muted}`}>
                Minimum Order Value
              </label>
              <p className={`mt-1 text-sm font-medium ${theme.text.primary}`}>
                {organizationData.minimumOrderValue ? `${organizationData.currency || ''} ${organizationData.minimumOrderValue}` : '-'}
              </p>
            </div>

            {/* Base Delivery Charges */}
            <div>
              <label className={`text-xs font-semibold uppercase tracking-wider ${theme.text.muted}`}>
                Base Delivery Charges
              </label>
              <p className={`mt-1 text-sm font-medium ${theme.text.primary}`}>
                {organizationData.baseDeliveryCharges ? `${organizationData.currency || ''} ${organizationData.baseDeliveryCharges}` : '-'}
              </p>
            </div>

            {/* Start Date */}
            <div>
              <label className={`text-xs font-semibold uppercase tracking-wider ${theme.text.muted}`}>
                Subscription Start
              </label>
              <p className={`mt-1 text-sm font-medium ${theme.text.primary}`}>
                {organizationData.startDate || '-'}
              </p>
            </div>

            {/* End Date */}
            <div>
              <label className={`text-xs font-semibold uppercase tracking-wider ${theme.text.muted}`}>
                Subscription End
              </label>
              <p className={`mt-1 text-sm font-medium ${theme.text.primary}`}>
                {organizationData.endDate || '-'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className={`rounded-xl border border-dashed p-12 text-center ${theme.border.main}`}>
          <Settings size={48} className={`mx-auto mb-4 ${theme.text.muted}`} />
          <h3 className={`text-lg font-semibold mb-2 ${theme.text.primary}`}>
            No Organization Settings Configured
          </h3>
          <p className={`text-sm mb-4 ${theme.text.muted}`}>
            Click the button above to configure your organization settings
          </p>
        </div>
      )}

      {/* Settings Modal */}
      <ReusableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Organization Settings"
        isDarkMode={isDarkMode}
        size="lg"
      >
        <OrganizationSettingsForm
          initialData={organizationData || {}}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isEditMode={!!organizationData}
          isDarkMode={isDarkMode}
        />
      </ReusableModal>
    </div>
  );
};
