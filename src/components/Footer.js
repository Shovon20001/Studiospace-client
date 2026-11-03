"use client";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaXTwitter, FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa6";
import Logo from "./Logo";
import { CATEGORIES } from "@/lib/constants";

export default function Footer() {
  const [email, setEmail] = useState("");

  const subscribe = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Enter a valid email address to subscribe.");
    toast.success("You are subscribed. New studios will land in your inbox.");
    setEmail("");
  };

  const social = [
    { icon: FaXTwitter, label: "X", href: "https://x.com" },
    { icon: FaInstagram, label: "Instagram", href: "https://instagram.com" },
    { icon: FaFacebookF, label: "Facebook", href: "https://facebook.com" },
    { icon: FaLinkedinIn, label: "LinkedIn", href: "https://linkedin.com" },
  ];

  return (
    <footer className="border-t border-base-300 bg-neutral text-neutral-content">
      <div className="wrap grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo light />
          <p className="max-w-xs text-sm text-neutral-content/70">Our mission is to make every creative space bookable in a few clicks, so creators spend their time making things.</p>
          <div className="flex gap-2">
            {social.map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid h-9 w-9 place-items-center rounded-full border border-white/20 transition hover:border-primary hover:text-primary">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold text-white">Quick links</h3>
          <ul className="space-y-2 text-sm text-neutral-content/70">
            <li><Link className="hover:text-primary" href="/">Home</Link></li>
            <li><Link className="hover:text-primary" href="/studios">Explore Studios</Link></li>
            <li><Link className="hover:text-primary" href="/how-it-works">How It Works</Link></li>
            <li><Link className="hover:text-primary" href="/about">About Us</Link></li>
            <li><Link className="hover:text-primary" href="/add-studio">Host Your Space</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold text-white">Popular categories</h3>
          <ul className="space-y-2 text-sm text-neutral-content/70">
            {CATEGORIES.map((c) => (
              <li key={c}><Link className="hover:text-primary" href={`/studios?category=${encodeURIComponent(c)}`}>{c}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold text-white">New spaces, weekly</h3>
          <form onSubmit={subscribe} className="flex gap-2">
            <label htmlFor="newsletter" className="sr-only">Email address</label>
            <input id="newsletter" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="input input-sm w-full bg-white/10 text-white placeholder:text-white/40" />
            <button className="btn btn-primary btn-sm">Join</button>
          </form>
          <p className="mt-3 text-xs text-neutral-content/60">One short email a week. Unsubscribe any time.</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-neutral-content/60">
        <p>&copy; {new Date().getFullYear()} StudioSpace. All rights reserved. Use of this site is subject to our Terms of Service and Privacy Policy.</p>
      </div>
    </footer>
  );
}
