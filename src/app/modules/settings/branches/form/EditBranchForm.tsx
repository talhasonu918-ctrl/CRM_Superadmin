import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'rizzui';
import Select from 'react-select';
import { Branch } from '../types';
import { getThemeColors } from '../../../../../theme/colors';
import { MapPin, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface EditBranchFormProps {
  initialData: Partial<Branch>;
  onSubmit: (data: Partial<Branch>) => void;
  onCancel: () => void;
  isDarkMode?: boolean;
}

// Define the option type explicitly
type StatusOption = { label: string; value: Branch['status'] };

const statusOptions: readonly StatusOption[] = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
  { label: 'Under Maintenance', value: 'Under Maintenance' },
] as const;

const getSelectStyles = (hasError?: boolean, theme?: any, isDarkMode?: boolean) => ({
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: isDarkMode ? theme?.neutral?.background : 'inherit',
    border: hasError
      ? `1px solid ${theme?.status?.error?.border || '#ef4444'}`
      : state.isFocused
        ? `1px solid ${theme?.border?.focus || '#f97316'}`
        : `1px solid ${theme?.border?.input || '#d1d5db'}`,
    borderRadius: '0.5rem',
    padding: '0.25rem',
    boxShadow: 'none',
    '&:hover': {
      borderColor: state.isFocused ? (theme?.border?.focus || '#f97316') : (theme?.border?.input || '#d1d5db'),
    },
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: isDarkMode ? theme?.neutral?.backgroundSecondary : 'inherit',
    border: `1px solid ${theme?.border?.input || '#d1d5db'}`,
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? theme?.primary?.main || '#f97316'
      : state.isFocused
        ? theme?.primary?.light || '#fed7aa'
        : 'transparent',
    color: state.isSelected ? theme?.text?.onPrimary || 'white' : theme?.text?.primary || 'inherit',
    cursor: 'pointer',
  }),
  singleValue: (base: any) => ({
    ...base,
    color: theme?.text?.primary || 'inherit',
  }),
  input: (base: any) => ({
    ...base,
    color: theme?.text?.primary || 'inherit',
  }),
  placeholder: (base: any) => ({
    ...base,
    color: theme?.text?.tertiary || '#94a3b8',
  }),
});

