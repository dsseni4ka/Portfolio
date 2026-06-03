const skills = [
  "TypeScript / React",
  "Next.js",
  "React Three Fiber",
  "Design systems",
  "Motion & interaction",
  "Node.js",
] as const;

type SkillsSectionProps = {
  id?: string;
};

export default function SkillsSection({ id = "skills" }: SkillsSectionProps) {
  return (
    <section id={id} className="section-pad border-t border-[#0E0E0F]/8">
      <p className="font-mono mb-4 text-xs tracking-[0.2em] uppercase">{"{skills}"}</p>
      <h2 className="font-sans mb-8 text-3xl font-bold tracking-tight sm:text-4xl">
        Skills & tools
      </h2>
      <ul className="grid max-w-3xl gap-3 sm:grid-cols-2">
        {skills.map((skill) => (
          <li
            key={skill}
            className="font-mono rounded-full border border-[#0E0E0F]/12 px-5 py-3 text-sm tracking-wide"
          >
            {skill}
          </li>
        ))}
      </ul>
    </section>
  );
}
