"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import { RowsSkeleton } from "@/components/Skeletons";
import EmptyState from "@/components/EmptyState";
import { useAuth } from "@/components/Providers";
import { apiFetch } from "@/lib/api";
import { money } from "@/lib/constants";

function Inner() {
  const { user } = useAuth();
  const [s, setS] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { apiFetch("/api/dashboard").then(setS).catch((e) => setError(e.message)); }, []);

  const cards = s && [
    { label: "Studios you host", value: s.listings, href: "/my-listings" },
    { label: "Requests received", value: s.requestsReceived, note: `${s.pendingRequests} waiting for you`, href: "/my-bookings" },
    { label: "Earnings (confirmed)", value: money(s.earnings), href: "/my-bookings" },
    { label: "Your reservations", value: s.bookingsMade, note: `${s.pendingMade} pending`, href: "/my-bookings" },
    { label: "Saved studios", value: s.saved, href: "/wishlist" },
  ];

  return (
    <div className="wrap py-10">
      <h1 className="section-title">Welcome back, {user.name.split(" ")[0]}</h1>
      <p className="section-sub">Here is what is happening with your studios and bookings.</p>
      <div className="mt-8">
        {error ? <EmptyState title="Dashboard could not be loaded" text={error} cta="Reload" onClick={() => window.location.reload()} />
          : !s ? <RowsSkeleton rows={2} /> : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((c) => (
                <Link key={c.label} href={c.href} className="rounded-2xl border border-base-300 bg-base-100 p-6 transition hover:border-primary">
                  <p className="text-sm text-base-content/70">{c.label}</p>
                  <p className="mt-2 font-display text-4xl font-extrabold">{c.value}</p>
                  {c.note && <p className="mt-1 text-sm text-base-content/60">{c.note}</p>}
                </Link>
              ))}
              <Link href="/add-studio" className="grid place-items-center rounded-2xl border border-dashed border-primary p-6 text-center font-semibold text-primary hover:bg-primary/5">Add a new studio</Link>
            </div>
          )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return <RequireAuth><Inner /></RequireAuth>;
}
