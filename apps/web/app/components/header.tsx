import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-line">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Photos
        </Link>
        <Link href="/sign-in" className="text-sm font-medium hover:text-accent">
          Sign in
        </Link>
      </nav>
    </header>
  );
}
