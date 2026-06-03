import Hero from "@/components/hero/Hero";
import AboutSection from "@/components/sections/AboutSection";
import ConnectSection from "@/components/sections/ConnectSection";
import SkillsSection from "@/components/sections/SkillsSection";

export default function Home() {
  return (
    <main
      suppressHydrationWarning
      className="min-h-screen bg-background text-foreground"
    >
      <Hero />
      <AboutSection />
      <SkillsSection />
      <ConnectSection />
    </main>
  );
}
