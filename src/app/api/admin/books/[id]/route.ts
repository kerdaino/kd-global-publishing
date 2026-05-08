import {
  archiveAdminBook,
  hardDeleteAdminBook,
  saveAdminBook,
} from "@/lib/admin-books";
import { jsonError, jsonOk } from "@/lib/utils";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const payload = (await request.json()) as Record<string, unknown>;
    if (payload._action === "archive") {
      const data = await archiveAdminBook(id);

      return jsonOk(data, "Book archived.");
    }

    const data = await saveAdminBook(payload, id);

    return jsonOk(data, "Book updated.");
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to update book.");
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await hardDeleteAdminBook(id);

    return jsonOk(data, "Book permanently deleted.");
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to delete book.");
  }
}
