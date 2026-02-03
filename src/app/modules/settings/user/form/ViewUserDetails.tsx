import React from 'react';
import { User } from '../../../../../hooks/useInfiniteTable';
import { getThemeColors } from '../../../../../theme/colors';

interface ViewUserDetailsProps {
  userData: Partial<User>;
  isDarkMode?: boolean;
}

// Helper function to get status badge classes
const getStatusBadge = (status: string, isDarkMode: boolean) => {
  const statusLower = status.toLowerCase();
  const theme = getThemeColors(isDarkMode);
  if (statusLower === 'active') return `${theme.status.success.bg} ${theme.status.success.text}`;
  if (statusLower === 'inactive') return `${theme.neutral.backgroundSecondary} ${theme.text.secondary}`;
  if (statusLower === 'suspended') return `${theme.status.error.bg} ${theme.status.error.text}`;
  return `${theme.neutral.backgroundSecondary} ${theme.text.secondary}`;
};

export const ViewUserDetails: React.FC<ViewUserDetailsProps> = ({
  userData,
  isDarkMode = false,
}) => {
  const theme = getThemeColors(isDarkMode);
  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      {userData.avatar && (
        <div className="flex justify-center">
          <img
            src={userData.avatar}
            alt={`${userData.firstName} ${userData.lastName}`}
            className={`w-24 h-24 rounded-full object-cover border-4 ${theme.border.input}`}
          />
        </div>
      )}

      {/* User Details */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text.tertiary}`}>
              First Name
            </label>
            <p className={`px-4 py-3 border-2 rounded-lg ${theme.border.input} ${theme.neutral.backgroundSecondary} ${theme.text.primary}`}>
              {userData.firstName || '-'}
            </p>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text.tertiary}`}>
              Last Name
            </label>
            <p className={`px-4 py-3 border-2 rounded-lg ${theme.border.input} ${theme.neutral.backgroundSecondary} ${theme.text.primary}`}>
              {userData.lastName || '-'}
            </p>
          </div>
          <div className="col-span-2">
            <label className={`block text-sm font-medium mb-1 ${theme.text.tertiary}`}>
              Email
            </label>
            <p className={`px-4 py-3 border-2 rounded-lg ${theme.border.input} ${theme.neutral.backgroundSecondary} ${theme.text.primary}`}>
              {userData.email || '-'}
            </p>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text.tertiary}`}>
              Contact
            </label>
            <p className={`px-4 py-3 border-2 rounded-lg ${theme.border.input} ${theme.neutral.backgroundSecondary} ${theme.text.primary}`}>
              {userData.contact || '-'}
            </p>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text.tertiary}`}>
              Gender
            </label>
            <p className={`px-4 py-3 border-2 rounded-lg ${theme.border.input} ${theme.neutral.backgroundSecondary} ${theme.text.primary}`}>
              {userData.gender || '-'}
            </p>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text.tertiary}`}>
              Status
            </label>
            <p className={`px-4 py-3 border-2 rounded-lg ${theme.border.input} ${theme.neutral.backgroundSecondary}`}>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(userData.status || '', isDarkMode)}`}>
                {userData.status || '-'}
              </span>
            </p>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text.tertiary}`}>
              Role
            </label>
            <p className={`px-4 py-3 border-2 rounded-lg ${theme.border.input} ${theme.neutral.backgroundSecondary} ${theme.text.primary}`}>
              {userData.role || '-'}
            </p>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text.tertiary}`}>
              User Code
            </label>
            <p className={`px-4 py-3 border-2 rounded-lg ${theme.border.input} ${theme.neutral.backgroundSecondary} ${theme.text.primary}`}>
              {userData.userCode || '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
