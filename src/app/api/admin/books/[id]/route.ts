import { saveAdminBook } from "@/lib/admin-books";
import { jsonError, jsonOk } from "@/lib/utils";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const payload = (await request.json()) as Record<string, unknown>;
    const data = await saveAdminBook(payload, id);

    return jsonOk(data, "Book updated.");
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to update book.");
  }
}
