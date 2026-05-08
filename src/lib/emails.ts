import { downloadPolicyText } from "@/lib/download-policy";

type OrderConfirmationInput = {
  customerName: string;
  bookTitle: string;
  downloadLink: string;
};

type AdminOrderInput = {
  bookTitle: string;
  customerName: string;
  customerEmail: string;
  amount: number | string;
  paystackReference: string;
};

type PublishingInquiryInput = {
  name: string;
  email: string;
  phone?: string;
  bookTitle?: string;
  projectStage?: string;
  message?: string;
};

type SermonInquiryInput = {
  name: string;
  ministryName?: string;
  email: string;
  phone?: string;
  sermonFormat?: string;
  numberOfSermons?: string;
  projectGoal?: string;
  message?: string;
};

type PrintRequestInput = {
  name: string;
  email: string;
  phone?: string;
  bookTitle?: string;
  quantity?: string | number;
  bookSize?: string;
  message?: string;
};

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function layout(title: string, body: string) {
  return `
    <div style="font-family: Arial, sans-serif; background:#f5f5f5; padding:24px;">
      <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5e5e5;">
        <div style="background:#171717; color:#ffffff; padding:24px;">
          <p style="margin:0; color:#fca5a5; font-size:12px; letter-spacing:2px; text-transform:uppercase;">KD Global Publishing House</p>
          <h1 style="margin:12px 0 0; font-size:26px; line-height:1.25;">${escapeHtml(title)}</h1>
        </div>
        <div style="padding:24px; color:#262626; font-size:15px; line-height:1.7;">
          ${body}
        </div>
      </div>
    </div>
  `;
}

function row(label: string, value: unknown) {
  return `
    <p style="margin:0 0 10px;">
      <strong>${escapeHtml(label)}:</strong> ${escapeHtml(value || "Not provided")}
    </p>
  `;
}

export function orderConfirmationEmail(input: OrderConfirmationInput) {
  return {
    subject: "Your KD Global Publishing House eBook is ready",
    html: layout(
      "Your eBook is ready",
      `
        <p>Hello ${escapeHtml(input.customerName)},</p>
        <p>Your payment for <strong>${escapeHtml(input.bookTitle)}</strong> has been confirmed.</p>
        <p>You can download your eBook using the secure link below:</p>
        <p><a href="${escapeHtml(input.downloadLink)}" style="display:inline-block; background:#b91c1c; color:#ffffff; padding:12px 18px; text-decoration:none; font-weight:bold;">Download eBook</a></p>
        <p>${escapeHtml(downloadPolicyText())}</p>
      `,
    ),
  };
}

export function adminOrderNotificationEmail(input: AdminOrderInput) {
  return {
    subject: "New book order received",
    html: layout(
      "New book order received",
      `
        ${row("Book title", input.bookTitle)}
        ${row("Customer name", input.customerName)}
        ${row("Customer email", input.customerEmail)}
        ${row("Amount", `₦${input.amount}`)}
        ${row("Paystack reference", input.paystackReference)}
      `,
    ),
  };
}

export function publishingInquiryEmail(input: PublishingInquiryInput) {
  return {
    subject: "New publishing inquiry",
    html: layout(
      "New publishing inquiry",
      `
        ${row("Name", input.name)}
        ${row("Email", input.email)}
        ${row("Phone", input.phone)}
        ${row("Book title", input.bookTitle)}
        ${row("Project stage", input.projectStage)}
        ${row("Message", input.message)}
      `,
    ),
  };
}

export function sermonBookInquiryEmail(input: SermonInquiryInput) {
  return {
    subject: "New sermon-to-book project inquiry",
    html: layout(
      "New sermon-to-book project inquiry",
      `
        ${row("Name", input.name)}
        ${row("Ministry name", input.ministryName)}
        ${row("Email", input.email)}
        ${row("Phone", input.phone)}
        ${row("Sermon format", input.sermonFormat)}
        ${row("Number of sermons", input.numberOfSermons)}
        ${row("Project goal", input.projectGoal)}
        ${row("Message", input.message)}
      `,
    ),
  };
}

export function printRequestEmail(input: PrintRequestInput) {
  return {
    subject: "New physical print request",
    html: layout(
      "New physical print request",
      `
        ${row("Name", input.name)}
        ${row("Email", input.email)}
        ${row("Phone", input.phone)}
        ${row("Book title", input.bookTitle)}
        ${row("Quantity", input.quantity)}
        ${row("Book size", input.bookSize)}
        ${row("Message", input.message)}
      `,
    ),
  };
}
