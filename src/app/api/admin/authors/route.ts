import { saveAdminAuthor } from "@/lib/admin-authors";
import { jsonError, jsonOk } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const data = await saveAdminAuthor(payload);

    return jsonOk(data, "Author created.");
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to create author.");
  }
}
