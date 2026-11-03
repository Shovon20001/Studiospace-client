"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";

function passwordProblem(p) {
  if (p.length < 6) return "Password must be at least 6 characters.";
  if (!/[A-Z]/.test(p)) return "Password must include an uppercase letter.";
  if (!/[a-z]/.test(p)) return "Password must include a lowercase letter.";
  return "";
}

export default function Register() {
  const router = useRouter();
  const [f, setF] = useState({ name: "", email: "", image: "", password: "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setErrors({ ...errors, [k]: "" }); };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (f.name.trim().length < 2) next.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) next.email = "Enter a valid email address.";
    if (f.image && !/^https?:\/\//i.test(f.image)) next.image = "Photo URL must start with http:// or https://";
    const pw = passwordProblem(f.password);
    if (pw) next.password = pw;
    if (Object.keys(next).length) {
      setErrors(next);
      return toast.error(Object.values(next)[0]);
    }
    setBusy(true);
    const { error } = await authClient.signUp.email({ name: f.name.trim(), email: f.email, password: f.password, image: f.image || undefined });
    if (error) {
      toast.error(error.message || "Could not create your account.");
      setErrors({ form: error.message || "Could not create your account." });
      return setBusy(false);
    }
    toast.success("Account created. Log in to get started.");
    router.push("/login");
  };

  const google = async () => {
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: "/" });
    if (error) toast.error("Google sign-in is unavailable right now.");
  };

  const Err = ({ k }) => (errors[k] ? <span role="alert" className="mt-1 text-sm text-error">{errors[k]}</span> : null);

  return (
    <div className="wrap grid min-h-[75vh] place-items-center py-12">
      <div className="w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-extrabold">Create your account</h1>
        <p className="mt-1 text-base-content/70">Join creators and hosts on StudioSpace.</p>
        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          <label className="form-control"><span className="label-text mb-1 font-medium">Name</span><input className="field" autoComplete="name" value={f.name} onChange={set("name")} /><Err k="name" /></label>
          <label className="form-control"><span className="label-text mb-1 font-medium">Email</span><input type="email" className="field" autoComplete="email" value={f.email} onChange={set("email")} /><Err k="email" /></label>
          <label className="form-control"><span className="label-text mb-1 font-medium">Photo URL</span><input className="field" placeholder="https://..." value={f.image} onChange={set("image")} /><Err k="image" /></label>
          <label className="form-control"><span className="label-text mb-1 font-medium">Password</span><input type="password" className="field" autoComplete="new-password" value={f.password} onChange={set("password")} />
            {errors.password ? <Err k="password" /> : <span className="mt-1 text-xs text-base-content/60">At least 6 characters with an uppercase and a lowercase letter.</span>}</label>
          {errors.form && <p role="alert" className="rounded-lg bg-error/10 p-3 text-sm font-medium text-error">{errors.form}</p>}
          <button className="btn btn-primary w-full" disabled={busy}>{busy && <span className="loading loading-spinner loading-sm" />}Register</button>
        </form>
        <div className="divider text-sm">or</div>
        <button onClick={google} className="btn btn-outline w-full"><FcGoogle className="h-5 w-5" />Continue with Google</button>
        <p className="mt-6 text-center text-sm">Already have an account? <Link href="/login" className="link link-primary font-semibold">Login</Link></p>
      </div>
    </div>
  );
}
