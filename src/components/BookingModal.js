"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Modal from "./Modal";
import { apiFetch, json } from "@/lib/api";
import { money } from "@/lib/constants";

const today = () => new Date().toISOString().slice(0, 10);
const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };

export default function BookingModal({ studio, open, onClose }) {
  const router = useRouter();
  const [f, setF] = useState({ date: "", startTime: "10:00", endTime: "12:00", guests: 1, notes: "" });
  const [taken, setTaken] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => { setError(""); setF((p) => ({ ...p, [k]: e.target.value })); };

  useEffect(() => {
    if (!open || !f.date) return;
    apiFetch(`/api/studios/${studio._id}/availability?date=${f.date}`).then(setTaken).catch(() => setTaken([]));
  }, [open, f.date, studio._id]);

  const hours = f.startTime && f.endTime ? Math.max((toMin(f.endTime) - toMin(f.startTime)) / 60, 0) : 0;
  const subtotal = hours * studio.hourlyRate;
  const overlaps = taken.some((s) => toMin(f.startTime) < toMin(s.endTime) && toMin(f.endTime) > toMin(s.startTime));

  const submit = async (e) => {
    e.preventDefault();
    if (!f.date) return setError("Choose a date for your shoot.");
    if (hours <= 0) return setError("End time must be after the start time.");
    setBusy(true);
    try {
      await apiFetch("/api/bookings", json("POST", { ...f, guests: Number(f.guests), studioId: String(studio._id) }));
      toast.success("Booking request sent. The host will confirm it soon.");
      onClose();
      router.push("/my-bookings");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Book ${studio.title}`} wide>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="form-control sm:col-span-3"><span className="label-text mb-1 font-medium">Date</span>
            <input type="date" min={today()} className="field" value={f.date} onChange={set("date")} /></label>
          <label className="form-control"><span className="label-text mb-1 font-medium">Start</span>
            <input type="time" className="field" value={f.startTime} onChange={set("startTime")} /></label>
          <label className="form-control"><span className="label-text mb-1 font-medium">End</span>
            <input type="time" className="field" value={f.endTime} onChange={set("endTime")} /></label>
          <label className="form-control"><span className="label-text mb-1 font-medium">Guests (max {studio.maxCapacity})</span>
            <input type="number" min="1" max={studio.maxCapacity} className="field" value={f.guests} onChange={set("guests")} /></label>
        </div>

        {f.date && (
          <div className="rounded-lg bg-base-200 p-3 text-sm">
            {taken.length ? (
              <>
                <p className="font-medium">Already confirmed on this day:</p>
                <ul className="mt-1 flex flex-wrap gap-2">{taken.map((s) => <li key={s._id} className="badge badge-error badge-outline">{s.startTime} to {s.endTime}</li>)}</ul>
              </>
            ) : <p>No confirmed bookings on this day. All hours are open.</p>}
            {overlaps && <p className="mt-2 font-medium text-error">Your selected time overlaps a confirmed booking.</p>}
          </div>
        )}

        <label className="form-control"><span className="label-text mb-1 font-medium">Notes for the host (optional)</span>
          <textarea className="field-area" rows={2} value={f.notes} onChange={set("notes")} /></label>

        <dl className="space-y-1 rounded-lg border border-base-300 p-3 text-sm">
          <div className="flex justify-between"><dt>{money(studio.hourlyRate)} x {hours} h</dt><dd>{money(subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Refundable security deposit</dt><dd>{money(studio.securityDeposit)}</dd></div>
          <div className="flex justify-between border-t border-base-300 pt-1 text-base font-bold"><dt>Total</dt><dd>{money(subtotal + studio.securityDeposit)}</dd></div>
        </dl>

        {error && <p role="alert" className="rounded-lg bg-error/10 p-3 text-sm font-medium text-error">{error}</p>}

        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-primary" disabled={busy || overlaps}>{busy && <span className="loading loading-spinner loading-sm" />}Request booking</button>
        </div>
      </form>
    </Modal>
  );
}
