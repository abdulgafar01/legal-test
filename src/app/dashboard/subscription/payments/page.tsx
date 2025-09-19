'use client'
import Link from 'next/link';
import { ArrowLeft, Loader2, CircleDollarSign } from 'lucide-react';
import { useCurrentSubscription, useSubscriptionPayments, useAllSubscriptionPayments } from '@/hooks/useSubscriptions';
import { format } from 'date-fns';

export default function SubscriptionPaymentsPage(){
  const { data: sub, isLoading } = useCurrentSubscription();
  const { data: allPayments = [], isLoading: loadingAll } = useAllSubscriptionPayments();
  const { data: currentPayments = [], isLoading: loadingCurrent } = useSubscriptionPayments(sub?.id);
  const payments = allPayments;
  const showingHistorical = currentPayments.length !== allPayments.length && allPayments.length > 0;
  return (
    <div className="h-[calc(100vh-60px)] overflow-y-auto mb-3">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/profile" className="inline-flex items-center justify-center h-9 w-9 hover:bg-muted rounded-md"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-2xl font-bold">Subscription Payments</h1>
        </div>
        {isLoading && <div className="flex items-center gap-2 text-sm"><Loader2 className="w-4 h-4 animate-spin"/> Loading subscription...</div>}
        {!isLoading && !sub && <div className="text-sm text-muted-foreground">No active subscription. <Link className="underline" href="/dashboard/subscription">View Plans</Link></div>}
        {sub && (
          <div className="mb-6 text-sm text-muted-foreground">Current plan: <strong>{sub.plan.name}</strong></div>
        )}
        <div className="border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="p-2 font-medium">ID</th>
                <th className="p-2 font-medium">Status</th>
                <th className="p-2 font-medium">Amount</th>
                <th className="p-2 font-medium">Paid At</th>
              </tr>
            </thead>
            <tbody>
              {(loadingAll || loadingCurrent) && (
                <tr><td className="p-3" colSpan={4}><Loader2 className="w-4 h-4 animate-spin inline"/> Loading payments...</td></tr>
              )}
              {!loadingAll && payments.length === 0 && (
                <tr><td className="p-3 text-muted-foreground text-center" colSpan={4}>No payments yet.</td></tr>
              )}
              {payments.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="p-2 font-mono text-xs">{p.id.slice(0,8)}…</td>
                  <td className="p-2 capitalize flex items-center gap-1">{p.status === 'succeeded' && <CircleDollarSign className="w-4 h-4 text-green-600"/>}{p.status}</td>
                  <td className="p-2">{p.currency} {parseFloat(p.amount).toFixed(2)}</td>
                  <td className="p-2">{p.paid_at ? format(new Date(p.paid_at), 'PPP p') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showingHistorical && (
          <div className="mt-2 text-xs text-muted-foreground">Showing all payments across current and past subscriptions.</div>
        )}
      </div>
    </div>
  );
}
