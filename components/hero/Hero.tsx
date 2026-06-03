import HeroContent from "./HeroContent";
import HeroFigmaStage from "./HeroFigmaStage";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-background">
      <HeroFigmaStage>
        <HeroContent />
      </HeroFigmaStage>
    </section>
  );
}
