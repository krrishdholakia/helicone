import { Result } from "../../../../lib/result";
import {
  HandlerWrapperOptions,
  withAuth,
} from "../../../../lib/api/handlerWrappers";
import { Permission } from "../../../../services/lib/user";

async function handler({
  req,
  res,
  supabaseClient,
  userData,
}: HandlerWrapperOptions<Result<null, string>>) {
  if (req.method !== "DELETE") {
    res.status(405).json({ error: "Method not allowed", data: null });
  }

  const client = supabaseClient.getClient();
  const { id } = req.query;

  if (id === undefined || typeof id !== "string") {
    res.status(500).json({ error: "Invalid providerKeyId", data: null });
    return;
  }

  const { error } = await client
    .from("provider_keys")
    .delete()
    .eq("org_id", userData.orgId)
    .eq("id", id);

  if (error) {
    console.log("Failed to delete proxy key");
    res.status(500).json({ error: error.message, data: null });
    return;
  }

  res.status(200).json({ error: null, data: null });
}

export default withAuth(handler, [Permission.MANAGE_KEYS]);
