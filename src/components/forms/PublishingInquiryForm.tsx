"use client";

import { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export function PublishingInquiryForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);
      const response = await fetch("/api/inquiries/publishing", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();

      if (result.ok) {
        setState("success");
        setMessage("Publishing inquiry received. We will review it and respond.");
        form.reset();
        return;
      }

      setState("error");
      setMessage(result.error || "Something went wrong. Please try again.");
    } catch {
      setState("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <HoneypotField />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" placeholder="Your name" required />
        <Field
          label="Email address"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
        <Field label="WhatsApp number" name="whatsapp" placeholder="+234..." />
        <Field label="Book title / idea" name="projectTitle" placeholder="Working title" required />
      </div>
      <label className="mt-5 grid gap-2 text-sm font-semibold text-neutral-800">
        Project stage
        <select
          name="projectStage"
          className="min-h-12 rounded-md border border-neutral-300 px-4 text-base font-normal outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-100"
          defaultValue=""
        >
          <option value="" disabled>
            Select current stage
          </option>
          <option>Idea only</option>
          <option>Outline ready</option>
          <option>Draft manuscript</option>
          <option>Needs editing</option>
          <option>Ready to publish</option>
        </select>
      </label>
      <Textarea label="Message" name="message" placeholder="Tell us what you want to publish." />
      <SubmitButton loading={state === "loading"} label="Send Publishing Inquiry" />
      {message ? <FormMessage state={state} message={message} /> : null}
    </form>
  );
}

export function SermonBookInquiryForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);
      const response = await fetch("/api/inquiries/sermon-book", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();

      if (result.ok) {
        setState("success");
        setMessage("Sermon-to-book inquiry received. We will follow up.");
        form.reset();
        return;
      }

      setState("error");
      setMessage(result.error || "Something went wrong. Please try again.");
    } catch {
      setState("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <HoneypotField />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" placeholder="Your name" required />
        <Field label="Email address" name="email" type="email" placeholder="you@example.com" required />
        <Field label="WhatsApp number" name="whatsapp" placeholder="+234..." />
        <Field label="Ministry name" name="ministryName" placeholder="Church or ministry" />
        <Field label="Number of sermons" name="numberOfSermons" placeholder="e.g. 5 sermons" />
      </div>
      <label className="mt-5 grid gap-2 text-sm font-semibold text-neutral-800">
        Source material
        <select
          name="sourceMaterial"
          required
          className="min-h-12 rounded-md border border-neutral-300 px-4 text-base font-normal outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-100"
          defaultValue=""
        >
          <option value="" disabled>
            Select material type
          </option>
          <option>Audio sermons</option>
          <option>Video sermons</option>
          <option>Transcripts</option>
          <option>Teaching notes</option>
          <option>Mixed archive</option>
        </select>
      </label>
      <label className="mt-5 grid gap-2 text-sm font-semibold text-neutral-800">
        Project goal
        <select
          name="projectGoal"
          className="min-h-12 rounded-md border border-neutral-300 px-4 text-base font-normal outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-100"
          defaultValue=""
        >
          <option value="" disabled>
            Select project goal
          </option>
          <option>Devotional</option>
          <option>Study guide</option>
          <option>Teaching manual</option>
          <option>Conference booklet</option>
          <option>Full book</option>
          <option>Discipleship resource</option>
        </select>
      </label>
      <Textarea label="Project message" name="message" placeholder="Describe the sermon series or teaching archive." />
      <SubmitButton loading={state === "loading"} label="Send Sermon Project Inquiry" />
      {message ? <FormMessage state={state} message={message} /> : null}
    </form>
  );
}

export function PrintRequestForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);
      const response = await fetch("/api/inquiries/print-request", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();

      if (result.ok) {
        setState("success");
        setMessage("Print request received. We will review the details.");
        form.reset();
        return;
      }

      setState("error");
      setMessage(result.error || "Something went wrong. Please try again.");
    } catch {
      setState("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <HoneypotField />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" placeholder="Your name" required />
        <Field label="Email address" name="email" type="email" placeholder="you@example.com" required />
        <Field label="WhatsApp number" name="whatsapp" placeholder="+234..." />
        <Field label="Book title" name="bookTitle" placeholder="Book title" required />
        <Field label="Estimated quantity" name="quantity" type="number" placeholder="100" />
        <Field label="Preferred size" name="trimSize" placeholder="A5, 6x9, etc." />
        <Field label="Color preference" name="colorPreference" placeholder="Black and white, full color, etc." />
      </div>
      <Textarea label="Print details" name="message" placeholder="Tell us about pages, cover type, deadline, and delivery location." />
      <SubmitButton loading={state === "loading"} label="Send Print Request" />
      {message ? <FormMessage state={state} message={message} /> : null}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-neutral-800">
      {label}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="min-h-12 rounded-md border border-neutral-300 px-4 text-base font-normal outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-100"
      />
    </label>
  );
}

function HoneypotField() {
  return (
    <div aria-hidden="true" className="hidden">
      <label>
        Website
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </label>
    </div>
  );
}

function Textarea({
  label,
  name,
  placeholder,
}: {
  label: string;
  name: string;
  placeholder: string;
}) {
  return (
    <label className="mt-5 grid gap-2 text-sm font-semibold text-neutral-800">
      {label}
      <textarea
        name={name}
        rows={7}
        placeholder={placeholder}
        required
        className="rounded-md border border-neutral-300 px-4 py-3 text-base font-normal outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-100"
      />
    </label>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-red-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-950/10 transition hover:-translate-y-0.5 hover:bg-red-800 hover:shadow-xl disabled:cursor-wait disabled:bg-neutral-400 sm:w-auto"
    >
      {loading ? "Sending..." : label}
    </button>
  );
}

function FormMessage({ state, message }: { state: FormState; message: string }) {
  return (
    <p
      className={
        state === "success"
          ? "mt-4 rounded-md bg-neutral-950 p-4 text-sm font-semibold text-white"
          : "mt-4 rounded-md bg-red-50 p-4 text-sm font-semibold text-red-700"
      }
    >
      {message}
    </p>
  );
}
