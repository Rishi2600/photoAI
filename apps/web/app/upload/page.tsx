import { asc, eq } from "drizzle-orm";
import Image from "next/image";
import { selfie } from "@/db/schema";
import { db } from "@/lib/db";
import { MAX_SELFIES, MIN_SELFIES } from "@/lib/selfies";
import { requireUser } from "@/lib/session";
import { RemoveSelfieButton, SelfieUploader } from "./selfie-controls";

const tips = [
  "Only you in the photo",
  "A mix of close-ups and half-body shots",
  "Different places, light and outfits",
  "No sunglasses, hats or heavy filters",
];

export default async function UploadPage() {
  const user = await requireUser();
  const photos = await db
    .select({ id: selfie.id })
    .from(selfie)
    .where(eq(selfie.userId, user.id))
    .orderBy(asc(selfie.createdAt));

  const missing = MIN_SELFIES - photos.length;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Your selfies</h1>
        <p className="text-muted">
          Upload {MIN_SELFIES}–{MAX_SELFIES} clear photos of yourself. Photos
          learns your face from them.
        </p>
      </div>

      <ul className="grid gap-2 text-sm sm:grid-cols-2">
        {tips.map((tip) => (
          <li
            key={tip}
            className="rounded-xl border border-line bg-white px-4 py-3"
          >
            {tip}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-4">
        <SelfieUploader count={photos.length} />
        <p className="text-sm font-medium">
          {photos.length} of {MAX_SELFIES} photos ·{" "}
          {missing > 0 ? (
            <span className="text-muted">add at least {missing} more</span>
          ) : (
            <span className="text-accent-dark">
              ready for training (coming soon)
            </span>
          )}
        </p>
      </div>

      {photos.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {photos.map((photo) => (
            <li
              key={photo.id}
              className="relative overflow-hidden rounded-xl border border-line bg-white"
            >
              {/* Private image served by our own API, so skip Next's image optimizer. */}
              <Image
                src={`/api/selfies/${photo.id}`}
                alt="Your selfie"
                width={300}
                height={300}
                unoptimized
                className="aspect-square w-full object-cover"
              />
              <RemoveSelfieButton id={photo.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
