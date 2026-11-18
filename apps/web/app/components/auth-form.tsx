"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@repo/ui/button";
import { authClient } from "@/lib/auth-client";

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 focus:border-ink focus:outline-none";

export function AuthForm({
  mode,
  initialError = "",
}: {
  mode: "sign-in" | "sign-up";
  initialError?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState(initialError);
  const [busy, setBusy] = useState(false);
  const isSignUp = mode === "sign-up";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    setBusy(true);
    setError("");
    const { error } = isSignUp
      ? await authClient.signUp.email({
          name: String(form.get("name")),
          email,
          password,
        })
      : await authClient.signIn.email({ email, password });
    setBusy(false);

    if (error)
      return setError(error.message ?? "Something went wrong. Try again.");
    router.push("/upload");
    router.refresh();
  }

  async function signInWithGoogle() {
    setBusy(true);
    setError("");
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/upload",
      errorCallbackURL: "/sign-in",
    });
    if (error) {
      setBusy(false);
      setError(error.message ?? "Google sign-in failed. Try again.");
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        {isSignUp ? "Create your account" : "Sign in"}
      </h1>

      <Button
        variant="secondary"
        className="w-full"
        onClick={signInWithGoogle}
        disabled={busy}
      >
        Continue with Google
      </Button>

      <p className="text-center text-sm text-muted">or with email</p>

      <form onSubmit={onSubmit} className="space-y-3">
        {isSignUp && (
          <input
            name="name"
            placeholder="Your name"
            required
            className={inputClass}
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          autoComplete="email"
          className={inputClass}
        />
        <input
          name="password"
          type="password"
          placeholder="Password (8+ characters)"
          required
          minLength={8}
          autoComplete={isSignUp ? "new-password" : "current-password"}
          className={inputClass}
        />
        {error && <p className="text-sm text-accent-dark">{error}</p>}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Please wait…" : isSignUp ? "Create account" : "Sign in"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted">
        {isSignUp ? "Already have an account? " : "New here? "}
        <Link
          href={isSignUp ? "/sign-in" : "/sign-up"}
          className="font-medium text-ink underline"
        >
          {isSignUp ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </div>
  );
}
