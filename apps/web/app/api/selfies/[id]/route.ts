import { and, eq } from "drizzle-orm";
import { selfie } from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteFile, readStoredFile } from "@/lib/storage";

type Context = { params: Promise<{ id: string }> };

// Only the owner can see or delete a selfie; anyone else gets 404.
async function findOwnSelfie(request: Request, id: string) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return null;
  const [row] = await db
    .select()
    .from(selfie)
    .where(and(eq(selfie.id, id), eq(selfie.userId, session.user.id)));
  return row ?? null;
}

export async function GET(request: Request, { params }: Context) {
  const row = await findOwnSelfie(request, (await params).id);
  if (!row) return new Response("Not found", { status: 404 });

  const bytes = await readStoredFile(row.fileKey);
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": row.mimeType,
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function DELETE(request: Request, { params }: Context) {
  const row = await findOwnSelfie(request, (await params).id);
  if (!row) return new Response("Not found", { status: 404 });

  await db.delete(selfie).where(eq(selfie.id, row.id));
  await deleteFile(row.fileKey);
  return new Response(null, { status: 204 });
}
