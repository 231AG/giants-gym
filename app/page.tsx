import Intro from "@/components/motion/Intro";
import SceneLayer from "@/components/three/SceneLayer";
import Hero from "@/components/sections/Hero";
import Strength from "@/components/sections/Strength";
import Forge from "@/components/sections/Forge";

export default function Home() {
  return (
    <>
      <Intro />
      <SceneLayer />
      <Hero />
      <Strength />
      <Forge />
      <div className="relative z-10 h-[100vh] bg-void" />
    </>
  );
}
