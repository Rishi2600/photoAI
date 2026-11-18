export const MIN_SELFIES = 10;
export const MAX_SELFIES = 20;
export const MAX_SELFIE_BYTES = 10 * 1024 * 1024; // 10 MB

const ascii = (bytes: Uint8Array, start: number, end: number) =>
  String.fromCharCode(...bytes.subarray(start, end));

const imageTypes = [
  {
    mime: "image/jpeg",
    ext: "jpg",
    matches: (b: Uint8Array) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    mime: "image/png",
    ext: "png",
    matches: (b: Uint8Array) => ascii(b, 1, 4) === "PNG",
  },
  {
    mime: "image/webp",
    ext: "webp",
    matches: (b: Uint8Array) =>
      ascii(b, 0, 4) === "RIFF" && ascii(b, 8, 12) === "WEBP",
  },
];

/** Finds the real image type from the file's first bytes, not from its name. */
export function detectImageType(bytes: Uint8Array) {
  return imageTypes.find((type) => type.matches(bytes)) ?? null;
}
