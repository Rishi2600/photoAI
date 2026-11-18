# Photos

Upload 10–20 selfies, let AI learn your face, then make new photos of yourself in any style or place.

## Run it locally

Needs [Bun](https://bun.sh) 1.4+ and Node.js 20.9+.

```sh
bun install
cp .env.example .env    # then fill in the values
bun run dev             # http://localhost:3000
```

## Commands

| Command | What it does |
|---|---|
| `bun run dev` | Start the app on port 3000 |
| `bun run build` | Production build |
| `bun run lint` | Lint all packages |
| `bun run check-types` | Type-check all packages |

## Layout

- `apps/web`: the Next.js app
- `packages/ui`: shared React components
- `packages/eslint-config`, `packages/typescript-config`: shared configs
- `data/`: uploaded and generated images (local only, not in git)
