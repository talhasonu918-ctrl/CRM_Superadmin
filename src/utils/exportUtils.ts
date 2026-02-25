import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Export data to PDF format
 * @param filename Name of the file (without .pdf)
 * @param headers Headers for the table (string[])
 * @param data Body data for the table (any[][])
 * @param title Title of the report (string)
 * @param fillColor Color for the header (string, e.g., '#10b981')
 */
export const exportToPDF = (
  filename: string,
  headers: string[],
  data: any[][],
  title?: string,
  fillColor?: string
) => {
  const doc = new jsPDF();

  // Helper to hex to RGB
  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [16, 185, 129]; // Default primary
  };

  const headerColor: [number, number, number] = fillColor ? hexToRgb(fillColor) : [16, 185, 129];
  
  if (title) {
    // Add Title
    doc.setFontSize(18);
    doc.text(title, 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    
    // Add Date
    const dateStr = `Generated on: ${new Date().toLocaleString()}`;
    doc.text(dateStr, 14, 30);
  } else {
    // Add Date if no title
    doc.setFontSize(11);
    doc.setTextColor(100);
    const dateStr = `Generated on: ${new Date().toLocaleString()}`;
    doc.text(dateStr, 14, 15);
  }
  
  // Add Table
  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 35,
    theme: 'grid',
    headStyles: { fillColor: headerColor }, 
    styles: { fontSize: 8 },
  });
  
  doc.save(`${filename}.pdf`);
};

/**
 * Export data to Excel format
 * @param filename Name of the file (without .xlsx)
 * @param headers Headers for the table (string[])
 * @param data Body data for the table (any[][])
 */
export const exportToExcel = (
  filename: string,
  headers: string[],
  data: any[][]
) => {
  const worksheetData = [headers, ...data];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
  
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
