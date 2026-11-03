"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import RequireAuth from "@/components/RequireAuth";
import StudioForm from "@/components/StudioForm";
import { useAuth } from "@/components/Providers";
import { apiFetch, json } from "@/lib/api";

export default function AddStudio() {
  const { user } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const save = async (data) => {
    setBusy(true);
    try {
      await apiFetch("/api/studios", json("POST", data));
      toast.success("Your studio is now listed.");
      router.push("/my-listings");
    } catch (e) {
      toast.error(e.message);
      setBusy(false);
    }
  };

  return (
    <RequireAuth>
      <div className="wrap max-w-3xl py-10">
        <h1 className="section-title">Add a new studio</h1>
        <p className="section-sub mb-6">Tell creators what your space offers. You can edit the listing at any time.</p>
        <StudioForm user={user} onSubmit={save} submitLabel="List my studio" busy={busy} />
      </div>
    </RequireAuth>
  );
}
