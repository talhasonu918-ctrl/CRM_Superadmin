import React from 'react';
import { useBranding } from '../../../../../contexts/BrandingContext';
import { StockTransferEntry } from '../table/stocktransfer.Table';

interface StockTransferReceiptProps {
    transfer: StockTransferEntry | null;
    branchInfo?: { name: string; phone: string; location: string };
}

const defaultBranch = {
    name: 'Main Branch',
    location: 'M.A Jinnah road Okara',
    phone: '+92 300 1234567'
};

export const StockTransferReceipt: React.FC<StockTransferReceiptProps> = ({
    transfer,
    branchInfo = defaultBranch
}) => {
    const branding = useBranding();
    const config = branding?.config;

    if (!transfer) return null;

    const brandName = config?.name || 'Invex Food';

    const date = transfer.date;
    const time = new Date().toTimeString().slice(0, 5);

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
                    #stock-transfer-receipt, #stock-transfer-receipt * {
                        visibility: visible;
                    }
                    #stock-transfer-receipt {
                        position: absolute;
                        left: 50%;
                        top: 0;
                        transform: translateX(-50%);
                        display: block !important;
                        width: 80mm !important;
                        max-width: 80mm !important;
                        padding: 6mm !important;
                        color: #000 !important;
                        background: #fff !important;
                        font-family: 'Courier New', Courier, monospace !important;
                    }
                    .thermal-header {
                        text-align: center;
                        margin-bottom: 12px;
                    }
                    .thermal-brand {
                        font-size: 20px;
                        font-weight: 900;
                        letter-spacing: 2px;
                        margin-bottom: 4px;
                    }
                    .thermal-title {
                        font-size: 14px;
                        font-weight: bold;
                        border: 1px solid #000;
                        padding: 2px 8px;
                        display: inline-block;
                        margin: 8px 0;
                    }
                    .thermal-branch {
                        font-size: 12px;
                        font-weight: bold;
                        margin-bottom: 2px;
                    }
                    .thermal-divider {
                        border-top: 1px dashed #000;
                        margin: 8px 0;
                    }
                    .thermal-info-row {
                        display: flex;
                        justify-content: space-between;
                        font-size: 11px;
                        line-height: 1.6;
                    }
                    .thermal-info-label {
                        width: 40%;
                        text-align: left;
                        font-weight: bold;
                    }
                    .thermal-info-value {
                        width: 60%;
                        text-align: right;
                    }
                    .thermal-section-title {
                        font-size: 12px;
                        font-weight: bold;
                        text-align: center;
                        margin: 10px 0 5px 0;
                        text-decoration: underline;
                    }
                    .thermal-product-list {
                        font-size: 11px;
                        line-height: 1.4;
                        margin: 8px 0;
                        text-align: left;
                        padding: 4px;
                        border: 0.5px dotted #000;
                    }
                    .thermal-total-row {
                        display: flex;
                        justify-content: space-between;
                        font-size: 13px;
                        font-weight: bold;
                        margin-top: 8px;
                        padding-top: 4px;
                        border-top: 1px solid #000;
                    }
                    .thermal-footer {
                        text-align: center;
                        font-size: 10px;
                        margin-top: 20px;
                        font-style: poppins, sans-serif;
                    }
                }
            `}</style>
            <div id="stock-transfer-receipt" className="hidden print:block">
                <div className="thermal-header">
                    <div className="thermal-brand">{brandName.toUpperCase()}</div>
                    <div className="thermal-branch">{branchInfo.name.toUpperCase()}</div>
                    <div className="thermal-title">STOCK TRANSFER RECEIPT</div>
                </div>

                <div className="thermal-divider"></div>

                <div className="thermal-info-row">
                    <div className="thermal-info-label">DATE:</div>
                    <div className="thermal-info-value">{date} {time}</div>
                </div>
                <div className="thermal-info-row">
                    <div className="thermal-info-label">DOC NO:</div>
                    <div className="thermal-info-value" style={{ fontWeight: 'bold' }}>{transfer.documentNo}</div>
                </div>

                <div className="thermal-divider"></div>

                <div className="thermal-section-title">TRANSFER PATH</div>
                <div className="thermal-info-row" style={{ marginTop: '4px' }}>
                    <div className="thermal-info-label">FROM:</div>
                    <div className="thermal-info-value">{transfer.locationFrom}</div>
                </div>
                <div className="thermal-info-row">
                    <div className="thermal-info-label">TO:</div>
                    <div className="thermal-info-value">{transfer.locationTo}</div>
                </div>

                <div className="thermal-divider"></div>

                <div className="thermal-section-title">PRODUCTS SUMMARY</div>
                <div className="thermal-product-list">
                    {transfer.productNames}
                </div>

                <div className="thermal-divider"></div>

                <div className="thermal-info-row">
                    <div className="thermal-info-label">ITEMS:</div>
                    <div className="thermal-info-value">{transfer.totalProducts}</div>
                </div>
                <div className="thermal-info-row">
                    <div className="thermal-info-label">TOTAL QTY:</div>
                    <div className="thermal-info-value">{transfer.totalQuantity}</div>
                </div>

                <div className="thermal-total-row">
                    <div>TOTAL VALUE:</div>
                    <div>PKR {transfer.totalValue.toLocaleString()}</div>
                </div>

                <div className="thermal-divider" style={{ borderTopStyle: 'solid', marginTop: '15px' }}></div>

                {/* <div className="thermal-info-row" style={{ marginTop: '10px' }}>
                    <div style={{ width: '50%', borderTop: '1px solid #000', textAlign: 'center', paddingTop: '4px' }}>
                        ISSUED BY
                    </div>
                    <div style={{ width: '50%', borderTop: '1px solid #000', textAlign: 'center', paddingTop: '4px' }}>
                        RECEIVED BY
                    </div>
                </div> */}

                <div className="thermal-footer">
                    * This is a computer generated document *
                </div>
            </div>
        </>
    );
};
