import { saveAdminBook } from "@/lib/admin-books";
import { jsonError, jsonOk } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const data = await saveAdminBook(payload);

    return jsonOk(data, "Book created.");
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to create book.");
  }
}
