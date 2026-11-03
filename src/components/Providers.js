"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

const WishlistCtx = createContext({ ids: [], toggle: async () => {} });
export const useWishlist = () => useContext(WishlistCtx);

export function useAuth() {
  const { data, isPending } = authClient.useSession();
  return { user: data?.user || null, loading: isPending };
}

export default function Providers({ children }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [ids, setIds] = useState([]);
  const email = user?.email;

  // Keep the HTTPOnly JWT cookie in sync with the session (covers Google login and page reloads)
  useEffect(() => {
    if (!email) {
      setIds([]);
      return;
    }
    fetch("/api/token")
      .then(() => apiFetch("/api/wishlist/ids"))
      .then(setIds)
      .catch(() => {});
  }, [email]);

  const toggle = useCallback(
    async (studioId) => {
      if (!email) {
        toast.error("Log in to save studios to your wishlist.");
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
      try {
        const { saved } = await apiFetch(`/api/wishlist/${studioId}`, { method: "POST" });
        setIds((prev) => (saved ? [...prev, studioId] : prev.filter((i) => i !== studioId)));
        toast.success(saved ? "Saved to your wishlist." : "Removed from your wishlist.");
      } catch (e) {
        toast.error(e.message);
      }
    },
    [email, router, pathname]
  );

  return (
    <WishlistCtx.Provider value={{ ids, toggle }}>
      {children}
      <Toaster position="top-right" toastOptions={{ duration: 3500, style: { background: "var(--fallback-b1,oklch(var(--b1)))", color: "var(--fallback-bc,oklch(var(--bc)))", border: "1px solid oklch(var(--b3))" } }} />
    </WishlistCtx.Provider>
  );
}
