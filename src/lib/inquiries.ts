import {
  printRequestEmail,
  publishingInquiryEmail,
  sermonBookInquiryEmail,
} from "@/lib/emails";
import { sendAdminEmail } from "@/lib/resend";
import { createAdminClient } from "@/lib/supabase/server";
import type { InquiryType } from "@/types";

type InquiryPayload = Record<string, unknown>;

export async function handleInquiry({
  type,
  payload,
}: {
  type: InquiryType;
  payload: InquiryPayload;
}) {
  if (isSpam(payload)) {
    return {
      type,
      receivedAt: new Date().toISOString(),
      spam: true,
    };
  }

  validateInquiry(type, payload);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("We could not receive your inquiry right now. Please try again shortly.");
  }

  const supabase = createAdminClient();

  if (type === "publishing") {
    const { error } = await supabase.from("publishing_inquiries").insert({
      full_name: text(payload.name),
      email: text(payload.email),
      phone: text(payload.whatsapp || payload.phone) || null,
      book_title: text(payload.projectTitle || payload.bookTitle) || null,
      project_stage: text(payload.projectStage) || null,
      message: text(payload.message),
      status: "new",
    });

    if (error) {
      throw new Error("Unable to save publishing inquiry.");
    }
  }

  if (type === "sermon-book") {
    const { error } = await supabase.from("sermon_book_projects").insert({
      full_name: text(payload.name),
      ministry_name: text(payload.ministryName) || null,
      email: text(payload.email),
      phone: text(payload.whatsapp || payload.phone) || null,
      sermon_format: text(payload.sourceMaterial || payload.sermonFormat) || null,
      number_of_sermons: text(payload.numberOfSermons) || null,
      project_goal: text(payload.projectGoal) || null,
      message: text(payload.message),
      status: "new",
    });

    if (error) {
      throw new Error("Unable to save sermon-to-book inquiry.");
    }
  }

  if (type === "print-request") {
    const { error } = await supabase.from("print_requests").insert({
      full_name: text(payload.name),
      email: text(payload.email),
      phone: text(payload.whatsapp || payload.phone) || null,
      book_title: text(payload.bookTitle) || null,
      quantity: payload.quantity ? Number(payload.quantity) : null,
      book_size: text(payload.trimSize || payload.bookSize) || null,
      color_preference: text(payload.colorPreference) || null,
      message: text(payload.message),
      status: "new",
    });

    if (error) {
      throw new Error("Unable to save print request.");
    }
  }

  const email =
    type === "publishing"
      ? publishingInquiryEmail({
          name: text(payload.name),
          email: text(payload.email),
          phone: optionalText(payload.whatsapp || payload.phone),
          bookTitle: optionalText(payload.projectTitle || payload.bookTitle),
          projectStage: optionalText(payload.projectStage),
          message: optionalText(payload.message),
        })
      : type === "sermon-book"
        ? sermonBookInquiryEmail({
            name: text(payload.name),
            ministryName: optionalText(payload.ministryName),
            email: text(payload.email),
            phone: optionalText(payload.whatsapp || payload.phone),
            sermonFormat: optionalText(payload.sourceMaterial || payload.sermonFormat),
            numberOfSermons: optionalText(payload.numberOfSermons),
            projectGoal: optionalText(payload.projectGoal),
            message: optionalText(payload.message),
          })
        : printRequestEmail({
            name: text(payload.name),
            email: text(payload.email),
            phone: optionalText(payload.whatsapp || payload.phone),
            bookTitle: optionalText(payload.bookTitle),
            quantity: optionalText(payload.quantity),
            bookSize: optionalText(payload.trimSize || payload.bookSize),
            message: optionalText(payload.message),
          });

  await sendAdminEmail(email);

  return {
    type,
    receivedAt: new Date().toISOString(),
  };
}

function validateInquiry(type: InquiryType, payload: InquiryPayload) {
  const requiredFields = ["name", "email", "message"];

  for (const field of requiredFields) {
    if (!text(payload[field])) {
      throw new Error("Name, email, and message are required.");
    }
  }

  if (!isValidEmail(text(payload.email))) {
    throw new Error("Please enter a valid email address.");
  }

  if (type === "publishing" && !text(payload.projectTitle || payload.bookTitle)) {
    throw new Error("Book title or idea is required.");
  }

  if (type === "sermon-book" && !text(payload.sourceMaterial || payload.sermonFormat)) {
    throw new Error("Sermon material format is required.");
  }

  if (type === "print-request" && !text(payload.bookTitle)) {
    throw new Error("Book title is required for print requests.");
  }
}

function isSpam(payload: InquiryPayload) {
  return Boolean(text(payload.website) || text(payload.companyWebsite));
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function text(input: unknown) {
  return typeof input === "string" ? input.trim() : "";
}

function optionalText(input: unknown) {
  return text(input) || undefined;
}
