import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import PaymentGatewayModal from '../../components/modals/PaymentGatewayModal';
import type { CustomerInvoice } from '../../types';
import { fetchAccountProfile, fetchCustomerInvoices, createInvoiceCheckoutSession } from '../../utils/api';
import { PageContainer } from '../../utils/htmlToReact';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

function formatDate(value: string | null) {
  if (!value) {
    return 'Not scheduled';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function statusBadge(status: CustomerInvoice['status']) {
  switch (status) {
    case 'PAID':
      return 'bg-green-100 text-green-800';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'OVERDUE':
      return 'bg-red-100 text-red-800';
    case 'SENT':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
}

function statusIcon(status: CustomerInvoice['status']) {
  switch (status) {
    case 'PAID':
      return 'check_circle';
    case 'PENDING':
      return 'schedule';
    case 'OVERDUE':
      return 'error';
    case 'SENT':
      return 'outgoing_mail';
    default:
      return 'draft';
  }
}

function statusLabel(status: CustomerInvoice['status']) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export default function PaymentsPage() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [checkoutInvoiceId, setCheckoutInvoiceId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const checkoutState = searchParams.get('checkout');
  const checkoutMessage =
    checkoutState === 'success'
      ? 'Stripe checkout completed. Refreshing your invoice status...'
      : checkoutState === 'cancelled'
        ? 'Stripe checkout was cancelled. Your invoice remains unpaid.'
        : null;
  const pageMessage = actionMessage ?? checkoutMessage;

  const invoicesQuery = useQuery({
    queryKey: ['customer-invoices'],
    queryFn: fetchCustomerInvoices,
  });

  const accountProfileQuery = useQuery({
    queryKey: ['account-profile'],
    queryFn: fetchAccountProfile,
  });

  useEffect(() => {
    if (!checkoutState) {
      return;
    }

    void queryClient.invalidateQueries({ queryKey: ['customer-invoices'] });
  }, [checkoutState, queryClient]);

  const checkoutMutation = useMutation({
    mutationFn: createInvoiceCheckoutSession,
    onSuccess: ({ url }) => {
      if (!url) {
        setCheckoutInvoiceId(null);
        setActionMessage('Stripe did not return a checkout URL for this invoice.');
        return;
      }

      window.location.assign(url);
    },
    onError: (error) => {
      setCheckoutInvoiceId(null);
      setActionMessage(error instanceof Error ? error.message : 'Unable to start Stripe Checkout.');
    },
  });

  const handleCheckout = (invoiceId: string) => {
    setActionMessage(null);
    setCheckoutInvoiceId(invoiceId);
    checkoutMutation.mutate(invoiceId);
  };

  const handlePaymentMethodSuccess = () => {
    setActionMessage('Payment method saved successfully.');
    void queryClient.invalidateQueries({ queryKey: ['customer-invoices'] });
  };

  if (invoicesQuery.isPending || accountProfileQuery.isPending) {
    return (
      <PageContainer title="Payments & Invoices" subtitle="Manage your billing and payment history">
        <div className="rounded-lg bg-white p-6 shadow text-sm text-gray-500">Loading billing data...</div>
      </PageContainer>
    );
  }

  if (invoicesQuery.isError) {
    return (
      <PageContainer title="Payments & Invoices" subtitle="Manage your billing and payment history">
        <div className="rounded-lg bg-white p-6 shadow text-sm text-red-600">
          {invoicesQuery.error instanceof Error ? invoicesQuery.error.message : 'Unable to load billing data.'}
        </div>
      </PageContainer>
    );
  }

  const summary = invoicesQuery.data.summary;
  const invoices = invoicesQuery.data.invoices;
  const paymentMethods = invoicesQuery.data.paymentMethods;
  const billingAddress = accountProfileQuery.data?.profile.billingAddress;

  return (
    <PageContainer title="Payments & Invoices" subtitle="Manage your billing and payment history">
      <div className="space-y-6">
        {pageMessage ? (
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            {pageMessage}
          </div>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Amount</p>
              <span className="material-symbols-outlined text-blue-600 bg-blue-50 rounded-full p-2">
                account_balance_wallet
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{formatCurrency(summary.totalAmount)}</p>
            <p className="text-xs text-gray-500 mt-2">All invoices</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Paid</p>
              <span className="material-symbols-outlined text-green-600 bg-green-50 rounded-full p-2">
                verified_user
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-green-900">{formatCurrency(summary.paidAmount)}</p>
            <p className="text-xs text-green-600 mt-2">{invoices.filter((invoice) => invoice.status === 'PAID').length} invoices</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Outstanding</p>
              <span className="material-symbols-outlined text-orange-600 bg-orange-50 rounded-full p-2">
                pending_actions
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-orange-900">{formatCurrency(summary.outstandingAmount)}</p>
            <p className="text-xs text-orange-600 mt-2">{invoices.filter((invoice) => invoice.status !== 'PAID').length} invoices</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold">Saved Payment Methods</h2>
              <p className="text-sm text-gray-500 mt-1">Stored securely in Stripe for faster invoice checkout.</p>
            </div>
            <button
              type="button"
              onClick={() => setPaymentModalOpen(true)}
              className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
            >
              + Add Payment Method
            </button>
          </div>

          {paymentMethods.length > 0 ? (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 rounded-lg p-3 hidden sm:flex">
                      <span className="material-symbols-outlined text-blue-900">credit_card</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm sm:text-base uppercase">{method.brand ?? 'Card'}</p>
                        {method.isDefault ? (
                          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                            Default
                          </span>
                        ) : null}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">•••• •••• •••• {method.last4 ?? '----'}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Expires {method.expMonth?.toString().padStart(2, '0') ?? '--'}/{method.expYear ?? '--'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500">
              No saved cards yet. Add one now to speed up future invoice payments.
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 sm:p-6 border-b">
            <h2 className="text-lg font-semibold">Invoice History</h2>
          </div>

          <div className="divide-y">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="p-4 sm:p-6 hover:bg-gray-50 transition">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{invoice.invoiceCode}</h3>
                      <p className="text-xs sm:text-sm text-gray-600">{formatDate(invoice.createdAt)}</p>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">{invoice.description ?? 'Solar services invoice'}</p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm sm:text-base">{formatCurrency(Number(invoice.amount))}</p>
                      <p className="text-xs text-gray-600">Due: {formatDate(invoice.dueDate)}</p>
                    </div>
                  </div>
                </div>

                {invoice.lineItems?.length ? (
                  <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600 space-y-2">
                    {invoice.lineItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-3">
                        <span>{item.label}</span>
                        <span className="font-medium text-slate-800">{formatCurrency(Number(item.amount))}</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-4 border-t mt-4">
                  <div className="flex items-center gap-2 flex-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${statusBadge(invoice.status)}`}>
                      <span className="material-symbols-outlined text-sm">{statusIcon(invoice.status)}</span>
                      {statusLabel(invoice.status)}
                    </span>
                    {invoice.paymentTransactions?.[0]?.paidAt ? (
                      <span className="text-xs text-gray-500">Paid on {formatDate(invoice.paymentTransactions[0].paidAt)}</span>
                    ) : null}
                  </div>

                  {invoice.status !== 'PAID' ? (
                    <button
                      type="button"
                      onClick={() => handleCheckout(invoice.id)}
                      disabled={checkoutMutation.isPending && checkoutInvoiceId === invoice.id}
                      className="text-sm text-green-600 hover:text-green-900 font-semibold border border-green-600 rounded-lg px-4 py-2 transition disabled:opacity-50"
                    >
                      {checkoutMutation.isPending && checkoutInvoiceId === invoice.id ? 'Redirecting...' : 'Pay with Stripe'}
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined">info</span>
              Billing Address
            </h3>
            {billingAddress ? (
              <>
                <p className="text-sm text-blue-800 mb-2">{accountProfileQuery.data?.profile.name}</p>
                <p className="text-sm text-blue-800 mb-2">
                  {[billingAddress.line1, billingAddress.line2].filter(Boolean).join(', ')}
                </p>
                <p className="text-sm text-blue-800 mb-2">
                  {[billingAddress.city, billingAddress.state, billingAddress.postalCode].filter(Boolean).join(', ')}
                </p>
                <p className="text-sm text-blue-800">{billingAddress.country}</p>
              </>
            ) : (
              <p className="text-sm text-blue-800">No billing address saved yet.</p>
            )}
            <Link to="/customer/settings" className="mt-4 inline-block text-blue-600 hover:text-blue-900 font-semibold text-sm">
              Edit Billing Address →
            </Link>
          </div>

          <div className="bg-green-50 rounded-lg p-4 sm:p-6">
            <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined">bolt</span>
              Billing Help
            </h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li>Unpaid invoices redirect to Stripe Checkout for secure payment.</li>
              <li>Saved cards are attached through Stripe Setup Intents and reused on future checkouts.</li>
              <li>Need to change your address or account details? Update them in Settings.</li>
            </ul>
            <Link to="/support" className="mt-4 inline-block text-green-700 hover:text-green-900 font-semibold text-sm">
              Contact Billing Support →
            </Link>
          </div>
        </div>
      </div>

      {paymentModalOpen ? (
        <PaymentGatewayModal onClose={() => setPaymentModalOpen(false)} onSuccess={handlePaymentMethodSuccess} />
      ) : null}
    </PageContainer>
  );
}
