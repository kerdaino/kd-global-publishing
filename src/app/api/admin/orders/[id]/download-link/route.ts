import { getAdminOrderDownloadLink } from "@/lib/admin-orders";
import { jsonError, jsonOk } from "@/lib/utils";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const downloadLink = await getAdminOrderDownloadLink(id);

    return jsonOk({ downloadLink });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to create download link.");
  }
}
