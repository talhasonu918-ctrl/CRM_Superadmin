export interface Branch {
  id: string;
  branchName: string;
  managerName: string;
  phoneNumber: string;
  address: string;
  status: 'Active' | 'Inactive' | 'Under Maintenance';
  createdAt: string;
  updatedAt: string;
}

export const mockBranches: Branch[] = [
  {
    id: '1',
    branchName: 'Downtown Branch',
    managerName: 'John Smith',
    phoneNumber: '+1 (555) 123-4567',
    address: '123 Main Street, Downtown, NY 10001',
    status: 'Active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    branchName: 'Midtown Branch',
    managerName: 'Sarah Johnson',
    phoneNumber: '+1 (555) 234-5678',
    address: '456 Park Avenue, Midtown, NY 10022',
    status: 'Active',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
  {
    id: '3',
    branchName: 'Uptown Branch',
    managerName: 'Mike Davis',
    phoneNumber: '+1 (555) 345-6789',
    address: '789 Broadway, Uptown, NY 10025',
    status: 'Under Maintenance',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01',
  },
];
