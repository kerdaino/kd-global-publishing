import { markAdminOrderDelivered } from "@/lib/admin-orders";
import { jsonError, jsonOk } from "@/lib/utils";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await markAdminOrderDelivered(id);

    return jsonOk(data, "Order marked as delivered.");
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to mark order as delivered.");
  }
}
