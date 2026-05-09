import { Logo } from "@/components/Logo";

export function AuthorAvatar({
  image,
  name,
  className = "size-16",
  logoClassName = "[&>span:first-child]:size-12",
}: {
  image?: string;
  name: string;
  className?: string;
  logoClassName?: string;
}) {
  return (
    <div className={`flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-neutral-950 text-white ${className}`}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={`${name} profile`}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="grid h-full w-full place-items-center bg-neutral-950">
          <Logo tone="dark" showText={false} className={logoClassName} />
          <span className="sr-only">Author avatar for {name}</span>
        </div>
      )}
    </div>
  );
}
