import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
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
  cnic: string;
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
  data?: T[];
  pageSize?: number;
  onLoadMore?: (page: number, limit: number) => Promise<T[]>;
}

export function useInfiniteTable<T extends { id: string }>({
  columns,
  data: propData = [],
  pageSize = 10,
  onLoadMore,
}: UseInfiniteTableOptions<T>) {
  const [data, setData] = useState<T[]>(propData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);

  // Track the next page to fetch. If propData has content, we assume page 1 is loaded.
  const [currentPage, setCurrentPage] = useState(propData.length > 0 ? 2 : 1);

  // Lock to prevent duplicate API calls
  const isFetchingRef = useRef(false);

  // Stable reference to the initial data to detect changes (including updates)
  const lastPropDataJson = useRef(JSON.stringify(propData));

  useEffect(() => {
    const currentJson = JSON.stringify(propData);
    if (currentJson !== lastPropDataJson.current) {
      setData(propData);
      // Calculate the next page based on current data length
      const nextPage = Math.floor(propData.length / pageSize) + 1;
      setCurrentPage(propData.length > 0 ? (nextPage > 1 ? nextPage : 2) : 1);
      setHasNextPage(propData.length >= pageSize);
      lastPropDataJson.current = currentJson;

      // Also reset fetching lock if data is reset externally
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  }, [propData, pageSize]);

  const loadMore = useCallback(async () => {
    if (!onLoadMore || isLoading || !hasNextPage || isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const newData = await onLoadMore(currentPage, pageSize);

      if (!newData || newData.length < pageSize) {
        setHasNextPage(false);
      }

      if (newData && newData.length > 0) {
        setData((prev: T[]) => [...prev, ...newData]);
        setCurrentPage((prev: number) => prev + 1);
      }
    } catch (error) {
      console.error('Error loading more entries:', error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
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
    isFetchingRef.current = false;
  }, []);

  const setInitialData = useCallback((newData: T[]) => {
    setData(newData);
    setCurrentPage(2); // Assume page 1 is provided
    setHasNextPage(newData.length >= pageSize);
    isFetchingRef.current = false;
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
    currentPage,
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
      cnic: `${String(Math.floor(Math.random() * 90000) + 10000)}-${String(Math.floor(Math.random() * 9000000) + 1000000)}-${String(Math.floor(Math.random() * 9) + 1)}`,
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
export async function loadMoreUsers(page: number, pageSize = 10): Promise<User[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate end of data after page 5
  if (page > 5) {
    return [];
  }

  return generateMockUsers(pageSize, (page - 1) * pageSize);
}