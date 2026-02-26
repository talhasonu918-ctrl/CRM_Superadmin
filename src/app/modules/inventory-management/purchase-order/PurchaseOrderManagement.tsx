import React, { useState } from 'react';
import PurchaseOrderTable from './table/purchaseorder.Table';
import { ReusableModal } from '@/src/components/ReusableModal';
import { DeleteConfirmModal } from '@/src/components/DeleteConfirmModal';
import { Layout } from '@/src/components/NavigationLayout';
import { getThemeColors } from '@/src/theme/colors';

interface PurchaseOrder {
  productName: string;
  uom: string;
  convUnit: number;
  quantity: number;
  bonusQty: number;
  costPrice: number;
  saleTax: number;
  totalCost: number;
  discount: number;
  netCost: number;
}

export default function PurchaseOrderManagement() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Partial<PurchaseOrder>>({});
  const isDarkMode = false;
  const theme = getThemeColors(isDarkMode);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-xl font-bold">Purchase Order Management</h1>

        <PurchaseOrderTable
          onAddOrder={() => setAddModalOpen(true)}
          onEditOrder={(order: PurchaseOrder) => {
            setSelectedOrder(order);
            setEditModalOpen(true);
          }}
          onViewOrder={(order: PurchaseOrder) => {
            setSelectedOrder(order);
            setViewModalOpen(true);
          }}
          onDeleteOrder={(order: PurchaseOrder) => {
            setSelectedOrder(order);
            setDeleteModalOpen(true);
          }}
        />

        {/* Add Purchase Order Modal */}
        <ReusableModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          title="Add Purchase Order"
          isDarkMode={isDarkMode}
        >
          <div>
            {/* Add Purchase Order Form */}
            <p>Add Purchase Order Form goes here.</p>
          </div>
        </ReusableModal>

        {/* Edit Purchase Order Modal */}
        <ReusableModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Edit Purchase Order"
          isDarkMode={isDarkMode}
        >
          <div>
            {/* Edit Purchase Order Form */}
            <p>Edit Purchase Order Form goes here.</p>
          </div>
        </ReusableModal>

        {/* View Purchase Order Modal */}
        <ReusableModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title="View Purchase Order"
          isDarkMode={isDarkMode}
        >
          <div>
            {/* View Purchase Order Details */}
            <p>Purchase Order Details go here.</p>
          </div>
        </ReusableModal>

        {/* Delete Purchase Order Modal */}
        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Purchase Order"
          confirmButtonText="Delete Purchase Order"
          onConfirm={() => {
            console.log('Delete purchase order:', selectedOrder);
            setDeleteModalOpen(false);
          }}
          onCancel={() => setDeleteModalOpen(false)}
          isDarkMode={isDarkMode}
        />
      </div>
    </Layout>
  );
}