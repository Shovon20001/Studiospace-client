import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="wrap grid min-h-[70vh] place-items-center py-16 text-center">
      <div>
        <svg viewBox="0 0 320 220" className="mx-auto mb-6 h-56 w-auto" role="img" aria-label="An empty studio with a spotlight and a lone director's chair">
          <defs>
            <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="currentColor" stopOpacity=".45" />
              <stop offset="1" stopColor="currentColor" stopOpacity=".02" />
            </linearGradient>
          </defs>
          <g className="text-primary">
            <polygon points="140,50 180,50 250,200 70,200" fill="url(#beam)" />
          </g>
          <rect x="20" y="198" width="280" height="6" rx="3" className="fill-base-300" />
          <g className="fill-neutral">
            <rect x="148" y="14" width="24" height="36" rx="4" />
            <rect x="158" y="0" width="4" height="14" />
          </g>
          <g className="stroke-secondary" strokeWidth="5" strokeLinecap="round" fill="none">
            <path d="M128 170 L132 198 M192 170 L188 198 M128 170 H192 M132 140 V170 M188 140 V170 M132 140 H188" />
          </g>
          <text x="160" y="120" textAnchor="middle" className="fill-base-content" fontSize="40" fontWeight="800">404</text>
        </svg>
        <h1 className="text-3xl font-bold sm:text-4xl">This set is empty</h1>
        <p className="mx-auto mt-3 max-w-md text-base-content/70">The page you are looking for was moved, removed or never existed. Head back and find a studio to book.</p>
        <Link href="/" className="btn btn-primary mt-8">Return to Home</Link>
      </div>
    </div>
  );
}
