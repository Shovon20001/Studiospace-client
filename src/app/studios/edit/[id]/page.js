"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import RequireAuth from "@/components/RequireAuth";
import StudioForm from "@/components/StudioForm";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import { useAuth } from "@/components/Providers";
import { apiFetch, json } from "@/lib/api";

function Inner() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [studio, setStudio] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { apiFetch(`/api/studios/${id}`).then(setStudio).catch((e) => setError(e.message)); }, [id]);

  if (error) return <div className="wrap py-16"><EmptyState title="Could not load this studio" text={error} cta="Back to my listings" href="/my-listings" /></div>;
  if (!studio) return <Spinner label="Loading listing..." />;
  if (studio.ownerEmail !== user.email) return <div className="wrap py-16"><EmptyState title="This is not your listing" text="Only the host can edit a studio." cta="Back to my listings" href="/my-listings" /></div>;

  const save = async (data) => {
    setBusy(true);
    try {
      await apiFetch(`/api/studios/${id}`, json("PUT", data));
      toast.success("Studio updated.");
      router.push("/my-listings");
    } catch (e) {
      toast.error(e.message);
      setBusy(false);
    }
  };

  return (
    <div className="wrap max-w-3xl py-10">
      <h1 className="section-title">Edit studio</h1>
      <p className="section-sub mb-6">Update the details creators see on your listing.</p>
      <StudioForm initial={studio} user={{ name: studio.ownerName, email: studio.ownerEmail }} onSubmit={save} submitLabel="Save changes" busy={busy} />
    </div>
  );
}

export default function EditStudio() {
  return <RequireAuth><Inner /></RequireAuth>;
}
