import { revalidateTag } from "next/cache";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import type { NextRequest } from "next/server";
import { EnquiryError, readLimitedBody } from "@/lib/enquiry";
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret)
    return Response.json({ error: "Not configured" }, { status: 503 });
  try {
    const signature = request.headers.get(SIGNATURE_HEADER_NAME);
    if (
      !signature ||
      !(await isValidSignature(
        await readLimitedBody(request, 8192),
        signature,
        secret,
      ))
    )
      return Response.json({ error: "Invalid signature" }, { status: 401 });
    await new Promise((resolve) => setTimeout(resolve, 3000));
    revalidateTag("content", { expire: 0 });
    return Response.json({ revalidated: true });
  } catch (error) {
    if (error instanceof EnquiryError && error.status === 413)
      return Response.json({ error: "Webhook too large" }, { status: 413 });
    return Response.json({ error: "Invalid webhook" }, { status: 400 });
  }
}
