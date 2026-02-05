export interface Branch {
  id: string;
  tenantId?: string;
  name: string;
  slug?: string;
  address: string;
  city?: string;
  country?: string;
  lat?: number;
  lng?: number;
  phone?: string;
  email?: string;
  timezone?: string;
  managerUserId?: string;
  status: 'Active' | 'Inactive' | 'Under Maintenance';
  createdAt: string;
  updatedAt?: string;
}

export const mockBranches: Branch[] = [
  {
    id: '1',
    tenantId: 'tenant_1',
    name: 'Downtown Branch',
    slug: 'downtown-branch',
    address: '123 Main Street, Downtown, NY 10001',
    city: 'New York',
    country: 'USA',
    lat: 40.7128,
    lng: -74.0060,
    phone: '+1 (555) 123-4567',
    email: 'downtown@example.com',
    timezone: 'America/New_York',
    managerUserId: 'user_1',
    status: 'Active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    tenantId: 'tenant_1',
    name: 'Midtown Branch',
    slug: 'midtown-branch',
    address: '456 Park Avenue, Midtown, NY 10022',
    city: 'New York',
    country: 'USA',
    lat: 40.7549,
    lng: -73.9840,
    phone: '+1 (555) 234-5678',
    email: 'midtown@example.com',
    timezone: 'America/New_York',
    managerUserId: 'user_2',
    status: 'Active',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
  {
    id: '3',
    tenantId: 'tenant_1',
    name: 'Uptown Branch',
    slug: 'uptown-branch',
    address: '789 Broadway, Uptown, NY 10025',
    city: 'New York',
    country: 'USA',
    lat: 40.8007,
    lng: -73.9580,
    phone: '+1 (555) 345-6789',
    email: 'uptown@example.com',
    timezone: 'America/New_York',
    managerUserId: 'user_3',
    status: 'Under Maintenance',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01',
  },
];
