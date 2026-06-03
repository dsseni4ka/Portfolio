const links = [
  { href: "#about", label: "{about}" },
  { href: "#skills", label: "{skills}" },
  { href: "#connect", label: "{let's connect}" },
] as const;

export default function HeroNav() {
  return (
    <nav
      className="font-mono flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.7rem] uppercase tracking-[0.12em] sm:justify-end sm:text-xs"
      aria-label="Primary"
    >
      {links.map(({ href, label }) => (
        <a
          key={href}
          href={href}
          className="transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E0E0F]"
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
