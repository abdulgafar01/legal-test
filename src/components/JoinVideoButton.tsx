"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinVideoButton({ consultationId }: { consultationId: number }) {
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
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md ${pending ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
    >
      {pending ? 'Opening…' : 'Join Video'}
    </button>
  );
}
