"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/components/Providers";

export const safeRedirect = (r) => (r && r.startsWith("/") && !r.startsWith("//") ? r : "/");

export default function LoginForm() {
  const router = useRouter();
  const redirect = safeRedirect(useSearchParams().get("redirect"));
  const { user } = useAuth();
  const [f, setF] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (user) router.replace(redirect); }, [user, redirect, router]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!f.email || !f.password) return setError("Enter your email and password.");
    setBusy(true);
    const { error } = await authClient.signIn.email({ email: f.email, password: f.password });
    if (error) {
      const msg = "Invalid email or password. Check your details and try again.";
      setError(msg);
      toast.error(msg);
      return setBusy(false);
    }
    await fetch("/api/token");
    toast.success("Welcome back to StudioSpace.");
    router.push(redirect);
    router.refresh();
  };

  const google = async () => {
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: redirect });
    if (error) toast.error("Google sign-in is unavailable right now.");
  };

  return (
    <div className="wrap grid min-h-[75vh] place-items-center py-12">
      <div className="w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-extrabold">Log in to StudioSpace</h1>
        <p className="mt-1 text-base-content/70">Book spaces and manage your listings.</p>
        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          <label className="form-control"><span className="label-text mb-1 font-medium">Email</span>
            <input type="email" autoComplete="email" className="field" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
          <label className="form-control"><span className="label-text mb-1 font-medium">Password</span>
            <input type="password" autoComplete="current-password" className="field" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
          <div className="text-right">
            <button type="button" className="link link-primary text-sm" onClick={() => toast("Password reset is not available yet. Contact support to recover your account.")}>Forgot password?</button>
          </div>
          {error && <p role="alert" className="rounded-lg bg-error/10 p-3 text-sm font-medium text-error">{error}</p>}
          <button className="btn btn-primary w-full" disabled={busy}>{busy && <span className="loading loading-spinner loading-sm" />}Login</button>
        </form>
        <div className="divider text-sm">or</div>
        <button onClick={google} className="btn btn-outline w-full"><FcGoogle className="h-5 w-5" />Continue with Google</button>
        <p className="mt-6 text-center text-sm">New to StudioSpace? <Link href={`/register${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="link link-primary font-semibold">Create an account</Link></p>
      </div>
    </div>
  );
}
