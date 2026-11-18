import { requireUser } from "@/lib/session";

export default async function UploadPage() {
  const user = await requireUser();
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">Hi {user.name}</h1>
      <p className="text-muted">Selfie upload comes next.</p>
    </div>
  );
}
