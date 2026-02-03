import React from 'react';
import { Branch } from '../types';
import { getThemeColors } from '../../../../../theme/colors';

interface ViewBranchDetailsProps {
  branchData: Partial<Branch>;
  isDarkMode?: boolean;
}

const getStatusBadge = (status: string, isDarkMode: boolean = false) => {
  const statusLower = status.toLowerCase();
  const theme = getThemeColors(isDarkMode);
  if (statusLower === 'active') return `${theme.status.success.bg} ${theme.status.success.text}`;
  if (statusLower === 'inactive') return isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
  if (statusLower === 'under maintenance') return `${theme.status.warning.bg} ${theme.status.warning.text}`;
  return isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
};

export const ViewBranchDetails: React.FC<ViewBranchDetailsProps> = ({
  branchData,
  isDarkMode = false,
}) => {
  const theme = getThemeColors(isDarkMode);
  return (
    <div className="space-y-6">
      {/* Branch Details */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text.tertiary}`}>
              Branch Name
            </label>
            <p className={`px-4 py-3 border-2 rounded-lg ${theme.border.input} ${theme.input.background} ${theme.text.primary}`}>
              {branchData.branchName || '-'}
            </p>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text.tertiary}`}>
              Manager Name
            </label>
            <p className={`px-4 py-3 border-2 rounded-lg ${theme.border.input} ${theme.input.background} ${theme.text.primary}`}>
              {branchData.managerName || '-'}
            </p>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text.tertiary}`}>
              Phone Number
            </label>
            <p className={`px-4 py-3 border-2 rounded-lg ${theme.border.input} ${theme.input.background} ${theme.text.primary}`}>
              {branchData.phoneNumber || '-'}
            </p>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text.tertiary}`}>
              Status
            </label>
            <p className={`px-4 py-3 border-2 rounded-lg ${theme.border.input} ${theme.input.background}`}>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(branchData.status || '', isDarkMode)}`}>
                {branchData.status || '-'}
              </span>
            </p>
          </div>
          <div className="col-span-2">
            <label className={`block text-sm font-medium mb-1 ${theme.text.tertiary}`}>
              Address
            </label>
            <p className={`px-4 py-3 border-2 rounded-lg ${theme.border.input} ${theme.input.background} ${theme.text.primary} min-h-[80px]`}>
              {branchData.address || '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
