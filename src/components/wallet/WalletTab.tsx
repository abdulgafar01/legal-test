"use client";
import React, { useEffect, useState } from "react";
import { ApiService } from "@/config/apiService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface WalletSummary {
  id: number;
  available_balance: string;
  pending_balance: string;
  total_balance: string;
  total_earned: string;
  total_withdrawn: string;
  last_withdrawal_at: string | null;
}

interface WalletTransaction {
  id: number;
  transaction_type: string;
  amount: string;
  description: string;
  consultation_info?: {
    id: number;
    service_seeker_name: string;
    date: string;
    start_time: string;
  } | null;
  balance_before: string;
  balance_after: string;
  created_at: string;
  counterparty_name?: string | null;
  direction: "in" | "out";
}

interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const WalletTab: React.FC = () => {
  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("dashboard");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setError(null);
    try {
      setLoading(true);
      const [walletRes, txRes] = await Promise.all([
        ApiService.getWallet(),
        ApiService.getWalletTransactions({ page: 1 }),
      ]);
      const walletData = walletRes.data.data;
      const txData: Paginated<WalletTransaction> = txRes.data;
      setWallet(walletData);
      setTransactions(txData.results || []);
      setHasMore(!!txData.next);
      setPage(1);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load wallet");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!hasMore || txLoading) return;
    try {
      setTxLoading(true);
      const nextPage = page + 1;
      const res = await ApiService.getWalletTransactions({ page: nextPage });
      const txData: Paginated<WalletTransaction> = res.data;
      setTransactions((prev) => [...prev, ...(txData.results || [])]);
      setHasMore(!!txData.next);
      setPage(nextPage);
    } catch (e) {
    } finally {
      setTxLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!wallet || withdrawing || parseFloat(wallet.available_balance) <= 0)
      return;
    try {
      setWithdrawing(true);
      const res = await ApiService.requestWithdrawal();
      const data = res.data.data;
      setWallet(data.wallet);
      if (data.withdrawal_transaction) {
        setTransactions((prev) => [data.withdrawal_transaction, ...prev]);
      } else {
        fetchAll();
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || "Withdrawal failed");
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-red-600 text-sm">{error}</p>
        <Button variant="outline" onClick={fetchAll}>
          {t("wallet.Retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="bg-black text-white">
        <CardHeader>
          <CardTitle className="text-white">
            {t("wallet.Wallet Balance")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="text-4xl font-bold">
              ${parseFloat(wallet?.available_balance || "0").toFixed(2)}
            </div>
            <p className="text-xs text-gray-300 mt-1">
              {t("wallet.Available for withdrawal")}
            </p>
          </div>
          <Button
            onClick={handleWithdraw}
            disabled={
              withdrawing ||
              !wallet ||
              parseFloat(wallet.available_balance) <= 0
            }
            className="bg-yellow-400 text-black hover:bg-yellow-300"
          >
            {withdrawing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t("wallet.Request Withdraw")
            )}
          </Button>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-4">
          {t("wallet.Transaction History")}
        </h3>
        {transactions.length === 0 && (
          <p className="text-sm text-gray-500">
            {t("wallet.No transactions yet")}
          </p>
        )}
        <ul className="divide-y border rounded-lg bg-white">
          {transactions.map((tx) => {
            const isIn = tx.direction === "in";
            const Icon = isIn ? ArrowDownLeft : ArrowUpRight;
            return (
              <li key={tx.id} className="p-4 flex items-start gap-4">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    isIn
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-sm">
                      {tx.transaction_type === "credit" && tx.counterparty_name
                        ? `${t("wallet.Consultation with")} ${
                            tx.counterparty_name
                          }`
                        : tx.description}
                    </p>
                    <span
                      className={`text-sm font-semibold ${
                        isIn ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isIn ? "+" : "-"}${parseFloat(tx.amount).toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span>{new Date(tx.created_at).toLocaleString()}</span>
                    {tx.consultation_info && (
                      <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                        {t("wallet.Consultation")} #{tx.consultation_info.id}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        isIn
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {isIn ? t("wallet.Successful") : t("wallet.Processed")}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        {hasMore && (
          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={loadMore} disabled={txLoading}>
              {txLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t("wallet.Load More")
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletTab;
