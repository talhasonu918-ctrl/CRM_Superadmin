import React from 'react';

interface Order {
  id: string;
  orderNumber: string;
  customerName?: string;
  tableId?: string;
  waiterName?: string;
  customerPhone?: string;
  riderName?: string;
  riderPhone?: string;
  deliveryAddress?: string;
  status: string;
  type: string;
  items?: { name: string; price: number; quantity: number }[];
  subtotal: number;
  tax: number;
  discount: number;
  grandTotal: number;
  createdAt: string;
  completedAt: string;
  refundedAt?: string;
  cancellationReason?: string;
  refundReason?: string;
  paymentMethod?: string;
}

interface OrderReceiptProps {
    order: Order | null;
    branchInfo?: { name: string; phone: string; location: string };
}

const defaultBranch = {
    name: 'Main Branch',
    location: 'M.A Jinnah road Okara',
    phone: '+92 300 1234567'
};

export const OrderReceipt: React.FC<OrderReceiptProps> = ({
    order,
    branchInfo = defaultBranch
}) => {
    if (!order) return null;

    // Format date and time
    const dateTime = order.createdAt.split(' ');
    const date = dateTime[0] || new Date().toISOString().split('T')[0];
    const time = dateTime[1] || new Date().toTimeString().slice(0, 5);
    
    // Use order properties directly
    const items = order.items || [];
    const subTotal = order.subtotal || 0;
    const paymentMethod = order.paymentMethod || 'Cash';

    // Debug logging
    console.log('OrderReceipt - Order data:', order);
    console.log('OrderReceipt - Items:', items);

    return (
        <>
            <style>{`
                @media print {
                    @page {
                        size: 80mm auto;
                        margin: 0;
                    }
                    body, html {
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 80mm !important;
                        height: auto !important;
                    }
                    body * {
                        visibility: hidden;
                    }
                    #order-receipt-content, #order-receipt-content * {
                        visibility: visible;
                    }
                    #order-receipt-content {
                        position: absolute;
                        left: 50%;
                        top: 0;
                        transform: translateX(-50%);
                        display: block !important;
                        width: 80mm !important;
                        max-width: 80mm !important;
                        padding: 4mm !important;
                        color: #000 !important;
                        background: #fff !important;
                        font-family: 'Courier New', Courier, monospace !important;
                    }
                    .thermal-header {
                        text-align: center;
                        margin-bottom: 8px;
                    }
                    .thermal-brand {
                        font-size: 18px;
                        font-weight: bold;
                        letter-spacing: 2px;
                        margin-bottom: 4px;
                    }
                    .thermal-branch {
                        font-size: 14px;
                        font-weight: bold;
                        letter-spacing: 1px;
                        margin-bottom: 2px;
                    }
                    .thermal-location {
                        font-size: 12px;
                        letter-spacing: 0.5px;
                        margin-bottom: 2px;
                    }
                    .thermal-divider {
                        border-top: 1px dashed #000;
                        margin: 6px 0;
                    }
                    .thermal-info-row {
                        display: flex;
                        justify-content: space-between;
                        font-size: 11px;
                        line-height: 1.5;
                    }
                    .thermal-info-label {
                        width: 45%;
                        text-align: left;
                    }
                    .thermal-info-value {
                        width: 55%;
                        text-align: right;
                    }
                    .thermal-table-header {
                        display: grid;
                        grid-template-columns: 1fr 15% 25%;
                        font-size: 11px;
                        font-weight: bold;
                        margin-top: 8px;
                        margin-bottom: 4px;
                    }
                    .thermal-table-row {
                        display: grid;
                        grid-template-columns: 1fr 15% 25%;
                        font-size: 11px;
                        line-height: 1.6;
                    }
                    .thermal-item-name {
                        text-align: left;
                        word-wrap: break-word;
                    }
                    .thermal-qty {
                        text-align: center;
                    }
                    .thermal-price {
                        text-align: right;
                    }
                    .thermal-total-row {
                        display: flex;
                        justify-content: space-between;
                        font-size: 11px;
                        line-height: 1.8;
                    }
                    .thermal-total-label {
                        text-align: left;
                    }
                    .thermal-total-value {
                        text-align: right;
                        min-width: 80px;
                    }
                    .thermal-grand-total {
                        font-size: 14px !important;
                        font-weight: bold;
                        margin: 6px 0;
                        padding: 4px 0;
                    }
                    .thermal-footer {
                        text-align: center;
                        font-size: 11px;
                        margin-top: 8px;
                    }
                }
            `}</style>

            <div id="order-receipt-content" className="hidden print:block">
                <div className="thermal-header">
                    <div className="thermal-brand">INVEX FOOD</div>
                    <div className="thermal-branch">{branchInfo.name.toUpperCase()}</div>
                    <div className="thermal-location">{branchInfo.location}</div>
                </div>
                <div className="thermal-divider"></div>

                <div className="thermal-info-row">
                    <div className="thermal-info-label">DATE</div>
                    <div className="thermal-info-value">{date} {time}</div>
                </div>

                <div className="thermal-info-row">
                    <div className="thermal-info-label">ORDER TYPE</div>
                    <div className="thermal-info-value">{order.type?.toUpperCase()}</div>
                </div>

                {order.tableId && (
                    <div className="thermal-info-row">
                        <div className="thermal-info-label">TABLE NO</div>
                        <div className="thermal-info-value">{order.tableId}</div>
                    </div>
                )}

                <div className="thermal-info-row">
                    <div className="thermal-info-label">CUSTOMER</div>
                    <div className="thermal-info-value">{order.customerName || 'Walk-in'}</div>
                </div>

                {order.status && (
                    <div className="thermal-info-row">
                        <div className="thermal-info-label">STATUS</div>
                        <div className="thermal-info-value">{order.status.toUpperCase()}</div>
                    </div>
                )}

                <div className="thermal-divider"></div>

                <div className="thermal-info-row" style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>
                    <div className="thermal-info-label">Order Number</div>
                    <div className="thermal-info-value">{order.orderNumber}</div>
                </div>

                <div className="thermal-divider"></div>

                <div className="thermal-table-header">
                    <div className="thermal-item-name">Item</div>
                    <div className="thermal-qty">Qty</div>
                    <div className="thermal-price">Price</div>
                </div>

                {items.map((item: any, idx: number) => (
                    <div key={idx} className="thermal-table-row">
                        <div className="thermal-item-name">{item.name}</div>
                        <div className="thermal-qty">{item.quantity}</div>
                        <div className="thermal-price">PKR {(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                ))}

                <div className="thermal-divider"></div>

                <div className="thermal-total-row">
                    <div className="thermal-total-label">SUBTOTAL</div>
                    <div className="thermal-total-value">PKR {subTotal.toFixed(2)}</div>
                </div>

                <div className="thermal-total-row">
                    <div className="thermal-total-label">TAX</div>
                    <div className="thermal-total-value">PKR {(order.tax || 0).toFixed(2)}</div>
                </div>

                <div className="thermal-total-row">
                    <div className="thermal-total-label">DISCOUNT</div>
                    <div className="thermal-total-value">-PKR {(order.discount || 0).toFixed(2)}</div>
                </div>

                <div className="thermal-divider"></div>

                <div className="thermal-total-row thermal-grand-total">
                    <div className="thermal-total-label">AMOUNT DUE</div>
                    <div className="thermal-total-value">PKR {(order.grandTotal || 0).toFixed(2)}</div>
                </div>

                <div className="thermal-footer">
                    <div style={{ marginTop: '8px' }}>Payment Method: {paymentMethod}</div>
                    <div style={{ marginTop: '8px' }}>PH: {branchInfo.phone}</div>
                    <div style={{ marginTop: '8px', fontWeight: 'bold' }}>THANK YOU!</div>
                </div>
            </div>
        </>
    );
};
