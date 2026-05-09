import { site } from "@/lib/site";

type LogoProps = {
  tone?: "light" | "dark";
  showText?: boolean;
  className?: string;
  shortText?: string;
};

export function Logo({
  tone = "light",
  showText = true,
  className = "",
  shortText,
}: LogoProps) {
  const isDark = tone === "dark";

  return (
    <span className={`inline-flex min-w-0 max-w-full items-center gap-3 ${className}`}>
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
        <span className="min-w-0 max-w-full">
          <span
            className={
              isDark
                ? shortText
                  ? "hidden truncate text-base font-black tracking-tight text-white sm:block"
                  : "block truncate text-base font-black tracking-tight text-white"
                : shortText
                  ? "hidden truncate text-base font-black tracking-tight text-neutral-950 sm:block"
                  : "block truncate text-base font-black tracking-tight text-neutral-950"
            }
          >
            {site.name}
          </span>
          {shortText ? (
            <span
              className={
                isDark
                  ? "block truncate text-base font-black tracking-tight text-white sm:hidden"
                  : "block truncate text-base font-black tracking-tight text-neutral-950 sm:hidden"
              }
            >
              {shortText}
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}
