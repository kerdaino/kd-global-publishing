"use client";

import { useTheme } from "@/components/theme/ThemeProvider";

type ThemeMode = "light" | "dark";

const modes: Array<{
  label: string;
  value: ThemeMode;
  icon: (props: { className?: string }) => React.ReactNode;
}> = [
  { label: "Light", value: "light", icon: SunIcon },
  { label: "Dark", value: "dark", icon: MoonIcon },
];

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { preference, setPreference } = useTheme();

  return (
    <div
      className={`inline-flex rounded-md border border-neutral-200 bg-white p-1 text-neutral-700 shadow-sm dark:border-[#5a514b] dark:bg-[#2a2521] dark:text-[#eadfd6] ${className}`}
      role="group"
      aria-label="Theme preference"
    >
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = preference === mode.value;

        return (
          <button
            key={mode.value}
            type="button"
            aria-pressed={isActive}
            title={`${mode.label} theme`}
            onClick={() => setPreference(mode.value)}
            className={
              isActive
                ? "inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-red-700 px-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-800 dark:bg-[#7e3b34] dark:text-[#fff3ee] dark:hover:bg-[#91483f]"
                : "inline-flex min-h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-bold text-neutral-700 transition hover:bg-neutral-100 hover:text-red-700 dark:text-[#eadfd6] dark:hover:bg-white/10 dark:hover:text-[#ffd0c6]"
            }
          >
            <Icon className="size-4" />
            <span>{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function SunIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20.99 13.67A8.5 8.5 0 1 1 10.33 3.01 6.5 6.5 0 0 0 20.99 13.67Z" />
    </svg>
  );
}
