"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function RenderStage(props: { piece: string; pose: number; zoom: number }) {
  return (
    <div className="fixed inset-0 bg-void">
      <Scene {...props} />
    </div>
  );
}
