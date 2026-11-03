"use client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import RequireAuth from "@/components/RequireAuth";
import SafeImg from "@/components/SafeImg";
import EmptyState from "@/components/EmptyState";
import { RowsSkeleton } from "@/components/Skeletons";
import { ConfirmModal } from "@/components/Modal";
import { apiFetch, json } from "@/lib/api";
import { STATUS_STYLES, money } from "@/lib/constants";
import { downloadInvoice } from "@/lib/invoice";

function BookingRow({ b, actions }) {
  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-base-300 bg-base-100 p-4 sm:flex-row sm:items-center">
      <SafeImg src={b.studioImage} alt={b.studioTitle} className="h-28 w-full shrink-0 rounded-xl object-cover sm:w-40" />
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-bold">{b.studioTitle}</h3>
          <span className={`badge ${STATUS_STYLES[b.status]}`}>{b.status}</span>
        </div>
        <p className="text-sm text-base-content/70">{b.date}, {b.startTime} to {b.endTime} ({b.hours} h) &middot; {b.guests} {b.guests === 1 ? "guest" : "guests"}</p>
        <p className="text-sm text-base-content/70">{b.studioLocation}</p>
        <p className="font-semibold">Total {money(b.total)}</p>
        {b.cancelReason && b.status === "Cancelled" && <p className="text-sm text-error">{b.cancelReason}</p>}
      </div>
      <div className="flex flex-wrap gap-2 sm:flex-col">{actions}</div>
    </li>
  );
}

function Inner() {
  const [tab, setTab] = useState("mine");
  const [mine, setMine] = useState(null);
  const [host, setHost] = useState(null);
  const [error, setError] = useState("");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    apiFetch("/api/bookings/mine").then(setMine).catch((e) => { setError(e.message); setMine([]); });
    apiFetch("/api/bookings/host").then(setHost).catch(() => setHost([]));
  }, []);
  useEffect(() => { load(); }, [load]);

  const cancel = async () => {
    setBusy(true);
    try {
      await apiFetch(`/api/bookings/${cancelTarget._id}/cancel`, { method: "PATCH" });
      toast.success("Booking cancelled.");
      setCancelTarget(null);
      load();
    } catch (e) { toast.error(e.message); } finally { setBusy(false); }
  };

  const setStatus = async (id, status) => {
    try {
      await apiFetch(`/api/bookings/${id}/status`, json("PATCH", { status }));
      toast.success(`Booking ${status.toLowerCase()}.`);
      load();
    } catch (e) { toast.error(e.message); }
  };

  const invoiceBtn = (b) => (b.status === "Confirmed" || b.status === "Completed") && (
    <button key="inv" className="btn btn-outline btn-sm" onClick={() => downloadInvoice(b).catch(() => toast.error("Could not create the invoice."))}>Download invoice</button>
  );

  const list = tab === "mine" ? mine : host;
  const pendingRequests = host?.filter((b) => b.status === "Pending").length || 0;

  return (
    <div className="wrap max-w-4xl py-10">
      <h1 className="section-title">My bookings</h1>
      <p className="section-sub">Track your reservations and respond to requests for your studios.</p>

      <div role="tablist" className="tabs tabs-boxed my-6 w-fit bg-base-100">
        <button role="tab" className={`tab ${tab === "mine" ? "tab-active" : ""}`} onClick={() => setTab("mine")}>My reservations</button>
        <button role="tab" className={`tab gap-2 ${tab === "host" ? "tab-active" : ""}`} onClick={() => setTab("host")}>
          Requests for my studios {pendingRequests > 0 && <span className="badge badge-warning badge-sm">{pendingRequests}</span>}
        </button>
      </div>

      {list === null ? <RowsSkeleton /> : error && tab === "mine" ? <EmptyState title="Bookings could not be loaded" text={error} cta="Reload" onClick={() => window.location.reload()} />
        : list.length === 0 ? (tab === "mine"
          ? <EmptyState title="No bookings yet" text="Find a studio that fits your next shoot and reserve a slot." cta="Explore Studios" href="/studios" />
          : <EmptyState title="No requests yet" text="When creators book your studios, their requests show up here." cta="View my listings" href="/my-listings" />)
        : (
          <ul className="space-y-4">
            {list.map((b) => (
              <BookingRow key={b._id} b={b} actions={tab === "mine" ? (
                <>
                  {b.status === "Pending" && <button className="btn btn-error btn-outline btn-sm" onClick={() => setCancelTarget(b)}>Cancel Booking</button>}
                  {invoiceBtn(b)}
                </>
              ) : (
                <>
                  <p className="text-sm text-base-content/70">Requested by {b.userName}</p>
                  {b.status === "Pending" && (<><button className="btn btn-success btn-sm" onClick={() => setStatus(b._id, "Confirmed")}>Confirm</button><button className="btn btn-error btn-outline btn-sm" onClick={() => setStatus(b._id, "Cancelled")}>Decline</button></>)}
                  {b.status === "Confirmed" && (<><button className="btn btn-info btn-sm" onClick={() => setStatus(b._id, "Completed")}>Mark completed</button><button className="btn btn-error btn-outline btn-sm" onClick={() => setStatus(b._id, "Cancelled")}>Cancel</button></>)}
                  {invoiceBtn(b)}
                </>
              )} />
            ))}
          </ul>
        )}

      <ConfirmModal open={!!cancelTarget} onClose={() => setCancelTarget(null)} onConfirm={cancel} busy={busy} confirmLabel="Cancel booking" title="Cancel this booking?"
        text={`Your pending request for "${cancelTarget?.studioTitle}" on ${cancelTarget?.date} will be cancelled.`} />
    </div>
  );
}

export default function MyBookings() {
  return <RequireAuth><Inner /></RequireAuth>;
}
