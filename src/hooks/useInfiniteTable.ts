import { useState, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';

export interface User {
  id: string;
  userCode: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  contact: string;
  avatar?: string;
  gender: 'Male' | 'Female' | 'Other';
  active: boolean;
  status: 'Active' | 'Inactive' | 'Suspended';
  role: 'Admin' | 'Manager' | 'Staff' | 'Driver';
  branch: string;
  createdAt: string;
}

interface UseInfiniteTableOptions<T> {
  columns: ColumnDef<T>[];
  initialData?: T[];
  pageSize?: number;
  onLoadMore?: (page: number) => Promise<T[]>;
}

export function useInfiniteTable<T extends { id: string }>({
  columns,
  initialData = [],
  pageSize = 20,
  onLoadMore,
}: UseInfiniteTableOptions<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const loadMore = useCallback(async () => {
    if (!onLoadMore || isLoading || !hasNextPage) return;

    setIsLoading(true);
    try {
      const newData = await onLoadMore(currentPage);
      if (newData.length < pageSize) {
        setHasNextPage(false);
      }
      setData(prev => [...prev, ...newData]);
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onLoadMore, isLoading, hasNextPage, currentPage, pageSize]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  const resetData = useCallback(() => {
    setData([]);
    setCurrentPage(1);
    setHasNextPage(true);
    setIsLoading(false);
  }, []);

  const setInitialData = useCallback((newData: T[]) => {
    setData(newData);
    setCurrentPage(1);
    setHasNextPage(newData.length >= pageSize);
  }, [pageSize]);

  return {
    table,
    data,
    isLoading,
    hasNextPage,
    loadMore,
    resetData,
    setInitialData,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
  };
}

// Mock data generator for users
export function generateMockUsers(count: number, startIndex = 0): User[] {
  const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Tom', 'Emma', 'Chris', 'Anna'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const branches = ['Downtown Branch', 'Midtown Branch', 'Uptown Branch', 'Riverside Branch'];
  const roles: User['role'][] = ['Admin', 'Manager', 'Staff', 'Driver'];
  const genders: User['gender'][] = ['Male', 'Female', 'Other'];

  return Array.from({ length: count }, (_, index) => {
    const actualIndex = startIndex + index;
    const firstName = firstNames[actualIndex % firstNames.length];
    const lastName = lastNames[actualIndex % lastNames.length];

    return {
      id: `user-${actualIndex + 1}`,
      userCode: `USR${String(actualIndex + 1).padStart(4, '0')}`,
      firstName,
      lastName,
      userName: `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@nexus-food.com`,
      contact: `+1 (${String(Math.floor(Math.random() * 900) + 100)}) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
      gender: genders[actualIndex % genders.length],
      active: Math.random() > 0.5, // 50% chance of being active
      status: actualIndex % 10 === 0 ? 'Inactive' : actualIndex % 15 === 0 ? 'Suspended' : 'Active',
      role: roles[actualIndex % roles.length],
      branch: branches[actualIndex % branches.length],
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    };
  });
}

// Mock API function to simulate loading more users
export async function loadMoreUsers(page: number, pageSize = 20): Promise<User[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate end of data after page 5
  if (page > 5) {
    return [];
  }

  return generateMockUsers(pageSize, (page - 1) * pageSize);
}