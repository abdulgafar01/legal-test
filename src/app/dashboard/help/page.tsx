"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function HelpPage() {
  const t = useTranslations("dashboard.help");

  return (
    <div className="h-[calc(100vh-60px)] overflow-y-auto mb-3">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/profile" passHref className="cursor-pointer">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        </div>

        {/* Main Help Sections */}
        <Card className="shadow-card mb-4">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-2">
              {t("sections.gettingStarted.title")}
            </h2>
            <p className="text-gray-700 mb-4">
              {t("sections.gettingStarted.content")}
            </p>

            <h2 className="text-lg font-semibold mb-2">
              {t("sections.bookingConsultations.title")}
            </h2>
            <p className="text-gray-700 mb-4">
              {t("sections.bookingConsultations.content")}
            </p>

            <h2 className="text-lg font-semibold mb-2">
              {t("sections.legalGuidance.title")}
            </h2>
            <p className="text-gray-700 mb-4">
              {t("sections.legalGuidance.content")}
            </p>

            <h2 className="text-lg font-semibold mb-2">
              {t("sections.contactSupport.title")}
            </h2>
            <p className="text-gray-700">
              <a
                className="text-blue-600 underline"
                href="mailto:support@example.com"
              >
                {t("sections.contactSupport.content", {
                  email: "admin@theyas.co",
                })}
              </a>
            </p>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t("faq.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{t("faq.q1.question")}</h3>
                <p className="text-gray-700">{t("faq.q1.answer")}</p>
              </div>

              <div>
                <h3 className="font-medium">{t("faq.q2.question")}</h3>
                <p className="text-gray-700">{t("faq.q2.answer")}</p>
              </div>

              <div>
                <h3 className="font-medium">{t("faq.q3.question")}</h3>
                <p className="text-gray-700">{t("faq.q3.answer")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
