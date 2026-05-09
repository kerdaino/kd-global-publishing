"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type DeleteState = "idle" | "loading" | "success" | "error";

export function AdminAuthorDeleteButton({
  authorId,
  authorName,
  hardDelete = false,
  disabled = false,
}: {
  authorId: string;
  authorName: string;
  hardDelete?: boolean;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [state, setState] = useState<DeleteState>("idle");
  const [message, setMessage] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (!isConfirming) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsConfirming(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isConfirming]);

  async function handleDelete() {
    setState("loading");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/authors/${authorId}`, {
        method: hardDelete ? "DELETE" : "PATCH",
        headers: hardDelete ? undefined : { "Content-Type": "application/json" },
        body: hardDelete ? undefined : JSON.stringify({ _action: "hide" }),
      });
      const result = await response.json();

      if (!result.ok) {
        setState("error");
        setMessage(result.error || "Unable to update author.");
        return;
      }

      setState("success");
      setIsConfirming(false);
      setMessage(
        hardDelete
          ? "Author permanently deleted."
          : "Author hidden. They no longer appear on the public authors page.",
      );

      if (hardDelete) {
        setTimeout(() => router.push("/admin/authors?status=hidden"), 700);
      } else {
        router.refresh();
      }
    } catch {
      setState("error");
      setMessage("Unable to update author. Please try again.");
    }
  }

  return (
    <div className="grid gap-3">
      <button
        type="button"
        disabled={disabled || state === "loading"}
        onClick={() => setIsConfirming(true)}
        className={
          hardDelete
            ? "inline-flex min-h-11 w-fit items-center justify-center rounded-md bg-red-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
            : "inline-flex min-h-11 w-fit items-center justify-center rounded-md border border-red-200 px-4 py-2 text-sm font-bold text-red-700 transition hover:border-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:border-neutral-200 disabled:text-neutral-400"
        }
      >
        {state === "loading"
          ? hardDelete
            ? "Deleting..."
            : "Hiding..."
          : hardDelete
            ? "Permanently Delete"
            : "Delete"}
      </button>
      {message ? (
        <p
          role={state === "error" ? "alert" : "status"}
          className={
            state === "success"
              ? "rounded-md bg-neutral-950 p-3 text-sm font-semibold text-white"
              : "rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700"
          }
        >
          {message}
        </p>
      ) : null}
      {isConfirming ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`delete-author-${authorId}-title`}
          className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/70 p-4"
        >
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
            <h2 id={`delete-author-${authorId}-title`} className="text-2xl font-black text-neutral-950">
              {hardDelete ? "Permanently delete author?" : "Hide author?"}
            </h2>
            <p className="mt-3 text-sm leading-7 text-neutral-650">
              {hardDelete
                ? `"${authorName}" will be permanently deleted. This is blocked if the author has books.`
                : `"${authorName}" will be hidden from the public authors page.`}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={state === "loading"}
                onClick={handleDelete}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-red-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-800 disabled:cursor-wait disabled:bg-neutral-300"
              >
                {state === "loading" ? "Working..." : hardDelete ? "Delete permanently" : "Hide author"}
              </button>
              <button
                type="button"
                disabled={state === "loading"}
                onClick={() => setIsConfirming(false)}
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-neutral-300 px-4 py-2 text-sm font-bold text-neutral-950 transition hover:border-red-700 hover:text-red-700 disabled:cursor-wait disabled:text-neutral-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
