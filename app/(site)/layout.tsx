import SmoothScroll from "@/components/motion/SmoothScroll";
import Nav from "@/components/navigation/Nav";
import Grain from "@/components/motion/Grain";

/**
 * Chrome for the site proper. Kept out of the root layout so `/render` — the
 * asset kitchen that produces the campaign imagery — renders on a clean stage
 * with no navigation or grain baked into the output.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[999] focus:bg-volt focus:px-4 focus:py-3 focus:font-mono focus:text-xs focus:tracking-[0.2em] focus:text-black"
      >
        SKIP TO CONTENT
      </a>
      <SmoothScroll>
        <Nav />
        <main id="main">{children}</main>
      </SmoothScroll>
      <Grain />
    </>
  );
}
