import { FaStar } from "react-icons/fa6";

export function RatingBadge({ rating, count }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-sm font-semibold">
      <FaStar className="h-3 w-3 text-accent" />
      {rating ? Number(rating).toFixed(1) : "New"}
      {count > 0 && <span className="font-normal text-base-content/60">({count})</span>}
    </span>
  );
}

export function Stars({ value }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => <FaStar key={n} className={`h-4 w-4 ${n <= value ? "text-accent" : "text-base-300"}`} />)}
    </span>
  );
}
