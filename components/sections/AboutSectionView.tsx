"use client";

import { useRef } from "react";
import { SITE_BACKGROUND } from "@/lib/site-colors";
import {
  AboutPopSettingsProvider,
  useAboutPopSettings,
} from "@/lib/about-pop-settings-store";
import { useAboutBubbleScroll } from "@/lib/use-about-bubble-scroll";
import AboutBubblePop from "./AboutBubblePop";
import AboutDianaHover from "./AboutDianaHover";
import AboutScrollBubble from "./AboutScrollBubble";

type AboutSectionViewProps = {
  id?: string;
};

function AboutTag({ children }: { children: React.ReactNode }) {
  return <span className="text-accent">{`{${children}}`}</span>;
}

function AboutSectionContent({ id = "about" }: AboutSectionViewProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { settings: popSettings } = useAboutPopSettings();
  const { bubbleProgress, bubbleHasPopped, aboutSectionCompact, isPinned, isPopping, completeBubblePop } =
    useAboutBubbleScroll(sectionRef, { popEnabled: popSettings.popEnabled });

  const showBubble =
    !bubbleHasPopped && (isPinned || bubbleProgress > 0.002);
  const aboutScrollLocked =
    !bubbleHasPopped && (isPinned || isPopping || bubbleProgress > 0.002);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative w-full snap-none scroll-mt-[clamp(4rem,8vh,5.5rem)] ${
        aboutSectionCompact ? "min-h-screen" : "min-h-[200vh]"
      }`}
      style={{ backgroundColor: SITE_BACKGROUND }}
    >
      <div
        data-about-stage
        className={`sticky top-0 z-20 flex h-screen w-full flex-col overflow-hidden text-foreground ${
          aboutScrollLocked ? "overscroll-none" : ""
        }`}
        style={{ backgroundColor: SITE_BACKGROUND }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{ backgroundColor: SITE_BACKGROUND }}
        />
        {showBubble ? (
          <div
            className={`absolute inset-0 z-[1] transition-opacity duration-200 ${
              isPopping ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            <AboutScrollBubble scrollProgress={bubbleProgress} />
          </div>
        ) : null}
        <AboutBubblePop active={isPopping} onComplete={completeBubblePop} />
        <div className="relative z-10 flex h-full w-full items-center justify-center px-[clamp(1.5rem,5vw,3rem)]">
          <p
            data-about-text
            className="mx-auto w-full max-w-[min(100%,54rem)] text-justify font-sans text-[clamp(1.125rem,2.1vw,1.75rem)] font-semibold leading-[1.2] tracking-[-0.01em] [hyphens:auto] [text-align-last:left]"
          >
            I&apos;m <AboutDianaHover>Diana</AboutDianaHover> 19 y/o Web Graphic Motion
            Creative{" "}
            <AboutTag>designer</AboutTag> based in Eindhoven(originally from Ukraine). I
            like <AboutTag>coffe, dance</AboutTag> and <AboutTag>my dog</AboutTag>. I  consider myself a creator, taking stuff from my imagination into reality.
            It&apos;s as if I can shape my own reality.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function AboutSectionView(props: AboutSectionViewProps) {
  return (
    <AboutPopSettingsProvider>
      <AboutSectionContent {...props} />
    </AboutPopSettingsProvider>
  );
}
