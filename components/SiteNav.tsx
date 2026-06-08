const linkClass =
  "font-mono pointer-events-auto text-sm leading-none text-[#363636] transition-opacity hover:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#363636]";

type SiteNavProps = {
  className?: string;
};

/** Fixed primary nav — visible while scrolling all sections. */
export default function SiteNav({ className = "" }: SiteNavProps) {
  return (
    <nav
      className={`pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between px-[clamp(1.5rem,3.1vw,3rem)] pt-[clamp(1.75rem,2.5vw,2.25rem)] ${className}`}
      aria-label="Primary"
    >
      <div className="pointer-events-auto flex gap-[clamp(2rem,5.5vw,5.5rem)]">
        <a href="#about" className={linkClass}>
          {"{about}"}
        </a>
        <a href="#skills" className={linkClass}>
          {"{skills}"}
        </a>
        <a href="#projects" className={linkClass}>
          {"{projects}"}
        </a>
      </div>
      <a href="#connect" className={`${linkClass} pointer-events-auto`}>
        {"{let's connect}"}
      </a>
    </nav>
  );
}
