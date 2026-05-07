import { redirect } from "next/navigation";
import { createAdminClient, createClient } from "@/lib/supabase/server";

export type AdminUser = {
  id: string;
  email: string;
};

type AdminRow = {
  id: string;
  email: string;
  user_id: string | null;
};

export function hasAdminSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  if (!hasAdminSupabaseConfig()) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return null;
  }

  const adminUser = await getAdminRowByEmail(user.email);

  if (!adminUser) {
    return null;
  }

  await linkAdminUserId(adminUser, user.id);

  return {
    id: user.id,
    email: user.email,
  };
}

export async function requireAdmin() {
  if (!hasAdminSupabaseConfig()) {
    redirect("/admin/login?setup=1");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/admin/login");
  }

  const adminUser = await getAdminRowByEmail(user.email);

  if (!adminUser) {
    redirect("/admin/unauthorized");
  }

  await linkAdminUserId(adminUser, user.id);

  return {
    id: user.id,
    email: user.email,
  };
}

export async function getAdminRowByEmail(email: string): Promise<AdminRow | null> {
  const adminSupabase = createAdminClient();
  const { data } = await adminSupabase
    .from("admin_users")
    .select("id, email, user_id")
    .ilike("email", email)
    .maybeSingle();

  return (data as AdminRow | null) || null;
}

export async function linkAdminUserId(adminUser: AdminRow, userId: string) {
  if (adminUser.user_id === userId) {
    return;
  }

  if (adminUser.user_id) {
    return;
  }

  const adminSupabase = createAdminClient();
  await adminSupabase
    .from("admin_users")
    .update({ user_id: userId })
    .eq("id", adminUser.id);
}
