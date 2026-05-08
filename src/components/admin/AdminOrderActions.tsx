"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ActionState = "idle" | "loading" | "success" | "error";

export function AdminOrderActions({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [state, setState] = useState<ActionState>("idle");
  const [message, setMessage] = useState("");

  async function runAction(endpoint: string, successMessage: string) {
    setState("loading");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/${endpoint}`, {
        method: "POST",
      });
      const result = await response.json();

      if (!result.ok) {
        setState("error");
        setMessage(result.error || "Action failed.");
        return result;
      }

      setState("success");
      setMessage(successMessage);
      router.refresh();
      return result;
    } catch {
      setState("error");
      setMessage("Action failed. Please try again.");
      return null;
    }
  }

  async function copyDownloadLink() {
    const result = await runAction("download-link", "Download link copied.");
    const link = result?.data?.downloadLink;

    if (!link) {
      return;
    }

    try {
      await navigator.clipboard.writeText(link);
    } catch {
      setState("error");
      setMessage("Download link created, but copying is not available in this browser.");
    }
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={state === "loading"}
          onClick={() => runAction("resend-download", "Download email resent.")}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-red-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-800 disabled:cursor-wait disabled:bg-neutral-300"
        >
          Resend download email
        </button>
        <button
          type="button"
          disabled={state === "loading"}
          onClick={copyDownloadLink}
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-neutral-300 px-3 py-2 text-xs font-bold text-neutral-950 transition hover:border-red-700 hover:text-red-700 disabled:cursor-wait disabled:text-neutral-400"
        >
          Copy download link
        </button>
        <button
          type="button"
          disabled={state === "loading"}
          onClick={() => runAction("mark-delivered", "Order marked as delivered.")}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-neutral-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:bg-neutral-300"
        >
          Mark delivered
        </button>
      </div>
      {message ? (
        <p
          role={state === "error" ? "alert" : "status"}
          className={
            state === "error"
              ? "rounded-md bg-red-50 p-3 text-xs font-bold text-red-700"
              : "rounded-md bg-neutral-950 p-3 text-xs font-bold text-white"
          }
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
