import React from 'react';
import { Modal, Badge } from 'rizzui';
import { X, Clock, User, Phone, MapPin, Printer, CheckCircle, XCircle } from 'lucide-react';
import { Order } from '../types';

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    onPrint?: () => void;
    onMarkAsReady?: () => void;
    onCancelOrder?: () => void;
    isDarkMode?: boolean;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
    isOpen,
    onClose,
    order,
    onPrint,
    onMarkAsReady,
    onCancelOrder,
    isDarkMode = false,
}) => {
    if (!order) return null;

    const safeOrder = order as any;
    const items = safeOrder.items || [];
    const subTotal = safeOrder.subTotal || safeOrder.subtotal || 0;

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-success/10 text-success';
            case 'pending': return 'bg-warning/10 text-warning';
            case 'cancelled': return 'bg-error/10 text-error';
            case 'refunded': return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
            default: return 'bg-primary/10 text-primary';
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            overlayClassName="!z-[99999] !bg-black/50 !backdrop-blur-sm !fixed !inset-0 !flex !items-center !justify-center p-4 sm:p-0"
            containerClassName="!z-[100000] !relative !mx-auto !rounded-xl !max-h-[90vh] !max-w-[95vw] sm:!max-w-2xl w-full top-9  sm:top-7"
        >
            <div
                className={`rounded-xl overflow-hidden ${isDarkMode ? 'bg-[#1a1c20] text-gray-200' : 'bg-white'} w-full h-full shadow-2xl transition-all duration-200 flex flex-col`}
            >
                {/* Header */}
                <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-border flex items-center justify-between bg-background/50 flex-shrink-0">
                    <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                        <h3 className="text-base sm:text-lg font-bold text-textPrimary whitespace-nowrap">Order Details</h3>
                        <div className="h-4 w-px bg-border hidden sm:block flex-shrink-0" />
                        <span className="font-mono text-primary font-bold text-sm sm:text-base truncate">{order.orderNumber}</span>
                        <Badge
                            variant="flat"
                            className={`ml-1 sm:ml-2 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest flex-shrink-0 ${getStatusBadgeColor(order.status)}`}
                        >
                            {order.status}
                        </Badge>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-surface transition-colors text-textSecondary hover:text-textPrimary flex-shrink-0 ml-2">
                        <X size={18} className="sm:w-5 sm:h-5" />
                    </button>
                </div>

                <div className="px-4 py-4 sm:px-6 sm:py-6 overflow-y-auto custom-scrollbar flex-grow">
                    {/* Top Info Grid */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5 flex-shrink-0">
                                    <User size={16} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold text-textSecondary uppercase tracking-wider mb-0.5">Customer</p>
                                    <p className="font-semibold text-textPrimary text-sm sm:text-base truncate">{order.customerName || 'Walk-in Customer'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5 flex-shrink-0">
                                    <Clock size={16} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold text-textSecondary uppercase tracking-wider mb-0.5">Date & Time</p>
                                    <p className="font-semibold text-textPrimary text-sm sm:text-base truncate">{order.createdAt}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            {order.customerPhone && (
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-success/10 text-success mt-0.5 flex-shrink-0">
                                        <Phone size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-textSecondary uppercase tracking-wider mb-0.5">Contact</p>
                                        <p className="font-semibold text-textPrimary text-sm sm:text-base truncate">{order.customerPhone}</p>
                                    </div>
                                </div>
                            )}
                            {order.deliveryAddress && (
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 mt-0.5 flex-shrink-0">
                                        <MapPin size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-textSecondary uppercase tracking-wider mb-0.5">Address</p>
                                        <p className="font-semibold text-textPrimary text-sm truncate">{order.deliveryAddress}</p>
                                    </div>
                                </div>
                            )}
                            {order.tableId && (
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 mt-0.5 flex-shrink-0">
                                        <MapPin size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-textSecondary uppercase tracking-wider mb-0.5">Table</p>
                                        <p className="font-semibold text-textPrimary text-sm truncate">{order.tableId}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Items Table - Responsive Layout */}
                    <div className="border border-border rounded-xl overflow-hidden mb-6 sm:mb-8">
                        {/* Mobile View (Cards) */}
                        <div className="sm:hidden divide-y divide-border">
                            {items.map((item: any, idx: number) => {
                                const name = item.name || item.product?.name;
                                const quantity = item.quantity;
                                const price = item.price || item.product?.price || 0;
                                const dealItems = item.dealItems || item.product?.dealItems;

                                return (
                                    <div key={idx} className="p-3 bg-background/50">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="font-medium text-textPrimary text-sm">{name}</div>
                                            <div className="font-bold text-textPrimary text-sm">{(price * quantity).toFixed(2)}</div>
                                        </div>
                                        {dealItems && (
                                            <div className="text-[10px] text-textSecondary mb-2">
                                                {dealItems.join(', ')}
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center text-xs text-textSecondary">
                                            <div>{quantity} x {price.toFixed(2)}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Desktop View (Table) */}
                        <div className="hidden sm:block">
                            <div className="bg-surface px-4 py-3 border-b border-border grid grid-cols-12 gap-4 text-[10px] font-bold uppercase tracking-wider text-textSecondary">
                                <div className="col-span-6">Item</div>
                                <div className="col-span-2 text-center">Qty</div>
                                <div className="col-span-2 text-right">Price</div>
                                <div className="col-span-2 text-right">Total</div>
                            </div>
                            <div className="divide-y divide-border bg-background/50">
                                {items.map((item: any, idx: number) => {
                                    const name = item.name || item.product?.name;
                                    const quantity = item.quantity;
                                    const price = item.price || item.product?.price || 0;
                                    const dealItems = item.dealItems || item.product?.dealItems;

                                    return (
                                        <div key={idx} className="px-4 py-3 grid grid-cols-12 gap-4 text-sm items-center hover:bg-surface/50 transition-colors">
                                            <div className="col-span-6 font-medium text-textPrimary">
                                                {name}
                                                {dealItems && (
                                                    <div className="text-[10px] text-textSecondary mt-1 ">
                                                        {dealItems.join(', ')}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-span-2 text-center text-textSecondary">{quantity}</div>
                                            <div className="col-span-2 text-right text-textSecondary">{price.toFixed(2)}</div>
                                            <div className="col-span-2 text-right font-bold text-textPrimary">{(price * quantity).toFixed(2)}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="flex justify-end">
                        <div className="w-full sm:max-w-xs space-y-2 sm:space-y-3 bg-surface/30 p-4 rounded-xl">
                            <div className="flex justify-between text-xs sm:text-sm text-textSecondary">
                                <span>Subtotal</span>
                                <span>PKR {subTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs sm:text-sm text-textSecondary">
                                <span>Tax</span>
                                <span>PKR {order.tax?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="flex justify-between text-xs sm:text-sm text-textSecondary">
                                <span>Discount</span>
                                <span>-PKR {order.discount?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="border-t border-border pt-2 sm:pt-3 flex justify-between items-center text-base sm:text-lg font-bold text-textPrimary">
                                <span>Total Amount</span>
                                <span>PKR {order.grandTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-4 py-3 sm:px-6 sm:py-4 bg-surface border-t border-border flex flex-col sm:flex-row justify-end gap-3 flex-shrink-0">
                    <button
                        onClick={onPrint}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-surface border border-border hover:bg-background transition-colors text-textPrimary font-medium text-sm"
                    >
                        <Printer size={16} />
                        Print Receipt
                    </button>

                    {order.status !== 'cancelled' && (
                        <button
                            onClick={onCancelOrder}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-error/10 text-error hover:bg-error/20 transition-colors font-medium text-sm"
                        >
                            <XCircle size={16} />
                            Cancel Order
                        </button>
                    )}

                    {order.status === 'pending' && (
                        <button
                            onClick={onMarkAsReady}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-medium text-sm shadow-lg shadow-primary/20"
                        >
                            <CheckCircle size={16} />
                            Mark as Completed
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
};
