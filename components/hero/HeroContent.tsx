import Image from "next/image";
import { FIGMA_LAYOUT } from "@/lib/figma-hero";

export default function HeroContent() {
  const { letterD, iana, senik, year, portfolio } = FIGMA_LAYOUT;

  return (
    <>
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
