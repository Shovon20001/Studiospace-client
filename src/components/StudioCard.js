"use client";
import Link from "next/link";
import { FiHeart, FiMapPin } from "react-icons/fi";
import { FaHeart } from "react-icons/fa6";
import SafeImg from "./SafeImg";
import { RatingBadge } from "./Rating";
import { useWishlist } from "./Providers";

export default function StudioCard({ studio }) {
  const { ids, toggle } = useWishlist();
  const id = String(studio._id);
  const saved = ids.includes(id);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition hover:shadow-lg">
      <div className="relative">
        <SafeImg src={studio.image} alt={studio.title} className="aspect-[4/3] w-full object-cover" />
        <span className="badge badge-neutral absolute left-3 top-3 border-0">{studio.category}</span>
        <button onClick={() => toggle(id)} aria-label={saved ? "Remove from wishlist" : "Save to wishlist"} aria-pressed={saved}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-base-100/90 shadow transition hover:scale-105">
          {saved ? <FaHeart className="h-4 w-4 text-secondary" /> : <FiHeart className="h-4 w-4" />}
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-lg font-bold">{studio.title}</h3>
          <RatingBadge rating={studio.rating} />
        </div>
        <p className="flex items-center gap-1 text-sm text-base-content/70"><FiMapPin className="shrink-0" /><span className="line-clamp-1">{studio.location}</span></p>
        <p className="mt-1 text-lg font-bold text-primary">${studio.hourlyRate} <span className="text-sm font-normal text-base-content/60">/ hr</span></p>
        <Link href={`/studios/${id}`} className="btn btn-primary btn-sm mt-auto">View Details</Link>
      </div>
    </article>
  );
}
