import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Transaction, TransactionType } from '../types';
import { User } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface ExportPDFParams {
  transactions: Transaction[];
  startDate: string;
  endDate: string;
  title: string;
  user: User | null;
}

export const generateTransactionPDF = ({ 
  transactions, 
  startDate, 
  endDate, 
  title, 
  user 
}: ExportPDFParams) => {
  const doc = new jsPDF();
  
  // Sort transactions
  const sorted = [...transactions].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA === dateB) return a.createdAt - b.createdAt;
      return dateA - dateB;
  });

  // Calculate balances and filter
  let balance = 0;
  const dataToExport = sorted.map(t => {
    if (t.type === TransactionType.INCOME) {
      balance += t.amount;
    } else {
      balance -= t.amount;
    }
    return { ...t, runningBalance: balance };
  }).filter(t => {
    if (startDate && t.date < startDate) return false;
    if (endDate && t.date > endDate) return false;
    return true;
  });

  // --- Header ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("PT. REDONE BERKAH MANDIRI UTAMA", 105, 20, { align: "center" });
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Exlusif Bag Solution", 105, 27, { align: "center" });
  
  doc.setLineWidth(0.5);
  doc.line(14, 32, 196, 32);

  // --- Meta Data ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(title.toUpperCase(), 105, 45, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const periodText = startDate && endDate 
      ? `Periode: ${formatDate(startDate)} s/d ${formatDate(endDate)}`
      : "Periode: Semua Data";
  doc.text(periodText, 14, 55);

  // --- Table ---
  const tableBody = dataToExport.map((t, index) => [
    index + 1,
    formatDate(t.date),
    t.description,
    t.type === TransactionType.INCOME ? formatCurrency(t.amount) : '-',
    t.type === TransactionType.EXPENSE ? formatCurrency(t.amount) : '-',
    formatCurrency(t.runningBalance)
  ]);

  autoTable(doc, {
    startY: 60,
    head: [['No', 'Tanggal', 'Keterangan', 'Masuk', 'Keluar', 'Saldo']],
    body: tableBody,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246], textColor: 255 }, // Brand blue
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'center', cellWidth: 25 },
      2: { cellWidth: 'auto' },
      3: { halign: 'right', cellWidth: 30, textColor: [5, 150, 105] }, // Green
      4: { halign: 'right', cellWidth: 30, textColor: [225, 29, 72] }, // Red
      5: { halign: 'right', cellWidth: 35, fontStyle: 'bold' }
    }
  });

  // --- Footer ---
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  
  // Check if page break is needed for footer
  if (finalY > 240) {
    doc.addPage();
  }

  const footerY = finalY > 240 ? 40 : finalY + 20;

  const dateNow = new Date().toLocaleDateString('id-ID', { 
      day: 'numeric', month: 'long', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
  });

  doc.setFontSize(10);
  doc.text(`Dicetak pada: ${dateNow}`, 14, footerY - 10);
  doc.text(`Oleh: ${user?.name || 'Sistem'}`, 14, footerY - 5);

  doc.text("Mengetahui,", 150, footerY);
  doc.text("( Admin Produksi )", 150, footerY + 25);

  doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
};