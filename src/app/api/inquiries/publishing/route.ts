import { handleInquiry } from "@/lib/inquiries";
import { jsonError, jsonOk } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const data = await handleInquiry({ type: "publishing", payload });

    return jsonOk(data, "Publishing inquiry received.");
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to submit inquiry.");
  }
}
