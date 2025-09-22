'use client'
import { ArrowLeft, Loader2, Crown, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCancelSubscription, useCurrentSubscription } from '@/hooks/useSubscriptions';
import { format } from 'date-fns';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

export default function ManageSubscriptionPage(){
  const { data: sub, isLoading } = useCurrentSubscription();
  const cancelMutation = useCancelSubscription();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [immediate, setImmediate] = useState(false);

  return (
    <div className="h-[calc(100vh-60px)] overflow-y-auto mb-3">
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/profile"><Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button></Link>
          <h1 className="text-2xl font-bold">Manage Subscription</h1>
        </div>
        {isLoading && <div className="flex items-center gap-2 text-sm"><Loader2 className="w-4 h-4 animate-spin"/> Loading...</div>}
        {!isLoading && !sub && <div className="text-sm text-muted-foreground">No active subscription. <Link href="/dashboard/subscription" className="underline">View Plans</Link></div>}
        {sub && (
          <div className="max-w-xl rounded-xl border p-5 bg-[#F6F6F6]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-md bg-black flex items-center justify-center"><Crown className="w-5 h-5 text-legal-gold"/></div>
              <div>
                <div className="font-semibold">{sub.plan.name}</div>
                <div className="text-xs text-muted-foreground">Status: {sub.status}</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {sub.current_period_end && <div className="flex justify-between"><span>Current period ends</span><span>{format(new Date(sub.current_period_end), 'PPP')}</span></div>}
              {sub.trial_ends_at && <div className="flex justify-between"><span>Trial ends</span><span>{format(new Date(sub.trial_ends_at), 'PPP')}</span></div>}
              <div className="flex justify-between items-center"><span>Auto renewal</span>
                <input type="checkbox" checked={sub.auto_renew} disabled className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="destructive" size="sm" onClick={()=>setOpenConfirm(true)} disabled={cancelMutation.isPending}><Trash2 className="w-4 h-4 mr-1"/>Cancel</Button>
              <Link href="/dashboard/subscription/payments" className="text-sm underline self-center">View Payments</Link>
            </div>
          </div>
        )}
      </div>
      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent className="max-w-sm">
          <DialogTitle className="font-semibold">Cancel subscription</DialogTitle>
          <p className="text-sm text-muted-foreground">Are you sure you want to cancel? {immediate? 'You will lose access immediately.' : 'Access remains until period end.'}</p>
          <div className="flex items-center gap-2 text-xs mt-2">
            <input id="immediate" type="checkbox" checked={immediate} onChange={(e)=>setImmediate(e.target.checked)} />
            <label htmlFor="immediate">Cancel immediately</label>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button variant="outline" className="w-full sm:flex-1" onClick={()=>setOpenConfirm(false)}>Close</Button>
            <Button className="w-full sm:flex-1" variant="destructive" disabled={cancelMutation.isPending} onClick={()=>{
              if(!sub) return; 
              cancelMutation.mutate({id: sub.id, immediate},{
                onSuccess: ()=>{ setOpenConfirm(false); },
              });
            }}>{cancelMutation.isPending? 'Cancelling...' : 'Confirm'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
