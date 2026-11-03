"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import RequireAuth from "@/components/RequireAuth";
import SafeImg from "@/components/SafeImg";
import EmptyState from "@/components/EmptyState";
import { RowsSkeleton } from "@/components/Skeletons";
import { ConfirmModal } from "@/components/Modal";
import { apiFetch } from "@/lib/api";
import { money } from "@/lib/constants";

function Inner() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { apiFetch("/api/studios/mine").then(setItems).catch((e) => { setError(e.message); setItems([]); }); }, []);

  const remove = async () => {
    setBusy(true);
    try {
      await apiFetch(`/api/studios/${target._id}`, { method: "DELETE" });
      setItems((p) => p.filter((s) => s._id !== target._id));
      toast.success("Studio deleted.");
      setTarget(null);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="wrap py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="section-title">My studio listings</h1><p className="section-sub">Manage the spaces you host.</p></div>
        <Link href="/add-studio" className="btn btn-primary">Add New Studio</Link>
      </div>

      {items === null ? <RowsSkeleton /> : error ? <EmptyState title="Listings could not be loaded" text={error} cta="Reload" onClick={() => window.location.reload()} />
        : items.length === 0 ? <EmptyState title="You have not listed a studio yet" text="Add your first space and start receiving booking requests." cta="Add New Studio" href="/add-studio" />
        : (
          <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-100">
            <table className="table">
              <thead><tr><th>Studio</th><th>Category</th><th>Rate</th><th>Rating</th><th className="text-right">Actions</th></tr></thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <SafeImg src={s.image} alt={s.title} className="h-14 w-20 shrink-0 rounded-lg object-cover" />
                        <div className="min-w-0"><Link href={`/studios/${s._id}`} className="font-semibold hover:text-primary">{s.title}</Link><p className="text-sm text-base-content/60">{s.location}</p></div>
                      </div>
                    </td>
                    <td><span className="badge badge-outline whitespace-nowrap">{s.category}</span></td>
                    <td className="whitespace-nowrap">{money(s.hourlyRate)} / hr</td>
                    <td>{s.rating ? s.rating.toFixed(1) : "New"}</td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <Link href={`/studios/edit/${s._id}`} className="btn btn-outline btn-sm">Update</Link>
                        <button onClick={() => setTarget(s)} className="btn btn-error btn-outline btn-sm">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      <ConfirmModal open={!!target} onClose={() => setTarget(null)} onConfirm={remove} busy={busy} confirmLabel="Delete studio" title="Delete this studio?"
        text={`"${target?.title}" will be removed for good, and its pending or confirmed bookings will be cancelled.`} />
    </div>
  );
}

export default function MyListings() {
  return <RequireAuth><Inner /></RequireAuth>;
}
