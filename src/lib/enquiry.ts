import nodemailer from "nodemailer";

export type Enquiry = {
  name: string;
  email: string;
  topic: string;
  message: string;
};
export class EnquiryError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}
const topics = [
  "Playing and tournaments",
  "Partnership",
  "Volunteering and collaboration",
  "General enquiry",
];

export function validateEnquiry(input: unknown): Enquiry {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new EnquiryError("Please complete the enquiry form.");
  const values = input as Record<string, unknown>;
  if (values.website)
    throw new EnquiryError("Your enquiry could not be processed.");
  const name = typeof values.name === "string" ? values.name.trim() : "";
  const email = typeof values.email === "string" ? values.email.trim() : "";
  const topic = typeof values.topic === "string" ? values.topic : "";
  const message =
    typeof values.message === "string" ? values.message.trim() : "";
  if (name.length < 2 || name.length > 100 || /[\r\n\x00]/.test(name))
    throw new EnquiryError("Please enter your name using 2–100 characters.");
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new EnquiryError("Please enter a valid email address.");
  if (!topics.includes(topic))
    throw new EnquiryError("Please select an enquiry topic.");
  if (message.length < 10 || message.length > 5000 || message.includes("\0"))
    throw new EnquiryError("Please enter a message using 10–5,000 characters.");
  if (values.consent !== "yes")
    throw new EnquiryError(
      "Please agree to the use of your details to respond to this enquiry.",
    );
  return { name, email, topic, message };
}

// shortcut: quotas live in one server process; use shared storage before scaling to multiple workers.
const quotas = new Map<string, { count: number; expires: number }>();
export function takeQuota(key: string, now = Date.now(), limit = 5) {
  for (const [id, entry] of quotas) if (entry.expires <= now) quotas.delete(id);
  const entry = quotas.get(key);
  if (entry && entry.count >= limit) return false;
  if (!entry && quotas.size >= 2000) return false;
  quotas.set(key, {
    count: (entry?.count || 0) + 1,
    expires: entry?.expires || now + 15 * 60 * 1000,
  });
  return true;
}

export async function readLimitedBody(request: Request, maximum = 24000) {
  const reader = request.body?.getReader();
  if (!reader) throw new EnquiryError("Please complete the enquiry form.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maximum) {
        await reader.cancel();
        throw new EnquiryError("Your message is too large.", 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function readBody(request: Request) {
  const text = await readLimitedBody(request);
  try {
    return request.headers.get("content-type")?.startsWith("application/json")
      ? JSON.parse(text)
      : Object.fromEntries(new URLSearchParams(text));
  } catch {
    throw new EnquiryError("Your enquiry could not be read.");
  }
}

export async function deliverEnquiry(enquiry: Enquiry) {
  const { SMTP_HOST, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM)
    throw new EnquiryError(
      "Your enquiry could not be sent. Please email or call the Trust directly.",
      503,
    );
  const port = Number(process.env.SMTP_PORT || 465);
  if (port !== 465 && port !== 587)
    throw new EnquiryError(
      "Your enquiry could not be sent. Please email the Trust directly.",
      503,
    );
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
  const result = await transport.sendMail({
    from: SMTP_FROM,
    to: process.env.ENQUIRY_TO || "auragolden4@gmail.com",
    replyTo: enquiry.email,
    subject: `Golden Aura enquiry: ${enquiry.topic}`,
    text: `Name: ${enquiry.name}\nEmail: ${enquiry.email}\nTopic: ${enquiry.topic}\n\n${enquiry.message}`,
  });
  if (!result.accepted?.length || result.rejected?.length)
    throw new EnquiryError(
      "Your enquiry could not be delivered. Please email or call the Trust directly.",
      502,
    );
}

export async function handleEnquiry(
  request: Request,
  deliver: (enquiry: Enquiry) => Promise<void> = deliverEnquiry,
) {
  const response = (body: object, status: number) =>
    Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
  try {
    const origin = request.headers.get("origin");
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const expectedOrigin = new URL(
      process.env.SITE_URL || (host ? `${request.url.startsWith("https") ? "https" : "http"}://${host}` : request.url),
    ).origin;
    if (origin !== expectedOrigin)
      throw new EnquiryError(
        "Your enquiry could not be processed from this page.",
        403,
      );
    const type = request.headers.get("content-type") || "";
    if (
      !type.startsWith("application/json") &&
      !type.startsWith("application/x-www-form-urlencoded")
    )
      throw new EnquiryError("Unsupported enquiry format.", 415);
    const enquiry = validateEnquiry(await readBody(request));
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    if (
      !takeQuota(`email:${enquiry.email.toLowerCase()}`) ||
      !takeQuota(`ip:${ip}`, Date.now(), 15) ||
      !takeQuota("all-enquiries", Date.now(), 100)
    )
      throw new EnquiryError(
        "Please wait a little before sending another enquiry.",
        429,
      );
    await deliver(enquiry);
    return response({ ok: true }, 200);
  } catch (error) {
    if (error instanceof EnquiryError)
      return response({ error: error.message }, error.status);
    console.error("Enquiry delivery failed; no message contents were logged.");
    return response(
      {
        error:
          "Your enquiry could not be sent. Please try again or contact the Trust directly.",
      },
      502,
    );
  }
}
