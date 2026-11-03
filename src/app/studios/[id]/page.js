"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FiMapPin, FiUsers, FiCheck } from "react-icons/fi";
import SafeImg from "@/components/SafeImg";
import { RatingBadge, Stars } from "@/components/Rating";
import BookingModal from "@/components/BookingModal";
import EmptyState from "@/components/EmptyState";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/components/Providers";
import { apiFetch, json } from "@/lib/api";
import { money } from "@/lib/constants";

export default function StudioDetails() {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [studio, setStudio] = useState(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [sending, setSending] = useState(false);

  const load = useCallback(() => apiFetch(`/api/studios/${id}`).then(setStudio).catch((e) => setError(e.message)), [id]);
  useEffect(() => { load(); }, [load]);

  if (error) return <div className="wrap py-16"><EmptyState title="Studio not found" text={error} cta="Browse studios" href="/studios" /></div>;
  if (!studio) return <Spinner label="Loading studio..." />;

  const isOwner = user?.email === studio.ownerEmail;
  const gallery = studio.gallery?.length ? studio.gallery : [studio.image];

  const book = () => {
    if (!user) {
      toast.error("Log in to book this studio.");
      return router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
    setOpen(true);
  };

  const sendReview = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await apiFetch(`/api/studios/${id}/reviews`, json("POST", review));
      toast.success("Thanks, your review is live.");
      setReview({ rating: 5, comment: "" });
      await load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="wrap py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-8">
          <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} className="w-full overflow-hidden rounded-2xl">
            {gallery.map((g, i) => (
              <SwiperSlide key={g + i}><SafeImg src={g} alt={`${studio.title}, photo ${i + 1}`} className="aspect-[16/10] w-full object-cover" /></SwiperSlide>
            ))}
          </Swiper>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="badge badge-neutral">{studio.category}</span>
              <RatingBadge rating={studio.rating} count={studio.reviewCount} />
            </div>
            <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">{studio.title}</h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-base-content/70">
              <span className="flex items-center gap-1"><FiMapPin />{studio.location}</span>
              <span className="flex items-center gap-1"><FiUsers />Up to {studio.maxCapacity} people</span>
            </p>
          </div>

          <section>
            <h2 className="mb-2 text-xl font-bold">Overview</h2>
            <p className="whitespace-pre-line leading-relaxed text-base-content/80">{studio.overview}</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold">Amenities</h2>
            {studio.amenities?.length ? (
              <ul className="grid gap-2 sm:grid-cols-2">
                {studio.amenities.map((a) => <li key={a} className="flex items-center gap-2"><FiCheck className="text-success" />{a}</li>)}
              </ul>
            ) : <p className="text-base-content/70">The host has not listed amenities yet.</p>}
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold">Hosted by</h2>
            <div className="flex items-center gap-4 rounded-2xl border border-base-300 bg-base-100 p-4">
              {studio.ownerImage ? <SafeImg src={studio.ownerImage} alt={studio.ownerName} className="h-14 w-14 rounded-full object-cover" />
                : <span className="grid h-14 w-14 place-items-center rounded-full bg-primary text-xl font-bold text-primary-content">{studio.ownerName?.[0]}</span>}
              <div className="min-w-0"><p className="font-semibold">{studio.ownerName}</p><p className="truncate text-sm text-base-content/70">{studio.ownerEmail}</p></div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold">Reviews ({studio.reviews.length})</h2>
            {studio.reviews.length === 0 && <p className="text-base-content/70">No reviews yet. Be the first to share how your session went.</p>}
            <ul className="space-y-4">
              {studio.reviews.map((r) => (
                <li key={r._id} className="rounded-2xl border border-base-300 bg-base-100 p-4">
                  <div className="flex items-center justify-between gap-2"><p className="font-semibold">{r.userName}</p><Stars value={r.rating} /></div>
                  <p className="mt-2 text-base-content/80">{r.comment}</p>
                </li>
              ))}
            </ul>

            {user && !isOwner && (
              <form onSubmit={sendReview} className="mt-6 space-y-3 rounded-2xl border border-base-300 bg-base-100 p-4">
                <h3 className="font-bold">Rate this studio</h3>
                <select className="select select-bordered select-sm bg-base-100" value={review.rating} onChange={(e) => setReview((p) => ({ ...p, rating: Number(e.target.value) }))} aria-label="Rating">
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} {n === 1 ? "star" : "stars"}</option>)}
                </select>
                <textarea className="field-area" rows={3} placeholder="What stood out about the space?" value={review.comment} onChange={(e) => setReview((p) => ({ ...p, comment: e.target.value }))} />
                <button className="btn btn-primary btn-sm" disabled={sending}>{sending && <span className="loading loading-spinner loading-sm" />}Post review</button>
              </form>
            )}
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-4 rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
            <p className="text-3xl font-extrabold text-primary">{money(studio.hourlyRate)} <span className="text-base font-normal text-base-content/60">/ hr</span></p>
            <p className="text-sm text-base-content/70">Refundable security deposit: {money(studio.securityDeposit)}</p>
            {isOwner ? (
              <>
                <p className="rounded-lg bg-base-200 p-3 text-sm">This is your listing. Creators can send you booking requests.</p>
                <Link href={`/studios/edit/${studio._id}`} className="btn btn-outline w-full">Edit listing</Link>
              </>
            ) : (
              <button onClick={book} className="btn btn-primary w-full">Book Workspace Now</button>
            )}
          </div>
        </aside>
      </div>
      {open && <BookingModal studio={studio} open={open} onClose={() => setOpen(false)} />}
    </div>
  );
}
