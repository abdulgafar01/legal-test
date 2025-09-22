import instance from '../axios';
import { Plan, Subscription, SubscriptionPayment, Paginated } from '@/types/subscription';

const BASE = '/api/v1/subscriptions'; // appended after API base (already configured in axios instance buildApiUrl)

export async function getPlans(): Promise<Plan[]> {
  const { data } = await instance.get(`${BASE}/plans/`);
  return data as Plan[];
}

export async function checkout(plan_code: string): Promise<Subscription> {
  const { data } = await instance.post(`${BASE}/checkout/`, { plan_code });
  return data as Subscription;
}

export async function getCurrentSubscription(): Promise<Subscription | null> {
  try {
    const { data } = await instance.get(`${BASE}/me/`);
    return data as Subscription;
  } catch (e: any) {
    if (e?.response?.status === 404) return null;
    throw e;
  }
}

export async function getSubscriptionHistory(): Promise<Subscription[]> {
  const { data } = await instance.get(`${BASE}/history/`);
  if (Array.isArray(data)) return data as Subscription[];
  if (data?.results) return data.results as Subscription[];
  return [];
}

export async function cancelSubscription(id: string, immediate = false): Promise<Subscription> {
  const { data } = await instance.post(`${BASE}/${id}/cancel/`, { immediate });
  return data as Subscription;
}

export async function getSubscriptionPayments(id: string): Promise<SubscriptionPayment[]> {
  const { data } = await instance.get(`${BASE}/${id}/payments/`);
  if (Array.isArray(data)) return data as SubscriptionPayment[];
  if (data?.results) return data.results as SubscriptionPayment[];
  return [];
}

export async function getAllSubscriptionPayments(): Promise<SubscriptionPayment[]> {
  const { data } = await instance.get(`${BASE}/payments/`);
  if (Array.isArray(data)) return data as SubscriptionPayment[];
  if (data?.results) return data.results as SubscriptionPayment[];
  return [];
}
