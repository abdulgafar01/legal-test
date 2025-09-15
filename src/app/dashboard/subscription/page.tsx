'use client'
import { useState, useEffect } from "react";
import { ArrowLeft, Crown, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { useSubscriptionPlans, useCheckout, useCurrentSubscription } from '@/hooks/useSubscriptions';
import { Plan } from '@/types/subscription';
import { formatDistanceToNow } from 'date-fns';

const features = [
  "Everything in free",
  "Higher limits of messaging, file uploads, advanced case file generation",
  "Standard voice mode",
  "Standard voice mode"
];

export default function Subscription() {
  const { data: plans = [], isLoading: loadingPlans } = useSubscriptionPlans();
  const { data: currentSub } = useCurrentSubscription();
  const checkoutMutation = useCheckout();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showPaymentSummary, setShowPaymentSummary] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [charges, setCharges] = useState<string>('0.00');

  useEffect(() => {
    if (plans.length && !selectedPlan) {
      // pick recommended (trial excluded) or first
      const recommended = plans.find(p => !p.is_trial && p.interval_count === 3) || plans[0];
      setSelectedPlan(recommended);
    }
  }, [plans, selectedPlan]);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handleGoPremium = () => {
    if (!selectedPlan) return;
    const price = parseFloat(selectedPlan.price_amount);
    const fee = (price * 0.008).toFixed(2);
    setCharges(fee);
    setShowPaymentSummary(true);
  };

  const handlePayment = () => {
    if (!selectedPlan) return;
    checkoutMutation.mutate(selectedPlan.code, {
      onSuccess: () => {
        setShowPaymentSummary(false);
        setShowSuccess(true);
      }
    });
  };

  const priceDisplay = (plan: Plan) => `$${parseFloat(plan.price_amount).toFixed(2)}`;

  const totalWithCharges = selectedPlan ? (parseFloat(selectedPlan.price_amount) + parseFloat(charges)).toFixed(2) : '0.00';

  return (
    <div className="h-[calc(100vh-60px)] overflow-y-auto mb-3">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/profile" passHref>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Subscription</h1>
        </div>

        {/* Premium Section */}
        <div className="bg-white text-white mb-8 p-0 max-w-xl ">
          {/* first card */}
          <div className="p-4 bg-black rounded-t-2xl m-0">
            <div className="text-center mb-8">
              <Crown className="w-12 h-12 mx-auto mb-4 text-legal-gold" />
              <h2 className="text-3xl font-bold mb-2">Go premium</h2>
              <p className="text-gray-300">Level up productivity and creativity with expanded access</p>
            </div>

            {/* Pricing Plans */}
            <div className="flex justify-center mb-8">
              <div className="flex gap-4 p-2 bg-white/10 rounded-lg">
                {loadingPlans && <div className="text-sm px-4 py-2">Loading...</div>}
                {!loadingPlans && plans.filter(p=>!p.is_trial).map(plan => {
                  const label = `${plan.interval_count} ${plan.interval_unit === 'month' ? (plan.interval_count>1? 'Months':'Month') : 'Days'}`;
                  const recommended = plan.interval_unit==='month' && plan.interval_count===3;
                  const active = selectedPlan?.id === plan.id;
                  return (
                    <div key={plan.id} className={`relative p-4 rounded-lg cursor-pointer transition-all ${active ? 'bg-white/30 text-legal-dark' : 'hover:bg-white/20'}`} onClick={()=>handleSelectPlan(plan)}>
                      {recommended && (
                        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-legal-gold text-legal-dark text-xs">RECOMMENDED</Badge>
                      )}
                      <div className="text-center">
                        <div className="text-sm font-medium">{label}</div>
                        <div className="text-xl font-bold">{priceDisplay(plan)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
            
            {/* second card */}

          <div className="p-4 bg-[#F4F5F9] rounded-b-2xl m-0">
                   {/* Features */}
        <div className="mb-8 flex flex-col">
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-[#998100]" />
                </div>
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>

        {/* Go Premium Button */}
       
          {currentSub && (
            <div className="text-xs text-muted-foreground mt-2">Active: {currentSub.plan.name} • Renews / Ends {currentSub.current_period_end ? formatDistanceToNow(new Date(currentSub.current_period_end), { addSuffix: true }) : ''}</div>
          )}
          <Button size="sm" className="items-center bg-black text-white max-w-md  rounded-3xl mt-3" onClick={handleGoPremium} disabled={!selectedPlan || checkoutMutation.isPending}>
            {checkoutMutation.isPending ? 'Processing...' : 'Go premium'}
          </Button>
     
      </div>
          </div>
        </div>

       

 </div>


      {/* Payment Summary Modal */}
      <Dialog open={showPaymentSummary} onOpenChange={setShowPaymentSummary}>
        <DialogContent className="max-w-md">
           <DialogTitle className="sr-only">Payment Summary</DialogTitle>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Payment Summary</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowPaymentSummary(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            {selectedPlan && <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-legal-gold rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-legal-dark" />
              </div>
              <div>
                <h4 className="font-semibold">{selectedPlan.name}</h4>
                <p className="text-sm text-muted-foreground">Interval: {selectedPlan.interval_count} {selectedPlan.interval_unit}</p>
                <p className="text-sm text-muted-foreground">Price: {priceDisplay(selectedPlan)}</p>
              </div>
            </div>}
            {selectedPlan && <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-muted-foreground">{priceDisplay(selectedPlan)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Charges</span><span className="text-muted-foreground">${charges}</span></div>
              <div className="flex justify-between font-semibold text-base"><span>Total</span><span>${totalWithCharges}</span></div>
            </div>}
            <Button variant="ghost" size="lg" className="w-full" onClick={handlePayment} disabled={checkoutMutation.isPending}>{checkoutMutation.isPending ? 'Processing...' : `Pay $${totalWithCharges}`}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
  <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-md">
           <DialogTitle className="sr-only">Payment Successful</DialogTitle>
          <div className="p-6 text-center">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => setShowSuccess(false)}>
              <X className="w-5 h-5" />
            </Button>
            
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            
            <h3 className="text-xl font-bold mb-4">Your payment was successful</h3>
    {selectedPlan && <p className="text-muted-foreground">You have successfully subscribed to <strong>{selectedPlan.name}</strong>.</p>}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}