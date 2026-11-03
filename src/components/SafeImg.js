"use client";
import { useState } from "react";
import { TbAperture } from "react-icons/tb";

// Image with a branded fallback so a broken URL never leaves a hole in a grid
export default function SafeImg({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`grid place-items-center bg-gradient-to-br from-primary/30 to-secondary/30 ${className}`} role="img" aria-label={alt}>
        <TbAperture className="h-10 w-10 text-primary/70" />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />;
}
