import { redirect } from "next/navigation";
import { AuthForm } from "@/app/components/auth-form";
import { getSession } from "@/lib/session";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getSession()) redirect("/upload");
  const { error } = await searchParams;

  // Google sends people back here with ?error=... when it can't sign them in.
  if (error === "account_not_linked")
    return <AuthForm mode="sign-in" notice={<AccountExistsNotice />} />;
  return (
    <AuthForm
      mode="sign-in"
      initialError={error ? "Google sign-in failed. Try again." : ""}
    />
  );
}

function AccountExistsNotice() {
  return (
    <div
      role="status"
      className="space-y-2 rounded-2xl border border-line border-l-4 border-l-accent bg-white p-5"
    >
      <p className="font-medium">You already have an account with this email</p>
      <p className="text-sm text-muted">
        It was created with an email and password, so Google can&apos;t open it
        yet. Sign in with your password below.
      </p>
      <details className="text-sm text-muted">
        <summary className="cursor-pointer font-medium text-ink">
          Why not with Google?
        </summary>
        <p className="mt-2">
          We only connect Google to an account once its email has been
          confirmed. Otherwise someone could sign up with your email first,
          and when you later used Google you would be sharing an account with
          them. Email confirmation is coming soon; after that you can use
          either one.
        </p>
      </details>
    </div>
  );
}
