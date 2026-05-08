import { site } from "@/lib/site";

type LogoProps = {
  tone?: "light" | "dark";
  showText?: boolean;
  className?: string;
};

export function Logo({ tone = "light", showText = true, className = "" }: LogoProps) {
  const isDark = tone === "dark";

  return (
    <span className={`inline-flex min-w-0 items-center gap-3 ${className}`}>
      <span
        aria-hidden="true"
        className={
          isDark
            ? "flex size-11 shrink-0 items-center justify-center rounded-md bg-white text-base font-black text-red-700"
            : "flex size-11 shrink-0 items-center justify-center rounded-md bg-red-700 text-base font-black text-white"
        }
      >
        KD
      </span>
      {showText ? (
        <span className="min-w-0">
          <span
            className={
              isDark
                ? "block truncate text-base font-black tracking-tight text-white"
                : "block truncate text-base font-black tracking-tight text-neutral-950"
            }
          >
            {site.name}
          </span>
        </span>
      ) : null}
    </span>
  );
}
