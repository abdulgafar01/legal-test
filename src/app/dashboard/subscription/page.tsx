'use client'
import { useState } from "react";
import { ArrowLeft, Crown, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface PricingPlan {
  duration: string;
  price: string;
  recommended?: boolean;
}

interface PaymentSummary {
  type: string;
  costPerMonth: string;
  duration: string;
  months: number;
  subtotal: string;
  charges: string;
  total: string;
}

const pricingPlans: PricingPlan[] = [
  { duration: "1 Month", price: "$24.99" },
  { duration: "3 Month", price: "$34.99", recommended: true },
  { duration: "6 Month", price: "$54.99" }
];

const features = [
  "Everything in free",
  "Higher limits of messaging, file uploads, advanced case file generation",
  "Standard voice mode",
  "Standard voice mode"
];

export default function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>(pricingPlans[1]);
  const [showPaymentSummary, setShowPaymentSummary] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary>({
    type: "Legal AI",
    costPerMonth: "$5.00",
    duration: "6 months",
    months: 6,
    subtotal: "$60.00",
    charges: "$0.46",
    total: "$60.46"
  });

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlan(plan);
  };

  const handleGoPremium = () => {
    // Update payment summary based on selected plan
    const monthsMap = { "1 Month": 1, "3 Month": 3, "6 Month": 6 };
    const months = monthsMap[selectedPlan.duration as keyof typeof monthsMap] || 6;
    const price = parseFloat(selectedPlan.price.replace('$', ''));
    const charges = (price * 0.008).toFixed(2); // Approximate charges
    const total = (price + parseFloat(charges)).toFixed(2);
    
    setPaymentSummary({
      ...paymentSummary,
      duration: selectedPlan.duration.toLowerCase(),
      months,
      subtotal: selectedPlan.price,
      charges: `$${charges}`,
      total: `$${total}`
    });
    setShowPaymentSummary(true);
  };

  const handlePayment = () => {
    setShowPaymentSummary(false);
    setShowSuccess(true);
  };

  const adjustMonths = (increment: number) => {
    const newMonths = Math.max(1, paymentSummary.months + increment);
    const costPerMonth = 5.00; // Base cost per month
    const subtotal = (newMonths * costPerMonth).toFixed(2);
    const charges = (parseFloat(subtotal) * 0.008).toFixed(2);
    const total = (parseFloat(subtotal) + parseFloat(charges)).toFixed(2);
    
    setPaymentSummary({
      ...paymentSummary,
      months: newMonths,
      duration: `${newMonths} months`,
      subtotal: `$${subtotal}`,
      charges: `$${charges}`,
      total: `$${total}`
    });
  };

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
        <Card className="bg-black text-white mb-8 ">
          <CardContent className="p-4">
            <div className="text-center mb-8">
              <Crown className="w-12 h-12 mx-auto mb-4 text-legal-gold" />
              <h2 className="text-3xl font-bold mb-2">Go premium</h2>
              <p className="text-gray-300">Level up productivity and creativity with expanded access</p>
            </div>

            {/* Pricing Plans */}
            <div className="flex justify-center mb-8">
              <div className="flex gap-4 p-2 bg-white/10 rounded-lg">
                {pricingPlans.map((plan, index) => (
                  <div 
                    key={index}
                    className={`relative p-4 rounded-lg cursor-pointer transition-all ${
                      selectedPlan.duration === plan.duration 
                        ? 'bg-white/30 text-legal-dark' 
                        : 'hover:bg-white/20'
                    }`}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    {plan.recommended && (
                      <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-legal-gold text-legal-dark text-xs">
                        RECOMMENDED
                      </Badge>
                    )}
                    <div className="text-center">
                      <div className="text-sm font-medium">{plan.duration}</div>
                      <div className="text-xl font-bold">{plan.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mb-8">
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Go Premium Button */}
        <div className="text-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full max-w-md"
            onClick={handleGoPremium}
          >
            Go premium
          </Button>
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

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-legal-gold rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-legal-dark" />
              </div>
              <div>
                <h4 className="font-semibold">Premium Subscription</h4>
                <p className="text-sm text-muted-foreground">Type: {paymentSummary.type}</p>
                <p className="text-sm text-muted-foreground">Cost per month: {paymentSummary.costPerMonth}</p>
                <p className="text-sm text-muted-foreground">Duration: {paymentSummary.duration}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="font-medium mb-3">You can adjust months below</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => adjustMonths(-1)}
                  >
                    -
                  </Button>
                  <span className="text-xl font-semibold w-8 text-center">{paymentSummary.months}</span>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => adjustMonths(1)}
                  >
                    +
                  </Button>
                </div>
                <span className="text-xl font-bold">{paymentSummary.subtotal}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-muted-foreground">{paymentSummary.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Charges</span>
                <span className="text-muted-foreground">{paymentSummary.charges}</span>
              </div>
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>{paymentSummary.total}</span>
              </div>
            </div>

            <Button 
              variant="ghost" 
              size="lg" 
              className="w-full"
              onClick={handlePayment}
            >
              Pay {paymentSummary.total}
            </Button>
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
            <p className="text-muted-foreground">
              You have successfully made payment for <strong>{paymentSummary.months} months</strong> subscription.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}