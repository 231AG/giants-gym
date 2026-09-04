import type { Metadata } from "next";
import RenderStage from "./RenderStage";

/**
 * Asset kitchen — not part of the site's navigation.
 *
 * The campaign imagery for the Training and The Gym sections is *rendered from
 * this project's own geometry* rather than licensed from a stock library. This
 * route poses one piece of equipment full-bleed so `scripts/render-media.mjs`
 * can screenshot it; the output lands in /public/media and is then treated like
 * photography (graded, grained, parallaxed) everywhere it is used.
 */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function RenderPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  return (
    <RenderStage
      piece={params.piece ?? "dumbbell"}
      pose={Number(params.pose ?? 0)}
      zoom={Number(params.zoom ?? 1)}
    />
  );
}
