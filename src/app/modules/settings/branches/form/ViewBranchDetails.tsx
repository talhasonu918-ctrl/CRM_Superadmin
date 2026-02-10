import React, { useEffect, useRef, useState } from 'react';
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
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Load Google Maps Script (Read-only view)
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    if ((window as any).google) {
      setIsMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.onload = () => setIsMapLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !(window as any).google) return;

    const google = (window as any).google;
    const location = {
      lat: Number(branchData.lat) || 31.5204,
      lng: Number(branchData.lng) || 74.3587
    };

    const mapInstance = new google.maps.Map(mapRef.current, {
      center: location,
      zoom: 15,
      disableDefaultUI: true,
      gestureHandling: 'cooperative',
    });

    if (branchData.lat && branchData.lng) {
      new google.maps.Marker({
        position: location,
        map: mapInstance,
      });
    }
  }, [isMapLoaded, branchData.lat, branchData.lng]);

  return (
    <div className="space-y-6">
      {/* Branch Details */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-2 sm:gap-4">
              <h3 className={`text-lg sm:text-xl font-bold ${theme.text.primary}`}>{branchData.name || '-'}</h3>
              <div className="flex items-center justify-start sm:justify-center">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge((branchData.status as string) || '', isDarkMode)}`}>
                  {branchData.status || '-'}
                </span>
              </div>
            </div>
            <div className={`text-sm ${theme.text.secondary} mt-1`}>
              {branchData.slug ? `Slug: ${branchData.slug}` : branchData.id ? `ID: ${branchData.id}` : null}
            </div>
          </div>
        </div>

        {/* Map Visualization */}
        <div className="w-full h-40 rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-slate-50 flex items-center justify-center">
          <div ref={mapRef} className="w-full h-full" />
        </div>

        <div className="grid grid-cols-1 gap-4">
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

        <div className="grid sm:grid-cols-2 gap-4">
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

          <div className="col-span-1">
            <label className={`block text-sm font-medium mb-1 ${theme.text.tertiary}`}>
              Address
            </label>
            <p className={`px-4 py-3 border text-sm rounded-lg ${theme.border.input} ${theme.input.background} ${theme.text.primary} min-h-[60px]`}>
              {branchData.address || '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
