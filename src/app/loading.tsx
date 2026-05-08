export default function Loading() {
  return (
    <div className="bg-neutral-50 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <p role="status" className="text-sm font-bold uppercase tracking-[0.16em] text-red-700">
          Loading content...
        </p>
        <div className="mt-4 h-4 w-40 animate-pulse rounded bg-red-100" />
        <div className="mt-5 h-10 max-w-xl animate-pulse rounded bg-neutral-200" />
        <div className="mt-4 h-4 max-w-2xl animate-pulse rounded bg-neutral-200" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-48 animate-pulse rounded-lg border border-neutral-200 bg-white"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
