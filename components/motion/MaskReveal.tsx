"use client";

import { motion, type Variants } from "framer-motion";
import { EASE } from "@/lib/motion-physics";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Line-by-line mask reveal for display type.
 *
 * Each line rides up out of a clipped box with a small horizontal push and a
 * touch of skew, staggered so the block assembles rather than appears. No fades:
 * a fade has no direction, and everything in this project should look like it
 * was *moved* into place by something with weight behind it.
 */
const line: Variants = {
  hidden: { y: "115%", x: "-4%", skewY: 3.5, opacity: 1 },
  show: (i: number) => ({
    y: "0%",
    x: "0%",
    skewY: 0,
    transition: {
      duration: 1.05,
      ease: EASE.heavy,
      delay: i * 0.085,
    },
  }),
};

export function MaskLines({
  lines,
  className,
  lineClassName,
  as: Tag = "h2",
  delay = 0,
  once = true,
  accentIndex,
}: {
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  delay?: number;
  once?: boolean;
  /** Index of the line that gets the accent colour, if any. */
  accentIndex?: number;
}) {
  const reduced = usePrefersReducedMotion();

  const content = lines.map((text, i) => (
    <span key={i} className={cn("mask-line", lineClassName)}>
      {reduced ? (
        <span className={cn("block", i === accentIndex && "text-volt")}>{text}</span>
      ) : (
        <motion.span
          className={cn("block will-change-transform", i === accentIndex && "text-volt")}
          variants={line}
          custom={i + delay}
        >
          {text}
        </motion.span>
      )}
    </span>
  ));

  if (reduced) {
    return <Tag className={className}>{content}</Tag>;
  }

  const MotionTag = motion[Tag] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.4, margin: "0px 0px -12% 0px" }}
    >
      {content}
    </MotionTag>
  );
}

/** Generic entrance for supporting copy and UI — quieter than the display reveal. */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  once = true,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.3 }}
      transition={{ duration: 0.75, ease: EASE.heavy, delay }}
    >
      {children}
    </motion.div>
  );
}
