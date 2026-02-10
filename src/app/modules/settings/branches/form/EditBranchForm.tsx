"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Button, Select, ActionIcon } from 'rizzui';
import { Branch, Shift } from '../types';
import { getThemeColors } from '../../../../../theme/colors';
import { MapPin, Search, Plus, Trash2, Clock, ChevronDown, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface EditBranchFormProps {
  initialData: Partial<Branch>;
  onSubmit: (data: Partial<Branch>) => void;
  onCancel: () => void;
  isDarkMode?: boolean;
}

// Define the option type explicitly
type StatusOption = { label: string; value: Branch['status'] };

const statusOptions: StatusOption[] = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
  { label: 'Under Maintenance', value: 'Under Maintenance' },
];


export const EditBranchForm: React.FC<EditBranchFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isDarkMode = false,
}) => {
  const theme = getThemeColors(isDarkMode);
  const { control, handleSubmit, setValue, reset, watch } = useForm<Partial<Branch>>({
    defaultValues: {
      ...initialData,
      shifts: initialData.shifts || [{ id: '1', name: 'Morning Shift', startTime: '09:00', endTime: '18:00' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "shifts",
  });

  // Map and Autocomplete states
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);
  const markerRef = useRef<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    reset({
      ...initialData,
      shifts: initialData.shifts || [{ id: '1', name: 'Morning Shift', startTime: '09:00', endTime: '18:00' }],
    });
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
        animation: google.maps.Animation.DROP,
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
  const cityValue = watch('city');
  const countryValue = watch('country');
  const geocodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerGeocode = (cityName?: string, countryName?: string) => {
    const targetCity = cityName || cityValue;
    const targetCountry = countryName || countryValue;

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
    if (cityValue && countryValue) {
      triggerGeocode();
    }
    return () => {
      if (geocodeTimeoutRef.current) clearTimeout(geocodeTimeoutRef.current);
    };
  }, [cityValue, countryValue, isMapLoaded, map]);

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
            Branch Name <span className="text-red-500">*</span>
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

        {/* Manager Name */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
            Manager Name
          </label>
          <Controller
            name="managerUserId"
            control={control}
            rules={{}}
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  placeholder="Manager name"
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
            Phone Number <span className="text-red-500">*</span>
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
            Status <span className="text-red-500">*</span>
          </label>
          <Controller
            name="status"
            control={control}
            rules={{ required: 'Status is required' }}
            render={({ field, fieldState }) => (
              <Select
                {...field}
                label=""
                placeholder="Select status"
                options={statusOptions}
                error={fieldState.error?.message}
                className="w-full max-w-xs"
                inPortal={false}
                selectClassName={`!h-11 !border ${theme.border.input} rounded-lg focus:!border-orange-500 [&_svg.chevron]:aria-expanded:rotate-180`}
                optionClassName={`hover:bg-orange-500/20 transition-colors rounded-lg`}
                dropdownClassName="!w-full !h-auto !max-h-[260px]"
                suffix={
                  <div className="flex items-center gap-2 pr-1">
                    {field.value && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          field.onChange('');
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                      </button>
                    )}
                    <ChevronDown size={18} className="text-gray-400 transition-transform duration-200 chevron" />
                  </div>
                }
              />
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

        {/* Address Search */}
        <div className="col-span-2">
          <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
            Change Address <span className="text-red-500">*</span>
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

        {/* Shifts Section */}
        <div className="col-span-2 mt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-base font-bold ${theme.text.primary}`}>Branch Shifts</h3>
              <p className={`text-xs ${theme.text.tertiary}`}>Define working hours for this branch</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ id: Date.now().toString(), name: '', startTime: '09:00', endTime: '18:00', days: [] })}
              className={`h-9 gap-2 border-orange-200 text-orange-600 hover:bg-orange-50`}
            >
              <Plus size={16} /> Add Shift
            </Button>
          </div>

          <div className={`rounded-xl border ${theme.border.input} overflow-hidden shadow-sm`}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`${theme.neutral.backgroundSecondary}`}>
                  <th className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wider ${theme.text.tertiary} w-1/3`}>Shift Name <span className="text-red-500">*</span></th>
                  <th className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wider ${theme.text.tertiary}`}>Start Time</th>
                  <th className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wider ${theme.text.tertiary}`}>End Time</th>
                  <th className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wider ${theme.text.tertiary} w-10`}></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {fields.length === 0 ? (
                  <tr>
                    <td colSpan={4} className={`px-4 py-8 text-center text-xs ${theme.text.tertiary} italic`}>
                      No shifts added. Working hours will be undefined.
                    </td>
                  </tr>
                ) : (
                  fields.map((field, index) => (
                    <tr key={field.id} className={`${theme.input.background} hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors`}>
                      <td className="px-4 py-3">
                        <Controller
                          name={`shifts.${index}.name` as const}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: inputField }) => (
                            <input
                              {...inputField}
                              placeholder="e.g. Morning Shift"
                              title={inputField.value}
                              className={`w-full px-3 py-2 border text-xs rounded-md focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${theme.border.input} focus:border-orange-500 truncate`}
                            />
                          )}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Controller
                          name={`shifts.${index}.startTime` as const}
                          control={control}
                          render={({ field: inputField }) => (
                            <div className="relative group">
                              <input
                                {...inputField}
                                type="time"
                                className={`w-full px-3 py-2 border text-xs rounded-md focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${theme.border.input} focus:border-orange-500 appearance-none`}
                              />
                            </div>
                          )}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Controller
                          name={`shifts.${index}.endTime` as const}
                          control={control}
                          render={({ field: inputField }) => (
                            <div className="relative group">
                              <input
                                {...inputField}
                                type="time"
                                className={`w-full px-3 py-2 border text-xs rounded-md focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${theme.border.input} focus:border-orange-500 appearance-none`}
                              />
                            </div>
                          )}
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <ActionIcon
                          size="sm"
                          variant="text"
                          onClick={() => remove(index)}
                          className={`text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20`}
                        >
                          <Trash2 size={16} />
                        </ActionIcon>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
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
