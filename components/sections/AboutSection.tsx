import AboutSectionView from "./AboutSectionView";

type AboutSectionProps = {
  id?: string;
};

export default function AboutSection({ id = "about" }: AboutSectionProps) {
  return <AboutSectionView id={id} />;
}
