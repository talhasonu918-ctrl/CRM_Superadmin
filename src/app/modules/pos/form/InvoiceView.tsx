import React, { useState, useEffect } from 'react';
import { Printer, Send, ArrowLeft, Download } from 'lucide-react';
import { CartItem } from '../types';
import { useBranding } from '../../../../contexts/BrandingContext';

interface InvoiceViewProps {
    type: 'KOT' | 'KDS';
    cart: CartItem[];
    orderType: 'DineIn' | 'TakeAway' | 'Delivery';
    selectedTable?: { label: string } | null;
    selectedWaiter?: { label: string; sublabel?: string } | null;
    selectedRider?: { label: string; sublabel?: string } | null;
    selectedCustomer?: { label: string; sublabel?: string } | null;
    totals: {
        subtotal: number;
        tax: number;
        serviceCharge: number;
        discount: number;
        total: number;
    };
    orderNumber: string;
    onBack: () => void;
    onSendToKitchen: () => void;
    isDarkMode?: boolean;
}

const branches = [
    { id: 1, name: 'Main Branch', location: 'M.A Jinnah road Okara', phone: '+92 300 1234567' },
    { id: 2, name: 'Lahore Branch', location: 'Gulberg town Lahore', phone: '+92 321 7654321' },
    { id: 3, name: 'Multan Brnach', location: 'Kot Town Multan', phone: '+92 333 9876543' },
    { id: 4, name: 'Islamabad Branch', location: 'Sector 3 ISlamabad', phone: '+92 345 5432109' },
];

