import React from 'react';
import { PracticeSetting } from '../types';
import { getThemeColors } from '../../../../../theme/colors';

interface ViewPracticeSettingProps {
  settingData: Partial<PracticeSetting>;
  isDarkMode?: boolean;
}

export const ViewPracticeSetting: React.FC<ViewPracticeSettingProps> = ({
  settingData,
  isDarkMode = false,
}) => {
  const theme = getThemeColors(isDarkMode);

  return (
    <div className="space-y-6">
      {/* Practice Setting Details */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text.secondary}`}>
              Practice Name
            </label>
            <p className={`px-4 py-3 border-2 rounded-lg ${theme.border.input} ${theme.input.background} ${theme.text.primary}`}>
              {settingData.practiceName || '-'}
            </p>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text.secondary}`}>
              Contact Email
            </label>
            <p className={`px-4 py-3 border-2 rounded-lg ${theme.border.input} ${theme.input.background} ${theme.text.primary}`}>
              {settingData.contactEmail || '-'}
            </p>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text.secondary}`}>
              Phone Number
            </label>
            <p className={`px-4 py-3 border-2 rounded-lg ${theme.border.input} ${theme.input.background} ${theme.text.primary}`}>
              {settingData.phoneNumber || '-'}
            </p>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text.secondary}`}>
              Timezone
            </label>
            <p className={`px-4 py-3 border-2 rounded-lg ${theme.border.input} ${theme.input.background} ${theme.text.primary}`}>
              {settingData.timezone || '-'}
            </p>
          </div>
          <div className="col-span-2">
            <label className={`block text-sm font-medium mb-1 ${theme.text.secondary}`}>
              Address
            </label>
            <p className={`px-4 py-3 border-2 rounded-lg min-h-[80px] ${theme.border.input} ${theme.input.background} ${theme.text.primary}`}>
              {settingData.address || '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
