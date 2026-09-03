import React, { useState, useEffect } from 'react';
import { Plus, CreditCard, DollarSign, CheckCircle2, AlertCircle, FileText, Download, ShieldCheck } from 'lucide-react';
import { feeService, studentService } from '../services/api';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Modal } from '../components/common/Modal';
import { Table } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { formatCurrency } from '../utils/formatters';
import { ROLES } from '../utils/constants';

export const FeesPage = () => {
  const { activeRole } = useAuth();
  const { addToast } = useToast();
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  const [invoiceFormData, setInvoiceFormData] = useState({
    studentId: '',
    feeType: 'Tuition Fee - Term 1',
    amount: 1250,
    dueDate: '2025-09-30',
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fData, sData] = await Promise.all([feeService.getAll(), studentService.getAll()]);
      setFees(fData);
      setStudents(sData);
      if (sData.length) setInvoiceFormData((prev) => ({ ...prev, studentId: sData[0].id }));
    } catch (err) {
      addToast('Failed to load fee records', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      const student = students.find((s) => s.id === invoiceFormData.studentId);
      await feeService.create({
        ...invoiceFormData,
        invoiceNo: `INV-2025-${Math.floor(100 + Math.random() * 900)}`,
        studentName: student?.name || 'Student',
        rollNo: student?.rollNo || 'STU-100',
        class: student?.class || 'Grade 10',
        status: 'Unpaid',
      });
      addToast('Fee invoice generated', 'success');
      setIsInvoiceModalOpen(false);
      loadData();
    } catch (err) {
      addToast('Failed to create invoice', 'error');
    }
  };

  const handleProcessPayment = async () => {
    setIsProcessingPay(true);
    try {
      await feeService.update(selectedInvoice.id, {
        status: 'Paid',
        paidDate: new Date().toISOString().split('T')[0],
        paymentMethod,
      });
      addToast(`Payment of ${formatCurrency(selectedInvoice.amount)} successful!`, 'success');
      setIsProcessingPay(false);
      setIsPaymentModalOpen(false);
      loadData();
    } catch (err) {
      addToast('Payment failed', 'error');
      setIsProcessingPay(false);
    }
  };

  const columns = [
    { header: 'Invoice #', key: 'invoiceNo', render: (row) => <strong className="font-bold text-brand-600 dark:text-brand-400">{row.invoiceNo}</strong> },
    { header: 'Student', key: 'studentName', render: (row) => <div><p className="font-bold text-slate-900 dark:text-slate-100">{row.studentName}</p><span className="text-[10px] text-slate-400">{row.rollNo} • {row.class}</span></div> },
    { header: 'Fee Category', key: 'feeType' },
    { header: 'Amount', key: 'amount', render: (row) => <span className="font-extrabold text-slate-900 dark:text-slate-100">{formatCurrency(row.amount)}</span> },
    { header: 'Due Date', key: 'dueDate' },
    {
      header: 'Status',
      key: 'status',
      render: (row) => (
        <Badge variant={row.status === 'Paid' ? 'success' : row.status === 'Overdue' ? 'danger' : 'warning'}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Action',
      key: 'action',
      render: (row) => (
        row.status !== 'Paid' ? (
          <Button size="sm" variant="primary" icon={CreditCard} onClick={() => { setSelectedInvoice(row); setIsPaymentModalOpen(true); }}>
            Pay Now
          </Button>
        ) : (
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Receipt Paid</span>
        )
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Fees & Payments</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage tuition invoices, payment gateways, receipts, and outstanding dues</p>
        </div>
        {activeRole === ROLES.ADMIN && (
          <Button icon={Plus} onClick={() => setIsInvoiceModalOpen(true)}>
            Create Fee Invoice
          </Button>
        )}
      </div>

      <Table columns={columns} data={fees} isLoading={isLoading} />

      {/* Invoice Generator Modal */}
      <Modal isOpen={isInvoiceModalOpen} onClose={() => setIsInvoiceModalOpen(false)} title="Generate Fee Invoice">
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <Select label="Student" options={students.map((s) => ({ value: s.id, label: `${s.name} (${s.rollNo})` }))} value={invoiceFormData.studentId} onChange={(e) => setInvoiceFormData({ ...invoiceFormData, studentId: e.target.value })} />
          <Select label="Fee Type" options={['Tuition Fee - Term 1', 'Laboratory & Tech Fee', 'Annual Sports Fee', 'Transport Fee']} value={invoiceFormData.feeType} onChange={(e) => setInvoiceFormData({ ...invoiceFormData, feeType: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Amount ($)" type="number" required value={invoiceFormData.amount} onChange={(e) => setInvoiceFormData({ ...invoiceFormData, amount: parseFloat(e.target.value) || 0 })} />
            <Input label="Due Date" type="date" required value={invoiceFormData.dueDate} onChange={(e) => setInvoiceFormData({ ...invoiceFormData, dueDate: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setIsInvoiceModalOpen(false)}>Cancel</Button>
            <Button type="submit">Issue Invoice</Button>
          </div>
        </form>
      </Modal>

      {/* Payment Gateway Modal */}
      {selectedInvoice && (
        <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title="Secure Online Payment Checkout">
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 text-center">
              <span className="text-xs font-semibold text-slate-500">Total Amount Due</span>
              <h2 className="text-3xl font-black text-brand-600 dark:text-brand-400 mt-1">{formatCurrency(selectedInvoice.amount)}</h2>
              <p className="text-xs text-slate-500 mt-1">{selectedInvoice.feeType} • {selectedInvoice.invoiceNo}</p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Select Payment Option</label>
              <div className="grid grid-cols-3 gap-3">
                {['Credit Card', 'Bank Transfer', 'PayPal'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`p-3 rounded-xl text-xs font-bold border text-center transition-all ${paymentMethod === method ? 'border-brand-600 bg-brand-50 text-brand-600 dark:bg-brand-950/60' : 'border-slate-200 dark:border-slate-700'}`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="secondary" onClick={() => setIsPaymentModalOpen(false)}>Cancel</Button>
              <Button variant="success" isLoading={isProcessingPay} onClick={handleProcessPayment}>
                Pay {formatCurrency(selectedInvoice.amount)} Now
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
