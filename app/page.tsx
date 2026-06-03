import Hero from "@/components/hero/Hero";
import AboutSection from "@/components/sections/AboutSection";
import ConnectSection from "@/components/sections/ConnectSection";
import SkillsSection from "@/components/sections/SkillsSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F6F8FB] text-[#0E0E0F]">
      <Hero />
      <AboutSection />
      <SkillsSection />
      <ConnectSection />
    </main>
  );
}
