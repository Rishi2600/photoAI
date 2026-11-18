import Link from "next/link";

const steps = [
  {
    title: "Upload 10–20 selfies",
    text: "Different angles, light and places.",
  },
  { title: "Photos learns your face", text: "Your own private AI model." },
  {
    title: "Get new photos of you",
    text: "Any style or place, or a whole group around one topic.",
  },
];

export default function Home() {
  return (
    <div className="space-y-16 py-10">
      <section className="max-w-2xl space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          AI photos of you, without a photoshoot.
        </h1>
        <p className="text-lg text-muted">
          Upload a few selfies once. Then make as many new photos of yourself as
          you like.
        </p>
        <Link
          href="/sign-up"
          className="inline-block rounded-full bg-accent px-6 py-3 font-medium text-white hover:bg-accent-dark"
        >
          Get started
        </Link>
      </section>

      <ol className="grid gap-4 sm:grid-cols-3">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="rounded-2xl border border-line bg-white p-6"
          >
            <span className="text-sm font-medium text-accent">
              Step {i + 1}
            </span>
            <h2 className="mt-2 font-semibold">{step.title}</h2>
            <p className="mt-1 text-sm text-muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
