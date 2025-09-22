export interface Plan {
  id: string;
  code: string;
  name: string;
  description?: string;
  interval_unit: 'day' | 'month';
  interval_count: number;
  is_trial: boolean;
  price_amount: string; // decimal as string
  currency: string;
}

export interface Subscription {
  id: string;
  plan: Plan;
  status: 'pending' | 'active' | 'canceled' | 'expired';
  started_at?: string | null;
  current_period_start?: string | null;
  current_period_end?: string | null;
  trial_started_at?: string | null;
  trial_ends_at?: string | null;
  auto_renew: boolean;
  canceled_at?: string | null;
  cancellation_effective_at?: string | null;
}

export interface SubscriptionPayment {
  id: string;
  status: 'initiated' | 'succeeded' | 'failed' | 'canceled' | 'refunded';
  amount: string;
  currency: string;
  payment_provider: string;
  paid_at?: string | null;
  created_at: string;
}

export interface Paginated<T> {
  count?: number; // if DRF pagination returns
  next?: string | null;
  previous?: string | null;
  results?: T[]; // page results when using DRF default
  data?: T[]; // fallback if custom shape
}
