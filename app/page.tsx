import Hero from "@/components/hero/Hero";
import SiteNav from "@/components/SiteNav";
import AboutSection from "@/components/sections/AboutSection";
import ConnectSection from "@/components/sections/ConnectSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";

export default function Home() {
  return (
    <main
      suppressHydrationWarning
      className="min-h-screen snap-y snap-proximity bg-background text-foreground"
    >
      <SiteNav />
      <Hero />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ConnectSection />
    </main>
  );
}