export const InvoiceView: React.FC<InvoiceViewProps> = ({
    type,
    cart,
    orderType,
    selectedTable,
    selectedWaiter,
    selectedRider,
    selectedCustomer,
    totals,
    orderNumber,
    onBack,
    onSendToKitchen,
    isDarkMode = false,
}) => {
    const { config } = useBranding();
    const [branchInfo, setBranchInfo] = useState({ name: 'Main Branch', phone: '+92 300 1234567' });

    useEffect(() => {
        const savedBranch = localStorage.getItem('activeBranch') || 'Main Branch';
        const foundBranch = branches.find(b => b.name === savedBranch);
        if (foundBranch) {
            setBranchInfo({ name: foundBranch.name, phone: foundBranch.phone });
        }
    }, []);

    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <style>{`
                @media print {
                    @page {
                        size: 80mm auto;
                        margin: 0;
                    }
                    body, html {
                        margin: 0;
                        padding: 0;
                    }
                    * {
                        color: #000 !important;
                        background: #fff !important;
                        font-family: 'Courier New', Courier, monospace !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    #invoice-content {
                        width: 80mm !important;
                        max-width: 80mm !important;
                        margin: 0 auto !important;
                        padding: 4mm !important;
                        box-shadow: none !important;
                        border: none !important;
                    }
                    .thermal-header {
                        text-align: center;
                        margin-bottom: 8px;
                    }
                    .thermal-branch {
                        font-size: 16px;
                        font-weight: bold;
                        letter-spacing: 1px;
                        margin-bottom: 2px;
                    }
                    .thermal-location {
                        font-size: 10px;
                        margin-bottom: 8px;
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
                    .print-only {
                        display: block !important;
                    }
                    .screen-only {
                        display: none !important;
                    }
                }
                .print-only {
                    display: none;
                }
            `}</style>

            <div className="flex flex-col h-full bg-surface">
                <div className="p-4 border-b border-border flex items-center justify-between bg-background/50 no-print">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-textSecondary hover:text-primary transition-colors text-sm font-medium"
                    >
                        <ArrowLeft size={18} />
                        Back to Cart
                    </button>
                    <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                        {type} Mode
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-hidden">
                    {/* Invoice Container */}
                    <div id="invoice-content" className={`max-w-[380px] mx-auto p-8 relative transition-all duration-300 ${isDarkMode ? 'bg-[#1a1c20]' : 'bg-[#fffefc]'} shadow-2xl border border-border/30`}>

                        {/* Jagged Top Edge (Visual) */}
                        <div className="absolute top-0 left-0 w-full h-2 flex no-print overflow-hidden">
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className="w-5 h-5 bg-background rotate-45 -mt-3 shrink-0"
                                    style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', borderRight: '1px solid rgba(0,0,0,0.05)' }}
                                />
                            ))}
                        </div>

                        {/* Red Pin Dot */}
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full shadow-md z-10 no-print" />

                        {/* SCREEN VERSION - Modern UI */}
                        <div className="screen-only">
                            {/* Company Info */}
                            <div className="text-center mb-4">
                                <h1 className="text-4xl font-black text-primary tracking-tighter mb-1">{config.name || 'Invex Food'}</h1>
                                <p className="text-xl font-bold text-textPrimary tracking-tight">{branchInfo.name}</p>
                                <p className="text-[11px] text-textSecondary font-bold tracking-widest">{branches.find(b => b.name === branchInfo.name)?.location}</p>
                                <p className="text-[11px] font-bold text-textPrimary mt-1">PH : {branchInfo.phone}</p>
                                <div className="w-full border-t border-dotted border-border my-2" />
                                <p className="text-[11px] font-bold text-textPrimary">{date} {time}</p>
                            </div>

                            {/* Order Details Simplified */}
                            <div className="space-y-1 mb-6 text-[11px] text-textPrimary font-bold">
                                <div className="flex justify-between">
                                    <span className="opacity-60">ORDER TYPE</span>
                                    <span className="text-primary">{orderType.replace(/([A-Z])/g, ' $1').trim()}</span>
                                </div>
                                {orderType === 'DineIn' && (
                                    <div className="flex justify-between">
                                        <span className="opacity-60">TABLE NO</span>
                                        <span>{selectedTable?.label || 'N/A'}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="opacity-60">CUSTOMER</span>
                                    <div className="text-right">
                                        <div className="truncate max-w-[120px]">{selectedCustomer?.label || 'Walk-in'}</div>
                                        {selectedCustomer?.sublabel && (
                                            <div className="text-[10px] opacity-70">{selectedCustomer.sublabel}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="opacity-60">{orderType === 'Delivery' ? 'RIDER' : 'WAITER'}</span>
                                    <div className="text-right">
                                        <div>{orderType === 'Delivery' ? selectedRider?.label : selectedWaiter?.label || 'Counter'}</div>
                                        {((orderType === 'Delivery' && selectedRider?.sublabel) || (orderType !== 'Delivery' && selectedWaiter?.sublabel)) && (
                                            <div className="text-[10px] opacity-70">{orderType === 'Delivery' ? selectedRider?.sublabel : selectedWaiter?.sublabel}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-between pt-1 border-t border-dotted border-border/30">
                                    <span className="opacity-60">CASHIER</span>
                                    <span>{['Kalen H', 'Ali Ahmed', 'Asif Ali'][Math.floor(Math.random() * 3)]}</span>
                                </div>
                            </div>

                            <div className="w-full border-t border-dotted border-border mb-6" />

                            <div className="mb-4">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] text-textSecondary uppercase font-black">Order Number</p>
                                        <p className="text-xl font-black text-textPrimary leading-none">{orderNumber}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[11px] font-black text-textPrimary">{time}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Items Table - Simplified */}
                            <div className="mb-6">
                                <div className="w-full border-t border-dotted border-border mb-3" />
                                <div className="space-y-3">
                                    {cart.map((item, idx) => (
                                        <div key={idx} className="flex flex-col group">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1 pr-4">
                                                    <p className="text-sm font-black text-textPrimary leading-tight group-hover:text-primary transition-colors uppercase tracking-tight">
                                                        {item.product.name}
                                                    </p>
                                                </div>
                                                <div className="flex gap-8 font-bold text-[11px]">
                                                    <span className="text-textSecondary">x{item.quantity}</span>
                                                    <span className="text-textPrimary tracking-tight">
                                                        PKR {(item.product.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                            {item.product.dealItems && item.product.dealItems.length > 0 && (
                                                <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
                                                    {item.product.dealItems.map((detail, dIdx) => (
                                                        <span key={dIdx} className="text-[10px] text-textSecondary font-semibold italic flex items-center gap-1">
                                                            • {detail}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Calculations */}
                            <div className="border-y border-dotted border-border py-4 space-y-2 mb-6 font-bold text-xs text-textPrimary">
                                <div className="flex justify-between">
                                    <span className="opacity-60">SUBTOTAL</span>
                                    <span>PKR {totals.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="opacity-60">TAX (16%)</span>
                                    <span>PKR {totals.tax.toFixed(2)}</span>
                                </div>
                                {totals.serviceCharge > 0 && (
                                    <div className="flex justify-between">
                                        <span className="opacity-60">SERVICE CHARGE</span>
                                        <span>PKR {totals.serviceCharge.toFixed(2)}</span>
                                    </div>
                                )}
                                {totals.discount > 0 && (
                                    <div className="flex justify-between text-error">
                                        <span className="opacity-60">DISCOUNT</span>
                                        <span>-PKR {totals.discount.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Grand Total */}
                            <div className="flex justify-between items-center mb-8 px-2">
                                <span className="text-base font-black tracking-tighter text-textPrimary uppercase">Amount Due :</span>
                                <span className="text-lg font-black text-textPrimary">PKR {totals.total.toFixed(2)}</span>
                            </div>

                            <div className="text-center">
                                <p className="text-sm font-black text-textPrimary tracking-widest uppercase mt-2">Thank You !</p>
                                <div className="w-16 h-0.5 bg-primary/20 mx-auto mt-2" />
                            </div>
                        </div>

                        {/* PRINT VERSION - Thermal Receipt */}
                        <div className="print-only">
                            {/* Header */}
                            {/* <div className="thermal-header">
                              <div className="thermal-branch">{config.name || 'Invex Food'}</div>
                            <div className="thermal-branch">{branchInfo.name.toUpperCase()}</div>
                            <div className="thermal-location">{branches.find(b => b.name === branchInfo.name)?.location}</div>
                        </div> */}


                            <div className="thermal-header">
                                <div className="thermal-brand">{config.name || 'Invex Food'}</div>

                                <div className="thermal-branch">
                                    {branchInfo.name.toUpperCase()}
                                </div>
                                <div className="thermal-location">
                                    {branches.find(b => b.name === branchInfo.name)?.location}
                                </div>
                            </div>


                            <div className="thermal-divider"></div>

                            {/* Date & Time */}
                            <div className="thermal-info-row">
                                <div className="thermal-info-label"></div>
                                <div className="thermal-info-value">{date} {time}</div>
                            </div>

                            {/* Order Info */}
                            <div className="thermal-info-row">
                                <div className="thermal-info-label">ORDER TYPE</div>
                                <div className="thermal-info-value">{orderType.replace(/([A-Z])/g, ' $1').trim()}</div>
                            </div>

                            {orderType === 'DineIn' && (
                                <div className="thermal-info-row">
                                    <div className="thermal-info-label">TABLE NO</div>
                                    <div className="thermal-info-value">{selectedTable?.label || 'N/A'}</div>
                                </div>
                            )}

                            <div className="thermal-info-row">
                                <div className="thermal-info-label">CUSTOMER</div>
                                <div className="thermal-info-value">{selectedCustomer?.label || 'Walk-in'}</div>
                            </div>
                            {selectedCustomer?.sublabel && (
                                <div className="thermal-info-row">
                                    <div className="thermal-info-label"></div>
                                    <div className="thermal-info-value" style={{ fontSize: '10px' }}>{selectedCustomer.sublabel}</div>
                                </div>
                            )}

                            <div className="thermal-info-row">
                                <div className="thermal-info-label">{orderType === 'Delivery' ? 'RIDER' : 'WAITER'}</div>
                                <div className="thermal-info-value">{orderType === 'Delivery' ? selectedRider?.label : selectedWaiter?.label || 'Counter'}</div>
                            </div>
                            {((orderType === 'Delivery' && selectedRider?.sublabel) || (orderType !== 'Delivery' && selectedWaiter?.sublabel)) && (
                                <div className="thermal-info-row">
                                    <div className="thermal-info-label"></div>
                                    <div className="thermal-info-value" style={{ fontSize: '10px' }}>{orderType === 'Delivery' ? selectedRider?.sublabel : selectedWaiter?.sublabel}</div>
                                </div>
                            )}

                            <div className="thermal-info-row" style={{ marginTop: '2px', paddingTop: '2px', borderTop: '0.5px dotted #ccc' }}>
                                <div className="thermal-info-label">CASHIER</div>
                                <div className="thermal-info-value">{['KALEN H', 'ALI AHMED', 'ASIF ALI'][Math.floor(Math.random() * 3)]}</div>
                            </div>

                            <div className="thermal-divider"></div>

                            {/* Order Number */}
                            <div className="thermal-info-row" style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>
                                <div className="thermal-info-label">Order Number</div>
                                <div className="thermal-info-value">{orderNumber}</div>
                            </div>

                            {/* <div className="thermal-info-row" style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '6px' }}>
                            <div className="thermal-info-label">MALAI BOTI</div>
                            <div className="thermal-info-value">{time}</div>
                        </div> */}

                            <div className="thermal-divider"></div>

                            {/* Table Headers */}
                            <div className="thermal-table-header">
                                <div className="thermal-item-name">Item</div>
                                <div className="thermal-qty">Qty</div>
                                <div className="thermal-price">Price</div>
                            </div>

                            {/* Items */}
                            {cart.map((item, idx) => (
                                <div key={idx} className="thermal-table-row">
                                    <div className="thermal-item-name">{item.product.name}</div>
                                    <div className="thermal-qty">{item.quantity}</div>
                                    <div className="thermal-price">{(item.product.price * item.quantity).toFixed(2)}</div>
                                </div>
                            ))}

                            <div className="thermal-divider"></div>

                            {/* Totals */}
                            <div className="thermal-total-row">
                                <div className="thermal-total-label">SUBTOTAL</div>
                                <div className="thermal-total-value">PKR {totals.subtotal.toFixed(2)}</div>
                            </div>

                            <div className="thermal-total-row">
                                <div className="thermal-total-label">TAX (16%)</div>
                                <div className="thermal-total-value">PKR {totals.tax.toFixed(2)}</div>
                            </div>

                            {totals.serviceCharge > 0 && (
                                <div className="thermal-total-row">
                                    <div className="thermal-total-label">SERVICE CHARGE</div>
                                    <div className="thermal-total-value">PKR {totals.serviceCharge.toFixed(2)}</div>
                                </div>
                            )}

                            {totals.discount > 0 && (
                                <div className="thermal-total-row">
                                    <div className="thermal-total-label">DISCOUNT</div>
                                    <div className="thermal-total-value">-PKR {totals.discount.toFixed(2)}</div>
                                </div>
                            )}

                            <div className="thermal-divider"></div>

                            {/* Grand Total */}
                            <div className="thermal-total-row thermal-grand-total">
                                <div className="thermal-total-label">AMOUNT DUE</div>
                                <div className="thermal-total-value">PKR {totals.total.toFixed(2)}</div>
                            </div>

                            {/* Footer */}
                            <div className="thermal-footer">
                                <div style={{ marginTop: '8px' }}>Payment Method</div>
                                <div style={{ marginTop: '4px' }}>Bill# {orderNumber}</div>
                                <div style={{ marginTop: '8px' }}>PH: {branchInfo.phone}</div>
                                <div style={{ marginTop: '8px', fontWeight: 'bold' }}>THANK YOU !</div>
                            </div>

                            <div className="thermal-divider" style={{ marginTop: '8px' }}></div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-background/80 border-t border-border mt-auto grid grid-cols-2 gap-4 no-print">
                    <button
                        onClick={onSendToKitchen}
                        className="flex items-center justify-center gap-2 py-2 bg-secondary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-secondary/90 transition-all shadow-lg active:scale-95"
                    >
                        <Send size={20} />
                        Send Kitchen
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center justify-center gap-2 py-2 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg active:scale-95"
                    >
                        <Download size={20} />
                        Print
                    </button>
                </div>
            </div>
        </>
    );
};
