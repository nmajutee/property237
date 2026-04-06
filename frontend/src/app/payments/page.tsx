'use client'

import { useState } from 'react'
import { paymentService } from '@/services/paymentService'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export default function PaymentsPage() {
  const [tab, setTab] = useState<'transactions' | 'accounts' | 'invoices' | 'wallet'>('transactions')
  const [showPayment, setShowPayment] = useState(false)
  const [paymentForm, setPaymentForm] = useState({
    transaction_type: 'rent_payment',
    amount: '',
    payment_method: '',
    phone_number: '',
    description: '',
  })

  const queryClient = useQueryClient()

  const { data: methods } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: () => paymentService.getMethods(),
  })
  const { data: transactions, isLoading: loadingTxns } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => paymentService.listTransactions(),
  })
  const { data: accounts } = useQuery({
    queryKey: ['payment-accounts'],
    queryFn: () => paymentService.getAccounts(),
  })
  const { data: invoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => paymentService.getInvoices(),
  })
  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => paymentService.getWallet(),
  })
  const { data: summary } = useQuery({
    queryKey: ['payment-summary'],
    queryFn: () => paymentService.getSummary(),
  })

  const initiatePay = useMutation({
    mutationFn: (data: any) => paymentService.initiatePayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      setShowPayment(false)
      setPaymentForm({ transaction_type: 'rent_payment', amount: '', payment_method: '', phone_number: '', description: '' })
    },
  })

  const methodsList = (methods as any) || []
  const txnsList = (transactions as any)?.results || transactions || []
  const accountsList = (accounts as any)?.results || accounts || []
  const invoicesList = (invoices as any)?.results || invoices || []
  const walletList = (wallet as any)?.results || wallet || []
  const summaryData = (summary as any) || {}

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'text-green-600 bg-green-100',
      pending: 'text-yellow-600 bg-yellow-100',
      processing: 'text-blue-600 bg-blue-100',
      failed: 'text-red-600 bg-red-100',
      cancelled: 'text-gray-600 bg-gray-100',
    }
    return colors[status] || 'text-gray-600 bg-gray-100'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Payments</h1>
          <button
            onClick={() => setShowPayment(!showPayment)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + New Payment
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Total Transactions</p>
            <p className="text-2xl font-bold">{summaryData.total_transactions || 0}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-2xl font-bold">{summaryData.total_spent || '0'} XAF</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{summaryData.pending_count || 0}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-green-600">{summaryData.completed_count || 0}</p>
          </div>
        </div>

        {/* New payment form */}
        {showPayment && (
          <div className="bg-white p-4 rounded shadow mb-4">
            <h3 className="font-semibold mb-3">Initiate Payment</h3>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={paymentForm.transaction_type}
                onChange={(e) => setPaymentForm({ ...paymentForm, transaction_type: e.target.value })}
                className="border rounded px-3 py-2"
              >
                <option value="rent_payment">Rent Payment</option>
                <option value="deposit_payment">Security Deposit</option>
                <option value="commission_payment">Agent Commission</option>
                <option value="maintenance_payment">Maintenance</option>
                <option value="subscription">Subscription</option>
                <option value="ad_payment">Advertisement</option>
              </select>
              <input
                type="number"
                placeholder="Amount (XAF)"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <select
                value={paymentForm.payment_method}
                onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
                className="border rounded px-3 py-2"
              >
                <option value="">Select Payment Method</option>
                {(methodsList as any[]).map((m: any) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              <input
                type="tel"
                placeholder="Phone Number (for mobile money)"
                value={paymentForm.phone_number}
                onChange={(e) => setPaymentForm({ ...paymentForm, phone_number: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Description"
                value={paymentForm.description}
                onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
                className="border rounded px-3 py-2 col-span-2"
              />
            </div>
            <button
              onClick={() => initiatePay.mutate({
                transaction_type: paymentForm.transaction_type,
                amount: parseFloat(paymentForm.amount),
                payment_method: parseInt(paymentForm.payment_method),
                phone_number: paymentForm.phone_number,
                description: paymentForm.description,
              })}
              disabled={initiatePay.isPending || !paymentForm.amount || !paymentForm.payment_method}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {initiatePay.isPending ? 'Processing...' : 'Submit Payment'}
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-4">
          {(['transactions', 'accounts', 'invoices', 'wallet'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-t text-sm font-medium ${
                tab === t ? 'bg-white border-t border-x' : 'bg-gray-200'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-white rounded shadow p-4">
          {tab === 'transactions' && (
            <>
              {loadingTxns ? (
                <p className="text-gray-500">Loading...</p>
              ) : txnsList.length === 0 ? (
                <p className="text-gray-500">No transactions yet</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-2">ID</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Amount</th>
                      <th className="pb-2">Method</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(txnsList as any[]).map((txn: any) => (
                      <tr key={txn.id} className="border-b">
                        <td className="py-2 font-mono text-xs">{txn.transaction_id}</td>
                        <td className="py-2">{txn.transaction_type?.replace('_', ' ')}</td>
                        <td className="py-2 font-medium">{txn.total_amount} {txn.currency_code}</td>
                        <td className="py-2">{txn.payment_method_name}</td>
                        <td className="py-2">
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(txn.status)}`}>
                            {txn.status}
                          </span>
                        </td>
                        <td className="py-2 text-gray-500">{new Date(txn.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {tab === 'accounts' && (
            <div className="space-y-3">
              {accountsList.length === 0 ? (
                <p className="text-gray-500">No payment accounts</p>
              ) : (
                (accountsList as any[]).map((acc: any) => (
                  <div key={acc.id} className="border rounded p-3 flex justify-between">
                    <div>
                      <p className="font-medium">{acc.account_name}</p>
                      <p className="text-sm text-gray-500">{acc.account_type} • {acc.account_number}</p>
                      {acc.phone_number && <p className="text-sm text-gray-500">📱 {acc.phone_number}</p>}
                    </div>
                    <div className="text-right">
                      {acc.is_primary && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Primary</span>}
                      <p className="text-xs mt-1">{acc.is_verified ? '✅ Verified' : '⏳ Pending'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'invoices' && (
            <div className="space-y-3">
              {invoicesList.length === 0 ? (
                <p className="text-gray-500">No invoices</p>
              ) : (
                (invoicesList as any[]).map((inv: any) => (
                  <div key={inv.id} className="border rounded p-3 flex justify-between">
                    <div>
                      <p className="font-medium">{inv.subject}</p>
                      <p className="text-sm text-gray-500">#{inv.invoice_number} • Due: {inv.due_date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{inv.total_amount} XAF</p>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(inv.status)}`}>{inv.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'wallet' && (
            <div className="space-y-3">
              {walletList.length === 0 ? (
                <p className="text-gray-500">No wallet balances</p>
              ) : (
                (walletList as any[]).map((w: any) => (
                  <div key={w.id} className="border rounded p-4">
                    <p className="text-sm text-gray-500">{w.currency_code} Balance</p>
                    <p className="text-3xl font-bold">{w.available_balance}</p>
                    {parseFloat(w.locked_balance) > 0 && (
                      <p className="text-sm text-yellow-600">🔒 {w.locked_balance} locked</p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
