import Link from "next/link";
import { getSession } from "@/lib/session";
import { SignOutButton } from "./sign-out-button";

export async function Header() {
  const session = await getSession();

  return (
    <header className="border-b border-line">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Photos
        </Link>
        {session ? (
          <div className="flex items-center gap-5">
            <Link
              href="/upload"
              className="text-sm font-medium hover:text-accent"
            >
              Upload
            </Link>
            <span className="hidden text-sm text-muted sm:inline">
              {session.user.email}
            </span>
            <SignOutButton />
          </div>
        ) : (
          <Link
            href="/sign-in"
            className="text-sm font-medium hover:text-accent"
          >
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
