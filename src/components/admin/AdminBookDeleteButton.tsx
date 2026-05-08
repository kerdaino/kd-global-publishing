"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteState = "idle" | "loading" | "success" | "error";

export function AdminBookDeleteButton({
  bookId,
  bookTitle,
  hardDelete = false,
  disabled = false,
}: {
  bookId: string;
  bookTitle: string;
  hardDelete?: boolean;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [state, setState] = useState<DeleteState>("idle");
  const [message, setMessage] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      hardDelete
        ? `Permanently delete "${bookTitle}"? This cannot be undone.`
        : `Archive "${bookTitle}"? It will be hidden from the public bookstore.`,
    );

    if (!confirmed) {
      return;
    }

    setState("loading");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/books/${bookId}`, {
        method: hardDelete ? "DELETE" : "PATCH",
        headers: hardDelete ? undefined : { "Content-Type": "application/json" },
        body: hardDelete ? undefined : JSON.stringify({ _action: "archive" }),
      });
      const result = await response.json();

      if (!result.ok) {
        setState("error");
        setMessage(result.error || "Unable to delete book.");
        return;
      }

      setState("success");
      setMessage(
        hardDelete
          ? "Book permanently deleted."
          : "Book archived. It no longer appears in the public bookstore.",
      );

      if (hardDelete) {
        setTimeout(() => router.push("/admin/books?status=archived"), 700);
      } else {
        router.refresh();
      }
    } catch {
      setState("error");
      setMessage("Unable to delete book. Please try again.");
    }
  }

  return (
    <div className="grid gap-3">
      <button
        type="button"
        disabled={disabled || state === "loading"}
        onClick={handleDelete}
        className={
          hardDelete
            ? "inline-flex min-h-11 w-fit items-center justify-center rounded-md bg-red-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
            : "inline-flex min-h-11 w-fit items-center justify-center rounded-md border border-red-200 px-4 py-2 text-sm font-bold text-red-700 transition hover:border-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:border-neutral-200 disabled:text-neutral-400"
        }
      >
        {state === "loading"
          ? hardDelete
            ? "Deleting..."
            : "Archiving..."
          : hardDelete
            ? "Permanently Delete"
            : "Delete"}
      </button>
      {message ? (
        <p
          className={
            state === "success"
              ? "rounded-md bg-neutral-950 p-3 text-sm font-semibold text-white"
              : "rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700"
          }
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
