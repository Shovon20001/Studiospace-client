"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import StudioCard from "@/components/StudioCard";
import { GridSkeleton } from "@/components/Skeletons";
import EmptyState from "@/components/EmptyState";
import { apiFetch } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";

export default function ExploreClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const category = sp.get("category") || "";
  const sort = sp.get("sort") || "newest";
  const maxPrice = sp.get("maxPrice") || "";
  const page = Number(sp.get("page") || 1);
  const urlQ = sp.get("q") || "";

  const [q, setQ] = useState(urlQ);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const update = (patch) => {
    const next = new URLSearchParams(sp.toString());
    Object.entries({ page: "", ...patch }).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    router.replace(`/studios${next.toString() ? `?${next}` : ""}`, { scroll: false });
  };

  // debounce the search box
  useEffect(() => {
    if (q === urlQ) return;
    const t = setTimeout(() => update({ q }), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  useEffect(() => {
    setData(null);
    setError("");
    const p = new URLSearchParams({ limit: "9", page: String(page), sort });
    if (urlQ) p.set("q", urlQ);
    if (category) p.set("category", category);
    if (maxPrice) p.set("maxPrice", maxPrice);
    apiFetch(`/api/studios?${p}`).then(setData).catch((e) => setError(e.message));
  }, [urlQ, category, sort, maxPrice, page]);

  const clear = () => { setQ(""); router.replace("/studios"); };

  return (
    <div className="wrap py-10">
      <h1 className="section-title">Explore studios</h1>
      <p className="section-sub">Filter by category, price and location to find the right room.</p>

      <div className="mt-6 grid gap-3 rounded-2xl border border-base-300 bg-base-100 p-4 md:grid-cols-[1fr_auto_auto]">
        <label className="relative">
          <span className="sr-only">Search studios</span>
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
          <input className="field pl-9" placeholder="Search by name, area or category" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <label>
          <span className="sr-only">Maximum hourly rate</span>
          <select className="select select-bordered w-full bg-base-100" value={maxPrice} onChange={(e) => update({ maxPrice: e.target.value })}>
            <option value="">Any price</option>
            {[30, 50, 75, 100].map((n) => <option key={n} value={n}>Up to ${n} / hr</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">Sort by</span>
          <select className="select select-bordered w-full bg-base-100" value={sort} onChange={(e) => update({ sort: e.target.value })}>
            <option value="newest">Newest first</option>
            <option value="rating">Top rated</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Category filter">
        <button onClick={() => update({ category: "" })} className={`btn btn-sm ${!category ? "btn-primary" : "btn-outline"}`}>All</button>
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => update({ category: c })} className={`btn btn-sm ${category === c ? "btn-primary" : "btn-outline"}`} aria-pressed={category === c}>{c}</button>
        ))}
      </div>

      <div className="mt-8">
        {error ? <EmptyState title="Studios could not be loaded" text={error} cta="Try again" onClick={() => window.location.reload()} />
          : data === null ? <GridSkeleton count={6} />
          : data.items.length === 0 ? <EmptyState title="No studios match your search" text="Try a different keyword, remove a filter or list your own space." cta="Clear filters" onClick={clear} />
          : (
            <>
              <p className="mb-4 text-sm text-base-content/70">{data.total} {data.total === 1 ? "studio" : "studios"} found</p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{data.items.map((s) => <StudioCard key={s._id} studio={s} />)}</div>
              {data.pages > 1 && (
                <div className="join mt-10 flex justify-center">
                  {Array.from({ length: data.pages }).map((_, i) => (
                    <button key={i} onClick={() => update({ page: i === 0 ? "" : String(i + 1) })} className={`join-item btn btn-sm ${page === i + 1 ? "btn-primary" : ""}`}>{i + 1}</button>
                  ))}
                </div>
              )}
            </>
          )}
      </div>
    </div>
  );
}
