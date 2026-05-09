import {
  hardDeleteAdminAuthor,
  hideAdminAuthor,
  saveAdminAuthor,
} from "@/lib/admin-authors";
import { jsonError, jsonOk } from "@/lib/utils";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const payload = (await request.json()) as Record<string, unknown>;

    if (payload._action === "hide") {
      const data = await hideAdminAuthor(id);

      return jsonOk(data, "Author hidden.");
    }

    const data = await saveAdminAuthor(payload, id);

    return jsonOk(data, "Author updated.");
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to update author.");
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await hardDeleteAdminAuthor(id);

    return jsonOk(data, "Author permanently deleted.");
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to delete author.");
  }
}
