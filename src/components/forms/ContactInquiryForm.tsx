"use client";

import { useId, useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export function ContactInquiryForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const formId = useId();
  const messageId = `${formId}-form-message`;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const inquiryMessage = String(formData.get("message") || "").trim();

    if (!name || !email || !inquiryMessage) {
      setState("error");
      setMessage("Please enter your name, email, and message.");
      return;
    }

    try {
      const response = await fetch("/api/inquiries/contact", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();

      if (!result.ok) {
        setState("error");
        setMessage(result.error || "Unable to send inquiry.");
        return;
      }

      setState("success");
      setMessage("Inquiry sent. We will review it and respond.");
      form.reset();
    } catch {
      setState("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-describedby={message ? messageId : undefined}
      className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div aria-hidden="true" className="hidden">
        <label htmlFor={`${formId}-website`}>
          Website
          <input id={`${formId}-website`} name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${formId}-name`} label="Full name" name="name" placeholder="Your name" required />
        <Field
          id={`${formId}-email`}
          label="Email address"
          name="email"
          type="email"
          required
        />
        <Field id={`${formId}-whatsapp`} label="WhatsApp number optional" name="whatsapp" />
      </div>
      <label htmlFor={`${formId}-project-type`} className="mt-5 grid gap-2 text-sm font-semibold text-neutral-800">
        Project type
        <select
          id={`${formId}-project-type`}
          name="projectType"
          className="min-h-12 rounded-md border border-neutral-300 px-4 text-base font-normal outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-100"
          defaultValue=""
        >
          <option value="" disabled>
            Select an option
          </option>
          <option>I want to buy a book</option>
          <option>I want to publish my book</option>
          <option>I want to turn sermons into books</option>
          <option>I want physical printing support</option>
          <option>Other</option>
        </select>
      </label>
      <label htmlFor={`${formId}-message`} className="mt-5 grid gap-2 text-sm font-semibold text-neutral-800">
        Message
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={7}
          required
          placeholder="Share a short summary of what you need."
          className="rounded-md border border-neutral-300 px-4 py-3 text-base font-normal outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-100"
        />
      </label>
      <button
        type="submit"
        disabled={state === "loading"}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-red-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-950/10 transition hover:-translate-y-0.5 hover:bg-red-800 hover:shadow-xl disabled:cursor-wait disabled:bg-neutral-400 sm:w-auto"
      >
        {state === "loading" ? "Sending..." : "Send Inquiry"}
      </button>
      {message ? (
        <p
          id={messageId}
          role={state === "error" ? "alert" : "status"}
          className={
            state === "success"
              ? "mt-4 rounded-md bg-neutral-950 p-4 text-sm font-semibold text-white"
              : "mt-4 rounded-md bg-red-50 p-4 text-sm font-semibold text-red-700"
          }
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  id,
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={id} className="grid gap-2 text-sm font-semibold text-neutral-800">
      {label}
      <input
        id={id}
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="min-h-12 rounded-md border border-neutral-300 px-4 text-base font-normal outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-100"
      />
    </label>
  );
}
