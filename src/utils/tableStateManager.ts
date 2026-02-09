import { mockTables } from '../app/modules/pos/mockData';
import { Table } from '../app/modules/pos/types';

const STORAGE_KEY = 'nexus_tables_state';
const EVENT_NAME = 'nexus_table_status_updated';

export const tableStateManager = {
    /**
     * Get all tables with persisted status overrides
     */
    getTables(): Table[] {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (!savedState) return mockTables;

        try {
            const overrides = JSON.parse(savedState);
            return mockTables.map(table => ({
                ...table,
                status: overrides[table.id] || table.status
            }));
        } catch (e) {
            console.error('Error parsing table state:', e);
            return mockTables;
        }
    },

    /**
     * Update a specific table's status and notify listeners
     */
    updateStatus(tableId: string, status: 'available' | 'occupied' | 'reserved') {
        const savedState = localStorage.getItem(STORAGE_KEY);
        let overrides: Record<string, string> = {};

        try {
            if (savedState) overrides = JSON.parse(savedState);
        } catch (e) {
            console.error('Error parsing table state for update:', e);
        }

        overrides[tableId] = status;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));

        // Dispatch custom event for cross-component sync
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { tableId, status } }));
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
        const handler = (e: any) => callback(e.detail);
        window.addEventListener(EVENT_NAME, handler);
        return () => window.removeEventListener(EVENT_NAME, handler);
    }
};
