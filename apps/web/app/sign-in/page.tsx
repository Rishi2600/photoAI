import { redirect } from "next/navigation";
import { AuthForm } from "@/app/components/auth-form";
import { getSession } from "@/lib/session";

// Errors Google sign-in can send back here as ?error=...
const googleErrors: Record<string, string> = {
  account_not_linked:
    "This email already has a password login. Sign in with your email and password.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getSession()) redirect("/upload");
  const { error } = await searchParams;
  const message = error
    ? (googleErrors[error] ?? "Google sign-in failed. Try again.")
    : "";
  return <AuthForm mode="sign-in" initialError={message} />;
}
