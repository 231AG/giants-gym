import Intro from "@/components/motion/Intro";
import SceneLayer from "@/components/three/SceneLayer";
import Hero from "@/components/sections/Hero";
import Strength from "@/components/sections/Strength";
import Forge from "@/components/sections/Forge";
import TrainingSection from "@/components/training/TrainingSection";
import Equipment from "@/components/sections/Equipment";
import Space from "@/components/sections/Space";
import Rhythm from "@/components/sections/Rhythm";
import Giants from "@/components/sections/Giants";
import Transformation from "@/components/sections/Transformation";
import MembershipSection from "@/components/membership/MembershipSection";
import Join from "@/components/sections/Join";

/**
 * One continuous story:
 *   ENTER → STRENGTH → (3D transition) → TRAINING → THE RACK → THE SPACE
 *   → THE COUNT → THE GIANTS → THE LONG GAME → MEMBERSHIP → JOIN
 *
 * Section order is also the 3D layer's score. Hero, Strength, Forge and Rhythm
 * paint no background of their own so the WebGL canvas fixed behind the document
 * shows through; every other section is opaque, which is what lets a single
 * scene run the length of the page and stop rendering in between.
 */
export default function Home() {
  return (
    <>
      <Intro />
      <SceneLayer />

      <Hero />
      <Strength />
      <Forge />
      <TrainingSection />
      <Equipment />
      <Space />
      <Rhythm />
      <Giants />
      <Transformation />
      <MembershipSection />
      <Join />
    </>
  );
}
