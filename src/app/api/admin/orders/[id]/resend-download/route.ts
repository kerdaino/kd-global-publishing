import { resendAdminOrderDownloadEmail } from "@/lib/admin-orders";
import { jsonError, jsonOk } from "@/lib/utils";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await resendAdminOrderDownloadEmail(id);

    return jsonOk(data, "Download email resent.");
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to resend download email.");
  }
}
