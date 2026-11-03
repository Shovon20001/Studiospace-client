"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./Providers";
import Spinner from "./Spinner";

// Client-side guard on top of the middleware. It waits for the session to load, so a
// reload on a private route never flashes (or redirects to) the login page for a logged-in user.
export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
  }, [loading, user, router, pathname]);

  if (loading || !user) return <Spinner label="Checking your session..." />;
  return children;
}
