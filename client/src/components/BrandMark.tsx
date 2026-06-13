import { cn } from "@/lib/utils";
import gdgLogo from "./GDGCybersec-Assets/gdg-logo.jpg";

/**
 * Small "app-icon" style brand mark — the GDG logo framed in a rounded tile.
 * Size is controlled by the caller via `className` (e.g. "w-10 h-10").
 */
export default function BrandMark({
  className,
  rounded = "rounded-xl",
}: {
  className?: string;
  rounded?: string;
}) {
  return (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden border border-white/10 shadow-md shadow-black/40",
        rounded,
        className
      )}
    >
      <img
        src={gdgLogo}
        alt="GDG PUP Cybersecurity"
        className="h-full w-full object-cover"
        draggable={false}
      />
    </span>
  );
}
