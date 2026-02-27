import React, { useState } from 'react';
import { UserTable as PurchaseOrderTable } from './table/table'; // Changed to default import

const PurchaseOrderPage: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([
    {
      productName: 'Product A',
      uom: 'kg',
      convUnit: 1,
      quantity: 10,
      bonusQty: 2,
      costPrice: 100,
      saleTax: 10,
      totalCost: 1100,
      discount: 50,
      netCost: 1050,
    },
    {
      productName: 'Product B',
      uom: 'liters',
      convUnit: 1,
      quantity: 5,
      bonusQty: 1,
      costPrice: 200,
      saleTax: 20,
      totalCost: 1020,
      discount: 20,
      netCost: 1000,
    },
  ]);

  return (
    <div className="purchase-order-page">
      <h1 className="text-2xl font-bold mb-4">Purchase Order</h1>
      <PurchaseOrderTable isDarkMode={false} onAddUser={() => {}} onEditUser={() => {}} onViewUser={() => {}} onDeleteUser={() => {}} />
    </div>
  );
};

export const PurchaseOrderView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <div className={`purchase-order-view ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* <h1 className="text-2xl font-bold mb-4">Purchase Order</h1> */}
      <PurchaseOrderTable isDarkMode={isDarkMode} onAddUser={() => {}} onEditUser={() => {}} onViewUser={() => {}} onDeleteUser={() => {}} />
    </div>
  );
};

export default PurchaseOrderPage;

