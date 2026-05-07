import nodemailer from "nodemailer";
import { supabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";

type LeadPayload = {
  type: "Lái thử" | "Nhận thông tin" | string;
  fullName: string;
  phone: string;
  address?: string;
  carModel?: string;
  hasLicense?: string;
  notes?: string;
  email?: string;
};

function requiredString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  return v ? v : null;
}

async function getRecipientEmail(): Promise<string | null> {
  const { data, error } = await supabaseServer
    .from("settings")
    .select("value")
    .eq("key", "email")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch settings.email:", error);
    return process.env.LEAD_NOTIFY_TO_EMAIL?.trim() || null;
  }

  const v = data?.value?.trim();
  return v || process.env.LEAD_NOTIFY_TO_EMAIL?.trim() || null;
}

function createTransport() {
  const host = process.env.SMTP_HOST?.trim();
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (!host || !port || !user || !pass) {
    throw new Error("Missing SMTP env (SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS)");
  }

  const secure =
    typeof process.env.SMTP_SECURE === "string"
      ? process.env.SMTP_SECURE === "true"
      : port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

function buildEmailText(payload: LeadPayload) {
  const lines = [
    `Loại: ${payload.type}`,
    `Họ tên: ${payload.fullName}`,
    `SĐT: ${payload.phone}`,
    payload.email ? `Email: ${payload.email}` : null,
    payload.address ? `Địa chỉ: ${payload.address}` : null,
    payload.carModel ? `Dòng xe: ${payload.carModel}` : null,
    payload.hasLicense ? `Bằng lái: ${payload.hasLicense}` : null,
    payload.notes ? `Ghi chú/Nội dung: ${payload.notes}` : null,
    `Thời gian: ${new Date().toLocaleString("vi-VN")}`,
  ].filter(Boolean) as string[];

  return lines.join("\n");
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const fullName = requiredString((body as any)?.fullName);
  const phone = requiredString((body as any)?.phone);
  const type = requiredString((body as any)?.type) ?? "Nhận thông tin";

  if (!fullName || !phone) {
    return Response.json(
      { error: "Missing required fields: fullName, phone" },
      { status: 400 }
    );
  }

  const payload: LeadPayload = {
    type,
    fullName,
    phone,
    address: requiredString((body as any)?.address) ?? undefined,
    carModel: requiredString((body as any)?.carModel) ?? undefined,
    hasLicense: requiredString((body as any)?.hasLicense) ?? undefined,
    notes: requiredString((body as any)?.notes) ?? undefined,
    email: requiredString((body as any)?.email) ?? undefined,
  };

  const { error: insertError } = await supabaseServer
    .from("lead_registrations")
    .insert([
      {
        full_name: payload.fullName,
        phone: payload.phone,
        address: payload.address,
        car_model: payload.carModel,
        type: payload.type,
        has_license: payload.hasLicense,
        notes: payload.notes,
        email: payload.email,
        status: "Mới",
      },
    ]);

  if (insertError) {
    console.error("Failed to insert lead_registrations:", insertError);
    return Response.json(
      { error: "Failed to save registration" },
      { status: 500 }
    );
  }

  const to = await getRecipientEmail();
  if (!to) {
    return Response.json(
      {
        ok: true,
        warning:
          "Saved to DB but no recipient email found (settings.email or LEAD_NOTIFY_TO_EMAIL).",
      },
      { status: 200 }
    );
  }

  const from = process.env.SMTP_FROM?.trim() || process.env.SMTP_USER?.trim();
  if (!from) {
    return Response.json(
      { error: "Missing SMTP_FROM (or SMTP_USER)" },
      { status: 500 }
    );
  }

  try {
    const transporter = createTransport();
    await transporter.sendMail({
      from,
      to,
      replyTo: payload.email || undefined,
      subject: `[Website] ${payload.type} - ${payload.fullName} (${payload.phone})`,
      text: buildEmailText(payload),
    });
  } catch (e) {
    console.error("Failed to send email:", e);
    return Response.json(
      { ok: true, warning: "Saved to DB but failed to send email." },
      { status: 200 }
    );
  }

  return Response.json({ ok: true }, { status: 200 });
}

