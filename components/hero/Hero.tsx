import HeroContent from "./HeroContent";
import HeroFigmaStage from "./HeroFigmaStage";

export default function Hero() {
  return (
    <section className="relative h-screen w-full snap-start overflow-hidden bg-background">
      <HeroFigmaStage>
        <HeroContent />
      </HeroFigmaStage>
    </section>
  );
}
