"use client";

import { useId, useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export function PublishingInquiryForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const formId = useId();
  const messageId = `${formId}-form-message`;

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
      aria-describedby={message ? messageId : undefined}
      className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <HoneypotField id={`${formId}-website`} />
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
        <Field id={`${formId}-project-title`} label="Book title / idea" name="projectTitle" placeholder="Working title" required />
      </div>
      <label htmlFor={`${formId}-project-stage`} className="mt-5 grid gap-2 text-sm font-semibold text-neutral-800">
        Project stage
        <select
          id={`${formId}-project-stage`}
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
      <Textarea id={`${formId}-message`} label="Message" name="message" placeholder="Tell us what you want to publish." />
      <SubmitButton loading={state === "loading"} label="Send Publishing Inquiry" />
      {message ? <FormMessage id={messageId} state={state} message={message} /> : null}
    </form>
  );
}

export function SermonBookInquiryForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const formId = useId();
  const messageId = `${formId}-form-message`;

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
      aria-describedby={message ? messageId : undefined}
      className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <HoneypotField id={`${formId}-website`} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${formId}-name`} label="Full name" name="name" placeholder="Your name" required />
        <Field id={`${formId}-email`} label="Email address" name="email" type="email" required />
        <Field id={`${formId}-whatsapp`} label="WhatsApp number optional" name="whatsapp" />
        <Field id={`${formId}-ministry-name`} label="Ministry name" name="ministryName" placeholder="Church or ministry" />
        <Field id={`${formId}-number-of-sermons`} label="Number of sermons" name="numberOfSermons" placeholder="e.g. 5 sermons" />
      </div>
      <label htmlFor={`${formId}-source-material`} className="mt-5 grid gap-2 text-sm font-semibold text-neutral-800">
        Source material
        <select
          id={`${formId}-source-material`}
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
      <label htmlFor={`${formId}-project-goal`} className="mt-5 grid gap-2 text-sm font-semibold text-neutral-800">
        Project goal
        <select
          id={`${formId}-project-goal`}
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
      <Textarea id={`${formId}-message`} label="Project message" name="message" placeholder="Describe the sermon series or teaching archive." />
      <SubmitButton loading={state === "loading"} label="Send Sermon Project Inquiry" />
      {message ? <FormMessage id={messageId} state={state} message={message} /> : null}
    </form>
  );
}

export function PrintRequestForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const formId = useId();
  const messageId = `${formId}-form-message`;

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
      aria-describedby={message ? messageId : undefined}
      className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <HoneypotField id={`${formId}-website`} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${formId}-name`} label="Full name" name="name" placeholder="Your name" required />
        <Field id={`${formId}-email`} label="Email address" name="email" type="email" required />
        <Field id={`${formId}-whatsapp`} label="WhatsApp number optional" name="whatsapp" />
        <Field id={`${formId}-book-title`} label="Book title" name="bookTitle" placeholder="Book title" required />
        <Field id={`${formId}-quantity`} label="Estimated quantity" name="quantity" type="number" placeholder="100" />
        <Field id={`${formId}-trim-size`} label="Preferred size" name="trimSize" placeholder="A5, 6x9, etc." />
        <Field id={`${formId}-color-preference`} label="Color preference" name="colorPreference" placeholder="Black and white, full color, etc." />
      </div>
      <Textarea id={`${formId}-message`} label="Print details" name="message" placeholder="Tell us about pages, cover type, deadline, and delivery location." />
      <SubmitButton loading={state === "loading"} label="Send Print Request" />
      {message ? <FormMessage id={messageId} state={state} message={message} /> : null}
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

function HoneypotField({ id }: { id: string }) {
  return (
    <div aria-hidden="true" className="hidden">
      <label htmlFor={id}>
        Website
        <input
          id={id}
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
  id,
  label,
  name,
  placeholder,
}: {
  id: string;
  label: string;
  name: string;
  placeholder: string;
}) {
  return (
    <label htmlFor={id} className="mt-5 grid gap-2 text-sm font-semibold text-neutral-800">
      {label}
      <textarea
        id={id}
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

function FormMessage({ id, state, message }: { id: string; state: FormState; message: string }) {
  return (
    <p
      id={id}
      role={state === "error" ? "alert" : "status"}
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
