import type { APIRoute } from "astro";
import { validateEmail, validatePhone } from "@utils/appTools.ts";

export const prerender = false;

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("content-type")?.includes("application/json") !== true) {
    return json({ error: "Expected application/json" }, 415);
  }

  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const name = payload.name?.trim() ?? "";
  const email = payload.email?.trim() ?? "";
  const phone = payload.phone?.trim() ?? "";
  const message = payload.message?.trim() ?? "";

  // Server-side validation mirrors the client checks — never trust the client.
  const errors: Record<string, string> = {};
  if (!name) errors.name = "Name is required";
  if (!validateEmail(email)) errors.email = "A valid email is required";
  if (!validatePhone(phone)) errors.phone = "A valid phone number is required";
  if (!message) errors.message = "Message is required";

  if (Object.keys(errors).length > 0) {
    return json({ error: "Validation failed", errors }, 400);
  }

  // TODO: send the notification email — e.g. install `resend`, add
  // RESEND_API_KEY / SENDER_EMAIL to the astro:env schema, and call it here.
  console.log("[contactus] new submission", { name, email, phone, message });

  return json({ success: true }, 200);
};
