import { redirect } from "next/navigation";

/** Public visitor sign-in is disabled; chat and search work without an account. */
export default function AuthPage() {
  redirect("/");
}
