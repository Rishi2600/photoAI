import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

// Files live on local disk in the repo-root data/ folder (gitignored) for now.
// Moving to Cloudflare R2 later means changing only these three functions.
const DATA_DIR = resolve(process.cwd(), "../../data");

export async function saveFile(key: string, bytes: Uint8Array) {
  const path = join(DATA_DIR, key);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, bytes);
}

export function readStoredFile(key: string) {
  return readFile(join(DATA_DIR, key));
}

export async function deleteFile(key: string) {
  await rm(join(DATA_DIR, key), { force: true });
}
