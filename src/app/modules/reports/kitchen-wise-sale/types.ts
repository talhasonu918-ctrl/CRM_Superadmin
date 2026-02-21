import type { KitchenSaleReportData, KitchenSaleTransaction } from '@/src/app/modules/pos/mockData';

export interface ExtendedKitchenSaleReportData extends KitchenSaleReportData {
  transactions: KitchenSaleTransaction[];
}
