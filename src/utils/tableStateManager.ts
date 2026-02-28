import { mockTables } from '../app/modules/pos/mockData';
import { Table } from '../app/modules/pos/types';

const STORAGE_KEY = 'nexus_tables_state';
const EVENT_NAME = 'nexus_table_status_updated';

export const tableStateManager = {
    /**
     * Get all tables with persisted status overrides
     */
    getTables(): Table[] {
        if (typeof window === 'undefined') return mockTables; // SSR guard
        try {
            const savedState = localStorage.getItem(STORAGE_KEY);
            if (!savedState) return mockTables;
            const overrides = JSON.parse(savedState);
            return mockTables.map(table => ({
                ...table,
                status: overrides[table.id] || table.status
            }));
        } catch {
            return mockTables;
        }
    },

    /**
     * Update a specific table's status and notify listeners
     */
    updateStatus(tableId: string, status: 'available' | 'occupied' | 'reserved') {
        if (typeof window === 'undefined') return; // SSR guard
        try {
            const savedState = localStorage.getItem(STORAGE_KEY);
            let overrides: Record<string, string> = {};
            if (savedState) overrides = JSON.parse(savedState);
            overrides[tableId] = status;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
            window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { tableId, status } }));
        } catch {
            // Silently fail on iOS private mode
        }
    },

    /**
     * Get tables filtered by status
     */
    getTablesByStatus(status: 'available' | 'occupied' | 'reserved'): Table[] {
        return this.getTables().filter(t => t.status === status);
    },

    /**
     * Subscribe to status updates
     */
    subscribe(callback: (detail: { tableId: string, status: string }) => void) {
        if (typeof window === 'undefined') return () => {}; // SSR guard
        const handler = (e: any) => callback(e.detail);
        window.addEventListener(EVENT_NAME, handler);
        return () => window.removeEventListener(EVENT_NAME, handler);
    }
};
