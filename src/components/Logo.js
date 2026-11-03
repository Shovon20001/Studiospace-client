import Link from "next/link";
import { TbAperture } from "react-icons/tb";

export default function Logo({ light = false }) {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="StudioSpace home">
      <TbAperture className="h-8 w-8 text-primary" />
      <span className={`font-display text-2xl font-bold tracking-tight ${light ? "text-white" : ""}`}>StudioSpace</span>
    </Link>
  );
}
