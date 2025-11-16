"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface JoinVideoButtonProps {
  consultationId: number;
}

export default function JoinVideoButton({ consultationId }: JoinVideoButtonProps) {
  const t = useTranslations("consultation");
  const href = useMemo(() => `/meeting/${consultationId}`, [consultationId]);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (pending) return;
        setPending(true);
        router.push(href);
        setTimeout(() => setPending(false), 3000);
      }}
      disabled={pending}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md ${
        pending ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
      } text-white`}
    >
      {pending ? t("opening") : t("joinVideo")}
    </button>
  );
}
