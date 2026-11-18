"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MAX_SELFIES } from "@/lib/selfies";

export function SelfieUploader({ count }: { count: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const spaceLeft = MAX_SELFIES - count;

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;
    if (files.length > spaceLeft) {
      setMessage(
        `You can add ${spaceLeft} more photo${spaceLeft === 1 ? "" : "s"}.`,
      );
      return;
    }

    setBusy(true);
    let failed = "";
    // One request per photo keeps each upload small and shows progress.
    for (const [i, file] of files.entries()) {
      setMessage(`Uploading ${i + 1} of ${files.length}…`);
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/selfies", { method: "POST", body });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        failed = `${file.name}: ${data.error ?? "upload failed"}`;
        break;
      }
    }
    setBusy(false);
    setMessage(failed);
    router.refresh();
  }

  const disabled = busy || spaceLeft <= 0;
  return (
    <div className="space-y-2">
      <label
        className={`inline-block rounded-full bg-accent px-6 py-3 font-medium text-white ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:bg-accent-dark"
        }`}
      >
        {busy ? "Uploading…" : "Add photos"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          disabled={disabled}
          onChange={upload}
        />
      </label>
      {message && <p className="text-sm text-muted">{message}</p>}
    </div>
  );
}

export function RemoveSelfieButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    setBusy(true);
    await fetch(`/api/selfies/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      onClick={remove}
      disabled={busy}
      className="absolute right-2 top-2 rounded-full bg-ink/70 px-3 py-1 text-xs font-medium text-white hover:bg-ink disabled:opacity-50"
    >
      {busy ? "Removing…" : "Remove"}
    </button>
  );
}
