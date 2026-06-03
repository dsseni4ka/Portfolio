import BubblesCanvas from "./BubblesCanvas";
import HeroNav from "./HeroNav";
import HeroTitle from "./HeroTitle";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#F6F8FB] text-[#0E0E0F]">
      <div className="absolute inset-0 z-10">
        <HeroTitle layer="back" />
      </div>

      <BubblesCanvas />

      <div className="pointer-events-none absolute inset-0 z-30 flex flex-col">
        <header className="pointer-events-auto px-6 pt-6 sm:px-10 sm:pt-8">
          <HeroNav />
        </header>
        <div className="flex flex-1 flex-col justify-center pb-16">
          <HeroTitle layer="front" />
        </div>
      </div>
    </section>
  );
}
