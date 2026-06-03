import Image from "next/image";

type HeroTitleProps = {
  layer: "back" | "front";
};

const titleGridClass =
  "mx-auto grid max-w-4xl grid-cols-[clamp(4.5rem,14vw,8.5rem)_auto] items-end justify-center gap-0";

export default function HeroTitle({ layer }: HeroTitleProps) {
  if (layer === "back") {
    return (
      <div
        className="pointer-events-none relative w-full max-w-6xl px-6 pt-[clamp(5rem,14vh,9rem)]"
        aria-hidden="true"
      >
        <div className={titleGridClass}>
          <Image
            src="/letter-d.svg"
            alt=""
            width={140}
            height={186}
            priority
            className="h-[clamp(7rem,18vw,11rem)] w-auto justify-self-end pr-1"
          />
          <span />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-6xl px-6">
      <div className="relative">
        <p
          className="font-mono absolute top-0 left-[clamp(0.5rem,6vw,3rem)] text-sm italic tracking-wide sm:text-base"
          aria-hidden="true"
        >
          2026
        </p>

        <div className={titleGridClass}>
          <span className="sr-only">D</span>
          <h1 className="font-sans text-[clamp(3.5rem,14vw,9rem)] leading-[0.9] font-bold tracking-[-0.04em]">
            IANA
          </h1>
        </div>

        <h2 className="font-sans mt-2 text-center text-[clamp(2.5rem,10vw,6.5rem)] leading-[0.95] font-bold tracking-[-0.03em]">
          SENIK
        </h2>

        <p className="font-mono mt-6 ml-auto max-w-xs pr-2 text-right text-[0.65rem] tracking-[0.2em] uppercase sm:text-xs">
          portfolio
        </p>
      </div>
    </div>
  );
}
