"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import {
  CONNECT_DESIGN_WIDTH,
  CONNECT_SECTION,
  connectPx,
} from "../../lib/connect-section";
import { SITE_BACKGROUND } from "@/lib/site-colors";

type ConnectSectionProps = {
  id?: string;
};

function ConnectLabel({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <span
      className="whitespace-nowrap font-mono font-normal leading-none text-foreground"
      style={{
        fontSize: connectPx(CONNECT_SECTION.contact.fontSize),
        ...style,
      }}
    >
      {`{${children}}`}
    </span>
  );
}

function ConnectValue({
  href,
  children,
  external,
  underline = false,
  style,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  underline?: boolean;
  style?: CSSProperties;
}) {
  return (
    <a
      href={href}
      className={`whitespace-nowrap font-mono font-medium leading-none text-accent transition-opacity hover:opacity-70 ${underline ? "underline decoration-from-font underline-offset-[0.12em]" : ""}`}
      style={{
        fontSize: connectPx(CONNECT_SECTION.contact.fontSize),
        ...style,
      }}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

function ConnectHeroVideo({
  src,
  alt,
  sectionRef,
}: {
  src: string;
  alt: string;
  sectionRef: RefObject<HTMLElement | null>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    video.muted = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {});
          return;
        }

        video.pause();
      },
      { threshold: 0.35 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [sectionRef]);

  return (
    <video
      ref={videoRef}
      src={src}
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      controls
      loop
      muted
      playsInline
      aria-label={alt}
    />
  );
}

function ConnectCell({
  label,
  href,
  value,
  external,
  underline,
  alignEnd = false,
}: {
  label: string;
  href: string;
  value: string;
  external?: boolean;
  underline?: boolean;
  alignEnd?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 items-baseline ${alignEnd ? "justify-self-end" : ""}`}
      style={{ gap: connectPx(8) }}
    >
      <ConnectLabel>{label}</ConnectLabel>
      <ConnectValue href={href} external={external} underline={underline}>
        {value}
      </ConnectValue>
    </div>
  );
}

export default function ConnectSection({ id = "connect" }: ConnectSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { image, title, contact, rows, linkedIn, phone } = CONNECT_SECTION;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const setScale = () => {
      const scale = Math.min(1, window.innerWidth / CONNECT_DESIGN_WIDTH);
      section.style.setProperty("--connect-scale", String(scale));
    };

    setScale();
    window.addEventListener("resize", setScale);
    return () => window.removeEventListener("resize", setScale);
  }, []);

  const contactGridStyle = {
    marginTop: connectPx(contact.marginTop),
    rowGap: "32px",
    columnGap: "32px",
  } satisfies CSSProperties;

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative flex min-h-screen w-full snap-none scroll-mt-[clamp(4rem,8vh,5.5rem)] flex-col px-[clamp(1.5rem,3.1vw,3rem)]"
      style={
        {
          backgroundColor: SITE_BACKGROUND,
          "--connect-scale": "1",
        } as CSSProperties
      }
    >
      <div
        className="mx-auto flex w-full flex-1 flex-col"
        style={{
          maxWidth: connectPx(CONNECT_DESIGN_WIDTH),
          paddingTop: connectPx(image.y),
          paddingBottom: connectPx(49),
        }}
      >
        <div
          className="mx-auto w-full"
          style={{ maxWidth: connectPx(image.width) }}
        >
          <div
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: `${image.width} / ${image.height}`,
              borderRadius: connectPx(image.radius),
            }}
          >
            <ConnectHeroVideo
              src={image.src}
              alt={image.alt}
              sectionRef={sectionRef}
            />
          </div>

          <div
            className="w-full"
            style={{ marginTop: connectPx(title.marginTop) }}
          >
            <h2
              className="whitespace-nowrap text-left font-sans font-bold uppercase text-foreground"
              style={{
                fontSize: `clamp(1.75rem, 7.1vw, ${connectPx(title.fontSize)})`,
                lineHeight: title.lineHeight,
                letterSpacing: `${title.letterSpacing}em`,
              }}
            >
              {title.text}
            </h2>

            <div
              className="grid w-full grid-cols-2 items-baseline"
              style={contactGridStyle}
            >
              <ConnectCell
                label={rows[0].label}
                href={rows[0].href}
                value={rows[0].value}
                underline
              />
              <ConnectCell
                label={linkedIn.label}
                href={linkedIn.href}
                value={linkedIn.value}
                external
                underline
                alignEnd
              />
              <ConnectCell
                label={rows[1].label}
                href={rows[1].href}
                value={rows[1].value}
                underline
              />
              <ConnectCell
                label={phone.label}
                href={phone.href}
                value={phone.value}
                underline
                alignEnd
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
