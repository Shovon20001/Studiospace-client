"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "./Providers";
import { authClient } from "@/lib/auth-client";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

const MENU = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/add-studio", label: "Add New Studio" },
  { href: "/my-listings", label: "My Studio Listings" },
  { href: "/my-bookings", label: "My Bookings" },
  { href: "/wishlist", label: "Saved Studios" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const ref = useRef(null);

  useEffect(() => { setOpen(false); setMenu(false); }, [pathname]);
  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setMenu(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const active = (href) => (href === "/" ? pathname === "/" : pathname === href || (href === "/studios" && pathname.startsWith("/studios")));

  const logout = async () => {
    try {
      await fetch("/api/token", { method: "DELETE" });
      await authClient.signOut();
    } catch {}
    window.location.assign("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/90 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={active(l.href) ? "page" : undefined}
              className={`relative px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${active(l.href) ? "text-primary" : "text-base-content/75"}`}>
              {l.label}
              {active(l.href) && <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded bg-primary" />}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {loading ? (
            <div className="sk h-9 w-9 !rounded-full" />
          ) : user ? (
            <div className="relative" ref={ref} onMouseEnter={() => setMenu(true)} onMouseLeave={() => setMenu(false)}>
              <button onClick={() => setMenu(true)} className="flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-haspopup="menu" aria-expanded={menu} title={user.name}>
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/40" />
                ) : (
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-primary font-bold text-primary-content">{user.name?.[0]?.toUpperCase()}</span>
                )}
                <span className="hidden max-w-[140px] truncate text-sm font-semibold sm:block">{user.name}</span>
              </button>
              {menu && (
                <div className="absolute right-0 top-full w-60 pt-2" role="menu">
                  <div className="rounded-xl border border-base-300 bg-base-100 p-2 shadow-xl">
                    <div className="border-b border-base-300 px-3 py-2">
                      <p className="truncate font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-base-content/60">{user.email}</p>
                    </div>
                    <ul className="py-1">
                      {MENU.map((m) => (
                        <li key={m.href}><Link href={m.href} role="menuitem" className="block rounded-lg px-3 py-2 text-sm hover:bg-base-200">{m.label}</Link></li>
                      ))}
                    </ul>
                    <button onClick={logout} className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-error hover:bg-base-200" role="menuitem">Logout</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link href="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
          <button className="btn btn-ghost btn-circle btn-sm lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle navigation" aria-expanded={open}>
            {open ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-base-300 bg-base-100 lg:hidden" aria-label="Mobile">
          <ul className="wrap space-y-1 py-3">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={`block rounded-lg px-3 py-2 font-medium ${active(l.href) ? "bg-primary/10 text-primary" : "hover:bg-base-200"}`}>{l.label}</Link>
              </li>
            ))}
            {!loading && !user && (
              <li className="flex gap-2 pt-2">
                <Link href="/login" className="btn btn-outline btn-sm flex-1">Login</Link>
                <Link href="/register" className="btn btn-primary btn-sm flex-1">Register</Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}