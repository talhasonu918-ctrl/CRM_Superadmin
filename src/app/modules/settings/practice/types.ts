export interface PracticeSetting {
  id: string;

  // Basic Information
  practiceName: string;
  logo?: File | string;
  currency: string;
  timezone: string;
  locale: string;

  // Subscription Details
  planName: string;
  startDate: string;
  endDate: string;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';

  // Business Settings
  defaultTaxPercentage: number;
  serviceChargePercentage: number;
  minimumOrderValue: number;
  baseDeliveryCharges: number;

  // Legacy fields (keeping for backward compatibility)
  contactEmail?: string;
  phoneNumber?: string;
  address?: string;

  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

export const mockPracticeSettings: PracticeSetting[] = [
  {
    id: '1',
    practiceName: 'Nexus Food Services',
    currency: 'USD',
    timezone: 'EST',
    locale: 'en-US',
    planName: 'Premium',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    billingCycle: 'yearly',
    defaultTaxPercentage: 18,
    serviceChargePercentage: 10,
    minimumOrderValue: 100,
    baseDeliveryCharges: 50,
    contactEmail: 'admin@nexus-food.com',
    phoneNumber: '+1 (555) 123-4567',
    address: '123 Business St, City, State 12345',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    practiceName: 'Global Cuisine Hub',
    currency: 'EUR',
    timezone: 'GMT',
    locale: 'en-GB',
    planName: 'Enterprise',
    startDate: '2024-02-01',
    endDate: '2025-01-31',
    billingCycle: 'yearly',
    defaultTaxPercentage: 20,
    serviceChargePercentage: 12,
    minimumOrderValue: 150,
    baseDeliveryCharges: 60,
    contactEmail: 'admin@globalcuisine.com',
    phoneNumber: '+44 20 1234 5678',
    address: '456 High Street, London, UK',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01',
  },
  {
    id: '3',
    practiceName: 'Spice Route Restaurant',
    currency: 'INR',
    timezone: 'IST',
    locale: 'en-IN',
    planName: 'Standard',
    startDate: '2024-03-01',
    endDate: '2024-08-31',
    billingCycle: 'monthly',
    defaultTaxPercentage: 5,
    serviceChargePercentage: 8,
    minimumOrderValue: 200,
    baseDeliveryCharges: 40,
    contactEmail: 'admin@spiceroute.in',
    phoneNumber: '+91 98765 43210',
    address: '789 MG Road, Bangalore, India',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01',
  },
];
