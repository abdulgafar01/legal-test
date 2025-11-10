"use client";

import React from "react";
import { ArrowLeft, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { WalletTab } from "@/components/wallet/WalletTab";
import { useTranslations } from "next-intl";

export default function WalletPage() {
  const router = useRouter();
  const t = useTranslations("dashboard");

  return (
    <div className="h-[calc(100vh-60px)] overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Wallet className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t("wallet.Wallet")}
              </h1>
              <p className="text-gray-600">{t("p1")}</p>
            </div>
          </div>
        </div>

        {/* Wallet Content */}
        <div className="space-y-6">
          <WalletTab />
        </div>
      </div>
    </div>
  );
}
