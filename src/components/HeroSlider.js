"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SafeImg from "./SafeImg";

const u = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=80`;
const SLIDES = [
  { img: u("photo-1516035069371-29a1b244cc32"), title: "Hire the room, bring the idea.", text: "Cyc walls, daylight lofts and strobe-ready photo studios you can book by the hour." },
  { img: u("photo-1492691527719-9d1e07e534b4"), title: "Stages built for your next scene.", text: "Soundproofed film stages with lighting grids, green screens and loading bays." },
  { img: u("photo-1598653222000-6b7b7a552625"), title: "Press record in a treated room.", text: "Podcast lounges and music suites with mics, monitors and acoustic treatment included." },
  { img: u("photo-1460661419201-fd4cecdf8a8b"), title: "Got a space? Put it to work.", text: "List your studio, set your rate and approve bookings when it suits you." },
];

export default function HeroSlider() {
  return (
    <section aria-label="Featured studio types">
      <Swiper modules={[Autoplay, EffectFade, Navigation, Pagination]} effect="fade" loop autoplay={{ delay: 5500, disableOnInteraction: false }} navigation pagination={{ clickable: true }} className="h-[520px] sm:h-[580px]">
        {SLIDES.map((s, i) => (
          <SwiperSlide key={s.title}>
            <div className="relative h-full w-full bg-neutral">
              <SafeImg src={s.img} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
              <div className="wrap relative flex h-full items-center">
                <div className="max-w-2xl px-6 text-white sm:px-10">
                  <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-6xl">{s.title}</h1>
                  <p className="mt-4 max-w-xl text-lg text-white/85">{s.text}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/studios" className="btn btn-primary">Explore Studios</Link>
                    <Link href="/add-studio" className="btn border-white/70 bg-transparent text-white hover:border-white hover:bg-white hover:text-black">Host Your Space</Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
