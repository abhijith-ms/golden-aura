import { handleEnquiry } from "@/lib/enquiry";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return handleEnquiry(request);
}
