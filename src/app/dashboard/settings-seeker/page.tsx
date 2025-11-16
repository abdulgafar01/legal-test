"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BriefcaseBusiness,
  ChevronRight,
  Gem,
  Languages,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { useState } from "react";
import { useLocale } from "@/provider/LocaleProvider";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

const Page = () => {
  const [responsesPush, setResponsesPush] = useState(true);
  const [tasksEmail, setTasksEmail] = useState(true);
  const [tasksPush, setTasksPush] = useState(false);
  const [open, setOpen] = useState(false);
  const t = useTranslations("settingsSeeker");
  const { locale, setLocale } = useLocale();

  const toggleLocale = () => {
    setLocale(locale === "en" ? "ar" : "en");
    toast.success(`Language changed to ${locale === "en" ? "English" : "Arabic"}`)
  };
  return (
    <div className="max-w-4xl  p-6 md:ml-6 mx-auto">
      <div className="flex items-center gap-4 mb-3">
        <Link href="/dashboard/profile" passHref className="cursor-pointer">
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-foreground">{t("heading")}</h1>
      </div>

      <div className="w-full max-w-md  text-black/80 font-sans rounded-md overflow-hidden">
        {/* Row 1 */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#E8E7E7] cursor-pointer ">
          <div className="flex items-center gap-2">
            <User size={20} />
            <span className="text-sm font-medium">{t("Appearance")}</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-400">
            <span className="text-sm font-medium">{t("System")}</span>
            <ChevronRight size={16} />
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#E8E7E7]">
          <div className="flex items-center gap-2">
            <Languages size={20} />
            <span className="text-sm font-medium">{t("Language")}</span>
          </div>
          <button
            className="flex items-center gap-2 text-neutral-400 cursor-pointer"
            title="Click to change"
            onClick={toggleLocale}
          >
            <span className="text-sm font-medium">
              {locale === "en" ? t("English") : t("Arabic")}
            </span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Row 3 */}
        <div
          onClick={() => setOpen(true)}
          className="flex items-center justify-between px-4 py-4 border-b border-[#E8E7E7] cursor-pointer "
        >
          <div className="flex items-center gap-2">
            <Gem size={20} />
            <span className="text-sm font-medium">{t("Notifications")}</span>
          </div>
          <ChevronRight size={16} className="text-neutral-400" />
        </div>

        {/* notification modal */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md rounded-2xl p-6 no-close">
            <DialogHeader className="flex flex-row justify-between items-start">
              <DialogTitle className="text-xl font-semibold">
                {t("Notification")}
              </DialogTitle>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1 hover:bg-gray-100 cursor-pointer"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </DialogHeader>

            {/* Section 1 */}
            <div className="mt-6" dir="ltr">
              <h3 className="text-sm font-medium mb-4">{t("Responses")}</h3>
              <div className="flex items-start justify-between py-2">
                <div>
                  <p className="text-sm font-medium">{t("Push")}</p>
                  <p className="text-xs text-gray-500 max-w-xs">
                    {t("notificationsDescription")}
                  </p>
                </div>
                <Switch
                  checked={responsesPush}
                  onCheckedChange={setResponsesPush}
                />
              </div>
            </div>

            <hr className="my-6" />

            {/* Section 2 */}
            <div dir="ltr">
              <h3 className="text-sm font-medium mb-4">
                {t("Notification about tasks")}.
              </h3>
              <div className="flex items-center justify-between py-2">
                <p className="text-sm font-medium">{t("Email")}</p>
                <Switch checked={tasksEmail} onCheckedChange={setTasksEmail} />
              </div>
              <div className="flex items-center justify-between py-2">
                <p className="text-sm font-medium">{t("Push")}</p>
                <Switch checked={tasksPush} onCheckedChange={setTasksPush} />
              </div>
            </div>

            <hr className="mt-6" />
          </DialogContent>
        </Dialog>

        {/* Delete row */}
        <div className="flex items-center gap-2 px-4 py-4 cursor-pointer border-b border-[#E8E7E7]">
          <Trash2 size={20} color="#FD0D1B" />
          <span className="text-sm font-medium">{t("Delete Account")}</span>
        </div>
      </div>
    </div>
  );
};

export default Page;
