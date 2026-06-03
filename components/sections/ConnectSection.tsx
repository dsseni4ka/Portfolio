const links = [
  { href: "mailto:hello@example.com", label: "Email" },
  { href: "https://github.com", label: "GitHub" },
  { href: "https://linkedin.com", label: "LinkedIn" },
] as const;

type ConnectSectionProps = {
  id?: string;
};

export default function ConnectSection({ id = "connect" }: ConnectSectionProps) {
  return (
    <section id={id} className="section-pad border-t border-[#0E0E0F]/8 pb-24">
      <p className="font-mono mb-4 text-xs tracking-[0.2em] uppercase">
        {"{let's connect}"}
      </p>
      <h2 className="font-sans mb-8 text-3xl font-bold tracking-tight sm:text-4xl">
        Say hello
      </h2>
      <ul className="flex flex-col gap-4 sm:flex-row sm:gap-8">
        {links.map(({ href, label }) => (
          <li key={label}>
            <a
              href={href}
              className="font-mono text-sm underline-offset-4 transition-opacity hover:opacity-60 hover:underline sm:text-base"
              {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