export const EditBranchForm: React.FC<EditBranchFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isDarkMode = false,
}) => {
  const theme = getThemeColors(isDarkMode);
  const { control, handleSubmit, setValue, reset, watch } = useForm<Partial<Branch>>({
    defaultValues: initialData,
  });

  // Map and Autocomplete states
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);
  const markerRef = useRef<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  // Load Google Maps Script
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('Google Maps API Key is missing!');
      return;
    }

    if ((window as any).google) {
      setIsMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsMapLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !(window as any).google) return;

    const google = (window as any).google;
    const initialLocation = {
      lat: Number(initialData.lat) || 31.5204,
      lng: Number(initialData.lng) || 74.3587
    };

    const mapInstance = new google.maps.Map(mapRef.current, {
      center: initialLocation,
      zoom: 14,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    if (initialData.lat && initialData.lng) {
      markerRef.current = new google.maps.Marker({
        position: initialLocation,
        map: mapInstance,
      });
    }

    setMap(mapInstance);
  }, [isMapLoaded]);

  // Initialize Autocomplete
  useEffect(() => {
    if (!isMapLoaded || !addressInputRef.current || !(window as any).google) return;

    const google = (window as any).google;
    const autocomplete = new google.maps.places.Autocomplete(addressInputRef.current, {
      componentRestrictions: { country: 'pk' },
      fields: ['formatted_address', 'geometry', 'address_components', 'name'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      // Set form values
      setValue('address', place.formatted_address);
      setValue('lat', location.lat);
      setValue('lng', location.lng);

      // Extract city and country
      let city = '';
      let country = '';
      place.address_components?.forEach((comp: any) => {
        if (comp.types.includes('locality')) city = comp.long_name;
        if (comp.types.includes('country')) country = comp.long_name;
      });
      if (city) setValue('city', city);
      if (country) setValue('country', country);

      // Update Map
      if (map) {
        map.setCenter(location);
        map.setZoom(16);

        if (markerRef.current) markerRef.current.setMap(null);
        markerRef.current = new google.maps.Marker({
          position: location,
          map: map,
          animation: google.maps.Animation.DROP,
        });
      }
    });

    autocompleteRef.current = autocomplete;
  }, [isMapLoaded, map]);

  // Handle manual City/Country changes to update map
  const city = watch('city');
  const country = watch('country');
  const geocodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerGeocode = (cityName?: string, countryName?: string) => {
    const targetCity = cityName || city;
    const targetCountry = countryName || country;

    if (!isMapLoaded || !targetCity || !targetCountry || !(window as any).google) return;

    if (geocodeTimeoutRef.current) clearTimeout(geocodeTimeoutRef.current);

    geocodeTimeoutRef.current = setTimeout(() => {
      const google = (window as any).google;
      if (!google || !google.maps || !google.maps.Geocoder) return;

      const geocoder = new google.maps.Geocoder();
      const addressString = `${targetCity.trim()}, ${targetCountry.trim()}`;

      geocoder.geocode({ address: addressString }, (results: any, status: any) => {
        if (status === 'OK' && results[0] && map) {
          const loc = results[0].geometry.location;
          const location = { lat: loc.lat(), lng: loc.lng() };

          map.panTo(location);
          map.setZoom(12);

          if (markerRef.current) markerRef.current.setMap(null);
          markerRef.current = new google.maps.Marker({
            position: location,
            map: map,
            animation: google.maps.Animation.DROP,
          });

          setValue('lat', location.lat);
          setValue('lng', location.lng);
        }
      });
    }, 500);
  };

  useEffect(() => {
    triggerGeocode();
    return () => {
      if (geocodeTimeoutRef.current) clearTimeout(geocodeTimeoutRef.current);
    };
  }, [city, country, isMapLoaded, map]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <style jsx global>{`
        .pac-container {
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          margin-top: 4px;
          z-index: 9999 !important;
        }
        .pac-item {
          padding: 8px 12px;
          cursor: pointer;
          font-size: 13px;
        }
        .pac-item:hover {
          background-color: #f9731610;
        }
        .pac-item-query {
          font-weight: 600;
          color: #111827;
        }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-5">
        {/* Branch Name */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
            Branch Name
          </label>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Branch name is required' }}
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  placeholder="Branch name"
                  className={`w-full px-4 py-3 border text-sm rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${fieldState.error ? theme.status.error.border : theme.border.input} focus:border-orange-500`}
                />
                {fieldState.error && (
                  <p className={`${theme.status.error.text} text-sm mt-1`}>{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* Manager User ID */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
            Manager ID
          </label>
          <Controller
            name="managerUserId"
            control={control}
            rules={{}}
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  placeholder="Manager user ID"
                  className={`w-full px-4 py-3 border text-sm rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${fieldState.error ? theme.status.error.border : theme.border.input} focus:border-orange-500`}
                />
                {fieldState.error && (
                  <p className={`${theme.status.error.text} text-sm mt-1`}>{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
            Phone Number
          </label>
          <Controller
            name="phone"
            control={control}
            rules={{
              required: 'Phone number is required',
              pattern: {
                value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
                message: 'Invalid phone number format',
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  type="tel"
                  placeholder="Phone number"
                  className={`w-full px-4 py-3 border text-sm rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${fieldState.error ? theme.status.error.border : theme.border.input} focus:border-orange-500`}
                />
                {fieldState.error && (
                  <p className={`${theme.status.error.text} text-sm mt-1`}>{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* Status */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
            Status
          </label>
          <Controller
            name="status"
            control={control}
            rules={{ required: 'Status is required' }}
            render={({ field, fieldState }) => (
              <>
                <Select<StatusOption>
                  {...field}
                  options={statusOptions}
                  onChange={(opt) => field.onChange(opt?.value)}
                  value={statusOptions.find((opt) => opt.value === field.value)}
                  classNamePrefix="custom-select"
                  placeholder="Select status"
                  className={`w-full text-sm focus:ring-none focus:outline-none ${isDarkMode ? 'dark:text-white' : ''}`}
                  styles={getSelectStyles(!!fieldState.error, theme, isDarkMode)}
                />
                {fieldState.error && (
                  <p className={`${theme.status.error.text} text-sm mt-1`}>{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
            City
          </label>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <input
                  {...field}
                  autoComplete="none"
                  onBlur={() => {
                    field.onBlur();
                    triggerGeocode();
                  }}
                  placeholder="Enter city"
                  className={`w-full px-4 py-3 border text-sm rounded-lg ${theme.input.background} ${theme.text.primary} ${theme.border.input} focus:border-orange-500 outline-none`}
                />
              </div>
            )}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
            Country
          </label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <input
                  {...field}
                  autoComplete="none"
                  onBlur={() => {
                    field.onBlur();
                    triggerGeocode();
                  }}
                  placeholder="Enter country"
                  className={`w-full px-4 py-3 border text-sm rounded-lg ${theme.input.background} ${theme.text.primary} ${theme.border.input} focus:border-orange-500 outline-none`}
                />
                <button
                  type="button"
                  onClick={() => triggerGeocode()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-600 transition-colors"
                  title="Sync map with city/country"
                >
                  <MapPin size={16} />
                </button>
              </div>
            )}
          />
        </div>

        {/* Address Search */}
        <div className="col-span-2">
          <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
            Change Address
          </label>
          <Controller
            name="address"
            control={control}
            rules={{ required: 'Address is required' }}
            render={({ field, fieldState }) => (
              <div className="relative group">
                <input
                  {...field}
                  ref={(e) => {
                    field.ref(e);
                    (addressInputRef as any).current = e;
                  }}
                  placeholder="Search to update location..."
                  className={`w-full pl-11 pr-4 py-3 border text-sm rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} placeholder:${theme.text.tertiary} ${fieldState.error ? theme.status.error.border : theme.border.input} focus:border-orange-500`}
                />
                <Search size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.text.tertiary} group-focus-within:text-orange-500 transition-colors`} />
                {fieldState.error && (
                  <p className={`${theme.status.error.text} text-sm mt-1`}>{fieldState.error.message}</p>
                )}
              </div>
            )}
          />
        </div>

        {/* Map Display */}
        <div className="col-span-2">
          <div
            ref={mapRef}
            className={`w-full h-48 rounded-lg border ${theme.border.input} overflow-hidden shadow-inner bg-slate-100 flex items-center justify-center`}
          >
            {!isMapLoaded && (
              <div className="text-xs font-semibold text-slate-400 flex flex-col items-center gap-2">
                <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                Loading Map...
              </div>
            )}
          </div>
        </div>

        {/* Lat/Lng (Hidden but bound to form) */}
        <Controller name="lat" control={control} render={({ field }) => <input type="hidden" {...field} />} />
        <Controller name="lng" control={control} render={({ field }) => <input type="hidden" {...field} />} />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className={`h-10 rounded-lg px-8 border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-semibold`}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className={`${theme.button.primary} h-10 text-white rounded-lg px-8 font-semibold shadow-md active:scale-[0.98] transition-all`}
        >
          Update Branch
        </Button>
      </div>
    </form>
  );
};
