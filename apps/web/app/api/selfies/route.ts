import { count, eq } from "drizzle-orm";
import { selfie } from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { detectImageType, MAX_SELFIE_BYTES, MAX_SELFIES } from "@/lib/selfies";
import { deleteFile, saveFile } from "@/lib/storage";

const fail = (error: string, status: number) =>
  Response.json({ error }, { status });

// Upload one selfie (multipart form field "file").
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return fail("Sign in first", 401);
  const userId = session.user.id;

  // Turn away oversized uploads before reading them into memory.
  if (
    Number(request.headers.get("content-length")) >
    MAX_SELFIE_BYTES + 64 * 1024
  ) {
    return fail("Each photo must be under 10 MB", 413);
  }

  const file = (await request.formData()).get("file");
  if (!(file instanceof File)) return fail("No photo was sent", 400);
  if (file.size > MAX_SELFIE_BYTES)
    return fail("Each photo must be under 10 MB", 413);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = detectImageType(bytes);
  if (!type) return fail("Only JPG, PNG or WebP photos", 415);

  const [row] = await db
    .select({ total: count() })
    .from(selfie)
    .where(eq(selfie.userId, userId));
  if ((row?.total ?? 0) >= MAX_SELFIES)
    return fail(`You can upload up to ${MAX_SELFIES} photos`, 400);

  const id = crypto.randomUUID();
  const fileKey = `selfies/${userId}/${id}.${type.ext}`;
  await saveFile(fileKey, bytes);
  try {
    await db
      .insert(selfie)
      .values({ id, userId, fileKey, mimeType: type.mime });
  } catch (error) {
    await deleteFile(fileKey); // don't leave an orphan file behind
    throw error;
  }

  return Response.json({ id }, { status: 201 });
}
