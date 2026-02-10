"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Button, Select, ActionIcon } from 'rizzui';
import { Branch, Shift } from '../types';
import { getThemeColors } from '../../../../../theme/colors';
import { MapPin, Search, Plus, Trash2, Clock, ChevronDown, X } from 'lucide-react';
// import toast from 'react-hot-toast';

interface AddBranchFormProps {
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


export const AddBranchForm: React.FC<AddBranchFormProps> = ({
  onSubmit,
  onCancel,
  isDarkMode = false,
}) => {
  const theme = getThemeColors(isDarkMode);
  const { control, handleSubmit, setValue, watch } = useForm<Partial<Branch>>({
    defaultValues: {
      status: 'Active',
      country: 'Pakistan',
      shifts: [{ id: '1', name: 'Morning Shift', startTime: '09:00', endTime: '18:00' }],
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
    const defaultLocation = { lat: 31.5204, lng: 74.3587 }; // Lahore

    const mapInstance = new google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    setMap(mapInstance);

    // Map click: place marker and reverse-geocode to update form fields
    mapInstance.addListener('click', (e: any) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      if (markerRef.current) markerRef.current.setMap(null);
      markerRef.current = new google.maps.Marker({
        position: { lat, lng },
        map: mapInstance,
        draggable: true,
        animation: google.maps.Animation.DROP,
      });

      // When marker dragged, update address as well
      markerRef.current.addListener('dragend', (ev: any) => {
        const newLat = ev.latLng.lat();
        const newLng = ev.latLng.lng();
        reverseGeocode({ lat: newLat, lng: newLng }, google);
      });

      reverseGeocode({ lat, lng }, google);
    });
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
      let country = 'Pakistan';
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
          draggable: true,
          animation: google.maps.Animation.DROP,
        });

        // allow user to drag marker to adjust location and then reverse-geocode
        markerRef.current.addListener('dragend', (ev: any) => {
          const newLat = ev.latLng.lat();
          const newLng = ev.latLng.lng();
          reverseGeocode({ lat: newLat, lng: newLng }, google);
        });
      }
    });

    autocompleteRef.current = autocomplete;
  }, [isMapLoaded, map]);

  // Reverse geocode helper: given a lat/lng, populate address/city/country and lat/lng fields
  const reverseGeocode = (location: { lat: number; lng: number }, google: any) => {
    if (!isMapLoaded || !(window as any).google) return;
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat: location.lat, lng: location.lng };

    geocoder.geocode({ location: latlng }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        const place = results[0];
        const formatted = place.formatted_address;

        setValue('address', formatted);
        setValue('lat', location.lat);
        setValue('lng', location.lng);

        let city = '';
        let country = '';
        place.address_components?.forEach((comp: any) => {
          if (comp.types.includes('locality') || comp.types.includes('sublocality') || comp.types.includes('postal_town')) {
            if (!city) city = comp.long_name;
          }
          if (comp.types.includes('country')) country = comp.long_name;
        });

        // fallback: try to pick administrative_area_level_1 or 2 if locality not present
        if (!city) {
          place.address_components?.forEach((comp: any) => {
            if (comp.types.includes('administrative_area_level_2') || comp.types.includes('administrative_area_level_1')) {
              if (!city) city = comp.long_name;
            }
          });
        }

        if (city) setValue('city', city);
        if (country) setValue('country', country);
      }
    });
  };

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
    if (city && country) {
      triggerGeocode();
    }
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
                  className={`w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${fieldState.error ? theme.status.error.border : theme.border.input} focus:border-orange-500`}
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
                  className={`w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${fieldState.error ? theme.status.error.border : theme.border.input} focus:border-orange-500`}
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
                  className={`w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${fieldState.error ? theme.status.error.border : theme.border.input} focus:border-orange-500`}
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
                className="w-full"
                inPortal={false}
                selectClassName={`!h-10 md:!h-11 !border ${theme.border.input} rounded-lg focus:!border-orange-500 [&_svg.chevron]:aria-expanded:rotate-180`}
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
                        aria-label="Clear status"
                      >
                        <X size={14} />
                      </button>
                    )}
                    <ChevronDown size={18} className="text-gray-400 transition-transform duration-200 chevron" />
                  </div>
                }
              />
            )}
          />
        </div>

        <div className="col-span-1">
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
                  disabled
                  autoComplete="none"
                  onBlur={() => {
                    field.onBlur();
                    triggerGeocode();
                  }}
                  placeholder="Enter country"
                  className={`w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border rounded-lg ${theme.input.background} ${theme.text.primary} ${theme.border.input} focus:border-orange-500 outline-none disabled:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-50`}
                />
              </div>
            )}
          />
        </div>

        <div className="col-span-1">
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
                  disabled
                  autoComplete="none"
                  onBlur={() => {
                    field.onBlur();
                    triggerGeocode();
                  }}
                  placeholder="Enter city"
                  className={`w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border rounded-lg ${theme.input.background} ${theme.text.primary} ${theme.border.input} focus:border-orange-500 outline-none disabled:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-50`}
                />
              </div>
            )}
          />
        </div>

        {/* Address Search */}
        <div className="col-span-1 md:col-span-2">
          <label className={`block text-sm font-medium mb-2 ${theme.text.tertiary}`}>
            Search Address <span className="text-red-500">*</span>
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
                  placeholder="Search for branch location..."
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
        <div className="col-span-1 md:col-span-2">
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className={`h-10 rounded-lg px-8 border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-semibold w-full sm:w-auto`}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className={`${theme.button.primary} h-10 text-white rounded-lg px-8 font-semibold shadow-md active:scale-[0.98] transition-all w-full sm:w-auto`}
        >
          Add Branch
        </Button>
      </div>
    </form>
  );
};
