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
      <div className="space-y-4 ">
        <div className="flex items-center    justify-between">
          <div className='w-full'>
            <div className='flex justify-between items-center w-full gap-4'>
                      <h3 className={`text-xl font-bold ${theme.text.primary}`}>{branchData.name || '-'}</h3>

             {/* <p className={`px-4 py-3 border-2 rounded-lg ${theme.border.input} ${theme.input.background}`}> */}
              <div className="flex items-center justify-center">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge((branchData.status as string) || '', isDarkMode)}`}>
                  {branchData.status || '-'}
                </span>
              </div>
            {/* </p> */}
            </div>
              <div className={`text-sm ${theme.text.secondary} mt-1`}>{branchData.slug ? `Slug: ${branchData.slug}` : branchData.id ? `ID: ${branchData.id}` : null}</div>
          </div>
       
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text.tertiary}`}>
              Manager
            </label>
            <p className={`px-4 py-3 text-sm border rounded-lg ${theme.border.input} ${theme.input.background} ${theme.text.primary}`}>
              {(branchData as any).managerUserId || '-'}
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text.tertiary}`}>
              Phone
            </label>
            <p className={`px-4 py-3 text-sm border rounded-lg ${theme.border.input} ${theme.input.background} ${theme.text.primary}`}>
              {(branchData as any).phone || '-'}
            </p>
          </div>
          </div>
  <div className="grid grid-cols-1 gap-4">
          {/* <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text.tertiary}`}>
              Status
            </label>
            <p className={`px-4 py-3 border-2 rounded-lg ${theme.border.input} ${theme.input.background}`}>
              <div className="flex items-center justify-center">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge((branchData.status as string) || '', isDarkMode)}`}>
                  {branchData.status || '-'}
                </span>
              </div>
            </p>
          </div> */}

          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text.tertiary}`}>
              Email
            </label>
            <p className={`px-4 text-sm py-3 border overflow-hidden rounded-lg ${theme.border.input} ${theme.input.background} ${theme.text.primary}`}>
              {branchData.email || '-'}
            </p>
          </div>
          </div>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text.tertiary}`}>
              City
            </label>
            <p className={`px-4 py-3 border text-sm rounded-lg ${theme.border.input} ${theme.input.background} ${theme.text.primary}`}>
              {branchData.city || '-'}
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text.tertiary}`}>
              Country
            </label>
            <p className={`px-4 py-3 border text-sm rounded-lg ${theme.border.input} ${theme.input.background} ${theme.text.primary}`}>
              {branchData.country || '-'}
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text.tertiary}`}>
              Lat
            </label>
            <p className={`px-4 py-3 border text-sm  rounded-lg ${theme.border.input} ${theme.input.background} ${theme.text.primary}`}>
              {typeof branchData.lat === 'number' ? branchData.lat : (branchData.lat || '-')}
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.text.tertiary}`}>
              Lng
            </label>
            <p className={`px-4 py-3 border text-sm rounded-lg ${theme.border.input} ${theme.input.background} ${theme.text.primary}`}>
              {typeof branchData.lng === 'number' ? branchData.lng : (branchData.lng || '-')}
            </p>
          </div>

          <div className="col-span-2">
            <label className={`block text-sm font-medium mb-1 ${theme.text.tertiary}`}>
              Address
            </label>
            <p className={`px-4 py-3 border text-sm rounded-lg ${theme.border.input} ${theme.input.background} ${theme.text.primary} min-h-[80px]`}>
              {branchData.address || '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
