import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { api } from '../../services/api';
import { 
  CalendarCheck, Clock, CheckCircle2, XCircle, Search, 
  Filter, Eye, FileText, User, Mail, Phone, DollarSign, Download, RefreshCw
} from 'lucide-react';
import { Booking } from '../../types';
import { BookingVoucherModal } from '../BookingVoucherModal';

export const BookingManager: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Pending' | 'Verified' | 'Rejected'>('ALL');
  const [selectedVoucher, setSelectedVoucher] = useState<Booking | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await dataService.getBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (bookingId: string, newPaymentStatus: 'Pending' | 'Verified' | 'Rejected', newBookingStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED') => {
    setActionLoading(bookingId);
    try {
      await api.bookings.updateStatus(bookingId, newBookingStatus, newPaymentStatus);
      
      // Also update local storage if fallback
      const saved = localStorage.getItem('premier_bookings_store_v2');
      if (saved) {
        const all: Booking[] = JSON.parse(saved);
        const updated = all.map(b => b.id === bookingId ? { ...b, payment_status: newPaymentStatus, status: newBookingStatus } : b);
        localStorage.setItem('premier_bookings_store_v2', JSON.stringify(updated));
      }

      window.dispatchEvent(new Event('bookings-updated'));
      await fetchBookings();
    } catch (err) {
      console.error('Failed to update booking status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      (booking.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (booking.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (booking.id?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (booking.service_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    const matchesStatus = statusFilter === 'ALL' || booking.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    if (filteredBookings.length === 0) {
      alert('No reservations in the current view to export.');
      return;
    }

    const headers = [
      'Booking Reference',
      'Booking Date',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Service / Tour Name',
      'Service Category',
      'Start Date',
      'End Date',
      'Guests',
      'Total Amount (USD)',
      'Payment Status',
      'Reservation Status',
      'Payment Method',
      'Receipt Slip URL',
      'Special Requests'
    ];

    const escapeCSV = (value: any) => {
      if (value === null || value === undefined) return '""';
      const str = String(value).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = filteredBookings.map(b => [
      escapeCSV(b.id),
      escapeCSV(new Date(b.created_at).toLocaleString()),
      escapeCSV(b.customer_name || 'Valued Guest'),
      escapeCSV(b.customer_email || 'N/A'),
      escapeCSV(b.customer_phone || 'N/A'),
      escapeCSV(b.service_name || 'Expedition Package'),
      escapeCSV(b.service_type || 'Tour'),
      escapeCSV(b.start_date || 'N/A'),
      escapeCSV(b.end_date || 'N/A'),
      escapeCSV(b.guests || 1),
      escapeCSV(Number(b.total_amount || b.total_price || 0).toFixed(2)),
      escapeCSV(b.payment_status || 'Pending'),
      escapeCSV(b.status || 'PENDING'),
      escapeCSV(b.payment_method || 'Bank Wire'),
      escapeCSV(b.receipt_url || b.payment_receipt_url || 'None'),
      escapeCSV(b.special_requests || '')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    const filterTag = statusFilter !== 'ALL' ? `_${statusFilter.toLowerCase()}` : '';
    link.setAttribute('href', url);
    link.setAttribute('download', `ceylon_premier_bookings${filterTag}_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const pendingCount = bookings.filter(b => b.payment_status === 'Pending').length;
  const verifiedCount = bookings.filter(b => b.payment_status === 'Verified').length;
  const totalRevenue = bookings
    .filter(b => b.payment_status === 'Verified')
    .reduce((sum, b) => sum + (Number(b.total_amount || b.total_price) || 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1814] dark:text-white">
            Reservations & Bookings
          </h1>
          <p className="text-sm text-[#857D70] dark:text-[#A39A8B]">
            Review bookings, verify bank payment slips, export financial audit data, and issue official e-vouchers.
          </p>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            disabled={filteredBookings.length === 0}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#A97F3E] hover:bg-[#8A6530] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95"
            title="Download CSV report of current view"
          >
            <Download className="w-4 h-4" />
            Export CSV ({filteredBookings.length})
          </button>
          <button
            onClick={fetchBookings}
            className="px-3 py-2.5 border border-[#E8E0D2] dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--surface)] text-[#1A1814] dark:text-white hover:bg-[#F4EFE6] dark:hover:bg-[#211E19]/50 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            title="Refresh bookings data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[var(--surface)] p-5 rounded-2xl border border-[#E8E0D2] dark:border-[var(--border-subtle)] shadow-xs">
          <span className="text-xs font-bold text-[#857D70] dark:text-[#A39A8B] uppercase">Total Bookings</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-[#1A1814] dark:text-white">{bookings.length}</span>
            <CalendarCheck className="w-5 h-5 text-[#A97F3E] dark:text-[#D9BC7E]" />
          </div>
        </div>

        <div className="bg-white dark:bg-[var(--surface)] p-5 rounded-2xl border border-amber-200 dark:border-amber-900/40 shadow-xs">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">Pending Slips</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-amber-700 dark:text-amber-400">{pendingCount}</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-[var(--surface)] p-5 rounded-2xl border border-[#A97F3E]/30 dark:border-[#D9BC7E]/30 shadow-xs">
          <span className="text-xs font-bold text-[#A97F3E] dark:text-[#D9BC7E] uppercase">Verified Revenue</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-[#A97F3E] dark:text-[#D9BC7E]">${totalRevenue.toLocaleString()}</span>
            <DollarSign className="w-5 h-5 text-[#A97F3E]" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[var(--surface)] p-4 rounded-2xl border border-[#E8E0D2] dark:border-[var(--border-subtle)] shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#857D70] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, email, booking ref, or tour..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F4EFE6] dark:bg-[var(--surface)] border border-[#E8E0D2] dark:border-[var(--border-subtle)] rounded-xl py-2 pl-10 pr-4 text-xs font-medium text-[#1A1814] dark:text-white placeholder:text-[#857D70] focus:outline-none focus:border-[#A97F3E]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'Pending', 'Verified', 'Rejected'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-[#A97F3E] text-white'
                  : 'bg-[#F4EFE6] dark:bg-[var(--surface)] text-[#4A453D] dark:text-[#D9D2C5] hover:bg-[#E8E0D2] dark:hover:bg-[#211E19]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List / Table */}
      <div className="bg-white dark:bg-[var(--surface)] rounded-2xl border border-[#E8E0D2] dark:border-[var(--border-subtle)] overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs font-semibold text-[#857D70] dark:text-[#A39A8B]">
            Loading reservations...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 text-center">
            <CalendarCheck className="w-10 h-10 text-[#857D70] mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-bold text-[#1A1814] dark:text-white mb-1">No bookings match your filter</h3>
            <p className="text-xs text-[#857D70] dark:text-[#A39A8B]">Try searching for a different keyword or reset the status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#FAF7F2] dark:bg-[var(--surface)] text-[#857D70] dark:text-[#A39A8B] text-[11px] uppercase tracking-wider border-b border-[#E8E0D2] dark:border-[var(--border-subtle)]">
                  <th className="p-4 font-bold">Booking Details</th>
                  <th className="p-4 font-bold">Customer</th>
                  <th className="p-4 font-bold">Amount</th>
                  <th className="p-4 font-bold">Payment Status</th>
                  <th className="p-4 font-bold">Receipt / Slip</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D2] dark:divide-[rgba(212,180,119,0.1)]">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#F4EFE6]/60 dark:hover:bg-[#211E19]/30 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-xs text-[#1A1814] dark:text-white">{b.service_name || 'Expedition Booking'}</div>
                      <div className="text-[11px] text-[#857D70] dark:text-[#A39A8B] mt-0.5">
                        Ref: <span className="font-mono text-[#A97F3E] dark:text-[#D9BC7E]">{b.id}</span>
                      </div>
                      <div className="text-[11px] text-[#857D70] dark:text-[#A39A8B]">
                        {new Date(b.created_at).toLocaleDateString()} • {b.service_type || 'Tour'}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="text-xs font-bold text-[#1A1814] dark:text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#A97F3E]" />
                        {b.customer_name || 'Traveler'}
                      </div>
                      <div className="text-[11px] text-[#857D70] dark:text-[#A39A8B] flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3.5 h-3.5" />
                        {b.customer_email || 'No email provided'}
                      </div>
                      {b.customer_phone && (
                        <div className="text-[11px] text-[#857D70] dark:text-[#A39A8B] flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3.5 h-3.5" />
                          {b.customer_phone}
                        </div>
                      )}
                    </td>

                    <td className="p-4 font-bold text-xs text-[#1A1814] dark:text-white">
                      ${Number(b.total_amount || b.total_price || 0).toLocaleString()}
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        b.payment_status === 'Verified'
                          ? 'bg-emerald-100 dark:bg-[var(--background)] text-[#A97F3E] dark:text-[#D9BC7E] border border-emerald-300 dark:border-[var(--border-subtle)]'
                          : b.payment_status === 'Rejected'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300'
                      }`}>
                        {b.payment_status === 'Verified' ? <CheckCircle2 className="w-3 h-3" /> :
                         b.payment_status === 'Rejected' ? <XCircle className="w-3 h-3" /> :
                         <Clock className="w-3 h-3" />}
                        {b.payment_status || 'Pending'}
                      </span>
                    </td>

                    <td className="p-4">
                      {b.receipt_url ? (
                        <a
                          href={b.receipt_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#A97F3E] dark:text-[#D9BC7E] hover:underline"
                        >
                          <FileText className="w-3.5 h-3.5" /> View Slip
                        </a>
                      ) : (
                        <span className="text-[11px] text-[#857D70] dark:text-[#A39A8B] italic">No slip attached</span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => setSelectedVoucher(b)}
                          title="Preview e-Voucher"
                          className="p-1.5 rounded-lg bg-[#F4EFE6] dark:bg-[var(--surface)] hover:bg-[#E8E0D2] text-[#4A453D] dark:text-white"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {b.payment_status !== 'Verified' && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'Verified', 'CONFIRMED')}
                            disabled={actionLoading === b.id}
                            title="Verify Bank Payment"
                            className="px-2.5 py-1 rounded-lg bg-[#A97F3E] hover:bg-[#8A6530] text-white text-[11px] font-bold transition-colors disabled:opacity-50"
                          >
                            Verify
                          </button>
                        )}

                        {b.payment_status !== 'Rejected' && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'Rejected', 'CANCELLED')}
                            disabled={actionLoading === b.id}
                            title="Reject Payment Slip"
                            className="px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 text-[11px] font-bold transition-colors disabled:opacity-50"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Voucher Modal */}
      {selectedVoucher && (
        <BookingVoucherModal
          booking={selectedVoucher}
          onClose={() => setSelectedVoucher(null)}
        />
      )}
    </div>
  );
};
