import { cn } from "@/lib/utils";

/** The industrial index marker that opens every section: `03 / THE SPACE`. */
export default function SectionLabel({
  index,
  children,
  className,
}: {
  index: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className="label label-volt">{index}</span>
      <span aria-hidden className="h-px w-10 bg-rule" />
      <span className="label">{children}</span>
    </div>
  );
}
