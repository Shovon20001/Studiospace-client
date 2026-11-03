"use client";
import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import StudioCard from "@/components/StudioCard";
import EmptyState from "@/components/EmptyState";
import { GridSkeleton } from "@/components/Skeletons";
import { useWishlist } from "@/components/Providers";
import { apiFetch } from "@/lib/api";

function Inner() {
  const { ids } = useWishlist();
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { apiFetch("/api/wishlist").then(setItems).catch((e) => { setError(e.message); setItems([]); }); }, []);

  // when a heart is un-toggled, drop the card straight away
  const visible = items?.filter((s) => ids.includes(String(s._id)));

  return (
    <div className="wrap py-10">
      <h1 className="section-title">Saved studios</h1>
      <p className="section-sub mb-8">Spaces you want to come back to.</p>
      {items === null ? <GridSkeleton count={3} /> : error ? <EmptyState title="Saved studios could not be loaded" text={error} cta="Reload" onClick={() => window.location.reload()} />
        : visible.length === 0 ? <EmptyState title="Nothing saved yet" text="Tap the heart on any studio to keep it here." cta="Explore Studios" href="/studios" />
        : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{visible.map((s) => <StudioCard key={s._id} studio={s} />)}</div>}
    </div>
  );
}

export default function Wishlist() {
  return <RequireAuth><Inner /></RequireAuth>;
}
