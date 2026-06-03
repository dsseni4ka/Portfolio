import Image from "next/image";
import { FIGMA_LAYOUT } from "@/lib/figma-hero";

const linkClass =
  "font-mono pointer-events-auto absolute leading-none text-black transition-opacity hover:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black";

export default function HeroContent() {
  const { nav, letterD, iana, senik, year, portfolio } = FIGMA_LAYOUT;

  return (
    <>
      <nav
        className="absolute inset-0 z-20"
        aria-label="Primary"
        suppressHydrationWarning
      >
        <a
          href="#about"
          className={linkClass}
          style={{ left: nav.about.left, top: nav.about.top, fontSize: nav.about.size }}
          suppressHydrationWarning
        >
          {"{about}"}
        </a>
        <a
          href="#skills"
          className={linkClass}
          style={{ left: nav.skills.left, top: nav.skills.top, fontSize: nav.skills.size }}
          suppressHydrationWarning
        >
          {"{skills}"}
        </a>
        <a
          href="#connect"
          className={linkClass}
          style={{
            left: nav.connect.left,
            top: nav.connect.top,
            fontSize: nav.connect.size,
          }}
          suppressHydrationWarning
        >
          {"{let's connect}"}
        </a>
      </nav>

      <div
        className="pointer-events-none absolute z-[5]"
        style={{
          left: letterD.left,
          top: letterD.top,
          width: letterD.width,
          height: letterD.height,
        }}
        aria-hidden
      >
        <Image
          src="/letter-d.svg"
          alt=""
          width={letterD.width}
          height={letterD.height}
          priority
          className="block h-full w-full"
        />
      </div>

      <p
        className="pointer-events-none absolute z-20 font-sans font-bold leading-none whitespace-pre text-black"
        style={{
          left: iana.left,
          top: iana.top,
          fontSize: iana.size,
          fontVariationSettings: '"opsz" 14',
        }}
      >
        {"    IANA"}
      </p>

      <p
        className="pointer-events-none absolute z-20 font-sans font-bold leading-none whitespace-nowrap text-black"
        style={{
          left: senik.left,
          top: senik.top,
          fontSize: senik.size,
          fontVariationSettings: '"opsz" 14',
        }}
      >
        SENIK
      </p>

      <p
        className="font-year pointer-events-none absolute z-20 leading-none whitespace-nowrap text-black"
        style={{ left: year.left, top: year.top, fontSize: year.size }}
      >
        2026
      </p>

      <p
        className="pointer-events-none absolute z-20 font-mono leading-none whitespace-nowrap text-black"
        style={{
          left: portfolio.left,
          top: portfolio.top,
          fontSize: portfolio.size,
          margin: portfolio.margin,
        }}
      >
        portfolio
      </p>
    </>
  );
}
