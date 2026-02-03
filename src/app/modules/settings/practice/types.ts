export interface PracticeSetting {
  id: string;
  practiceName: string;
  contactEmail: string;
  phoneNumber: string;
  timezone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export const mockPracticeSettings: PracticeSetting[] = [
  {
    id: '1',
    practiceName: 'Nexus Food Services',
    contactEmail: 'admin@nexus-food.com',
    phoneNumber: '+1 (555) 123-4567',
    timezone: 'EST (Eastern Standard Time)',
    address: '123 Business St, City, State 12345',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
];
