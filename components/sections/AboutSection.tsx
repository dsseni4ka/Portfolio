type AboutSectionProps = {
  id?: string;
};

export default function AboutSection({ id = "about" }: AboutSectionProps) {
  return (
    <section id={id} className="section-pad border-t border-[#0E0E0F]/8">
      <p className="font-mono mb-4 text-xs tracking-[0.2em] uppercase">{"{about}"}</p>
      <h2 className="font-sans mb-6 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
        Building thoughtful digital experiences
      </h2>
      <p className="max-w-xl text-base leading-relaxed opacity-80 sm:text-lg">
        I&apos;m Diana Senik — a developer focused on expressive interfaces, motion, and
        craft. This portfolio pairs precise typography with playful, physical-feeling
        interactions.
      </p>
    </section>
  );
}
