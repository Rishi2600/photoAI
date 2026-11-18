import { redirect } from "next/navigation";
import { AuthForm } from "@/app/components/auth-form";
import { getSession } from "@/lib/session";

export default async function SignUpPage() {
  if (await getSession()) redirect("/upload");
  return <AuthForm mode="sign-up" />;
}
