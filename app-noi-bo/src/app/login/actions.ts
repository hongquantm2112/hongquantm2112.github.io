"use server";

import { signIn as authSignIn, signOut as authSignOut } from "@/auth";

export async function signInWithGoogle(formData: FormData) {
  const next = String(formData.get("next") ?? "/");
  await authSignIn("google", { redirectTo: next || "/" });
}

export async function signOut() {
  await authSignOut({ redirectTo: "/login" });
}
