import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPlans, checkout, getCurrentSubscription, getSubscriptionHistory, cancelSubscription, getSubscriptionPayments } from '@/lib/api/subscriptions';
import { Plan, Subscription, SubscriptionPayment } from '@/types/subscription';

export function useSubscriptionPlans() {
  return useQuery<Plan[]>({
    queryKey: ['subscription','plans'],
    queryFn: getPlans,
  });
}

export function useCurrentSubscription() {
  return useQuery<Subscription | null>({
    queryKey: ['subscription','current'],
    queryFn: getCurrentSubscription,
  });
}

export function useSubscriptionHistory() {
  return useQuery<Subscription[]>({
    queryKey: ['subscription','history'],
    queryFn: getSubscriptionHistory,
  });
}

export function useSubscriptionPayments(subscriptionId?: string) {
  return useQuery<SubscriptionPayment[]>({
    queryKey: ['subscription','payments', subscriptionId],
    queryFn: () => {
      if (!subscriptionId) return Promise.resolve([]);
      return getSubscriptionPayments(subscriptionId);
    },
    enabled: !!subscriptionId,
  });
}

export function useCheckout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (plan_code: string) => checkout(plan_code),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subscription','current'] });
      qc.invalidateQueries({ queryKey: ['subscription','history'] });
    }
  });
}

export function useCancelSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, immediate }: { id: string; immediate?: boolean }) => cancelSubscription(id, !!immediate),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subscription','current'] });
      qc.invalidateQueries({ queryKey: ['subscription','history'] });
    }
  });
}
