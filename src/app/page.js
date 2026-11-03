"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FiCamera, FiFilm, FiMic, FiMusic, FiEdit3, FiSearch, FiClock, FiCheckCircle, FiShield, FiUserCheck, FiTool, FiHeadphones } from "react-icons/fi";
import HeroSlider from "@/components/HeroSlider";
import StudioCard from "@/components/StudioCard";
import { GridSkeleton } from "@/components/Skeletons";
import EmptyState from "@/components/EmptyState";
import { apiFetch } from "@/lib/api";

const CATS = [
  { value: "Photo Studio", label: "Photo Studios", icon: FiCamera, text: "Cyc walls, daylight lofts, strobe kits" },
  { value: "Film Stage", label: "Sound Stages", icon: FiFilm, text: "Lighting grids and green screens" },
  { value: "Podcast Lounge", label: "Podcast Rooms", icon: FiMic, text: "Treated rooms with broadcast mics" },
  { value: "Music Suite", label: "Music Suites", icon: FiMusic, text: "Live rooms, booths and monitors" },
  { value: "Workshop", label: "Art Workshops", icon: FiEdit3, text: "Clay, print and craft spaces" },
];

const STEPS = [
  { icon: FiSearch, title: "Discover Spaces", text: "Search by category, price and area to find rooms that fit your shoot." },
  { icon: FiClock, title: "Select Shoot Hours", text: "Pick a date and time. Confirmed slots are shown so you can plan around them." },
  { icon: FiCheckCircle, title: "Book Instantly", text: "Send your request in one step and track its status under My Bookings." },
  { icon: FiCamera, title: "Create & Produce", text: "Show up, set up and make the work. Leave a review once you wrap." },
];

const GUARANTEES = [
  { icon: FiShield, title: "Liability protection", text: "Every confirmed booking is covered by our host and creator liability terms." },
  { icon: FiUserCheck, title: "Verified profiles", text: "Hosts and creators sign in with verified accounts before they can transact." },
  { icon: FiTool, title: "Equipment safety", text: "Hosts list what is on site, and refundable deposits protect gear on both sides." },
  { icon: FiHeadphones, title: "24/7 host support", text: "Our support team is on call around the clock for urgent booking problems." },
];

export default function Home() {
  const [studios, setStudios] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    apiFetch("/api/studios?limit=6&sort=rating").then((d) => setStudios(d.items)).catch(() => { setFailed(true); setStudios([]); });
  }, []);

  return (
    <>
      <HeroSlider />

      <section className="wrap py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title">Featured studios</h2>
            <p className="section-sub">Our top-rated spaces, picked by creators who have shot there.</p>
          </div>
          <Link href="/studios" className="btn btn-outline btn-sm">See all studios</Link>
        </div>
        {studios === null ? <GridSkeleton /> : studios.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{studios.map((s) => <StudioCard key={s._id} studio={s} />)}</div>
        ) : (
          <EmptyState title={failed ? "Studios could not be loaded" : "No studios listed yet"} text={failed ? "Check your connection and reload the page." : "Be the first to list a creative space on StudioSpace."} cta="Host Your Space" href="/add-studio" />
        )}
      </section>

      <section className="bg-base-100 py-16">
        <div className="wrap">
          <h2 className="section-title">Browse by studio category</h2>
          <p className="section-sub">Jump straight to the kind of space your project needs.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {CATS.map(({ value, label, icon: Icon, text }) => (
              <Link key={value} href={`/studios?category=${encodeURIComponent(value)}`} className="group flex h-full flex-col rounded-2xl border border-base-300 bg-base-200 p-5 transition hover:border-primary hover:bg-primary/5">
                <Icon className="mb-4 h-8 w-8 text-primary" />
                <h3 className="text-lg font-bold">{label}</h3>
                <p className="mt-1 text-sm text-base-content/70">{text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap py-16">
        <h2 className="section-title">How booking works</h2>
        <p className="section-sub">From first search to first take in four steps.</p>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative h-full rounded-2xl border border-base-300 bg-base-100 p-6">
              <span className="absolute right-5 top-4 font-display text-5xl font-extrabold text-base-300">{i + 1}</span>
              <Icon className="mb-4 h-8 w-8 text-secondary" />
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm text-base-content/70">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-neutral py-16 text-neutral-content">
        <div className="wrap">
          <h2 className="section-title text-white">Host guarantee and creator support</h2>
          <p className="mt-2 max-w-2xl text-neutral-content/70">Book and host with the same protections, every time.</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {GUARANTEES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="h-full rounded-2xl border border-white/10 bg-white/5 p-6">
                <Icon className="mb-4 h-8 w-8 text-primary" />
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm text-neutral-content/70">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
