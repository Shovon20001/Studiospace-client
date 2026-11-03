"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { AMENITY_OPTIONS, CATEGORIES } from "@/lib/constants";
import SafeImg from "./SafeImg";

const empty = { title: "", category: "", hourlyRate: "", securityDeposit: "", maxCapacity: "", location: "", image: "", galleryText: "", amenities: [], overview: "" };

export default function StudioForm({ initial, user, onSubmit, submitLabel, busy }) {
  const [f, setF] = useState(() => initial ? { ...empty, ...initial, galleryText: (initial.gallery || []).filter((g) => g !== initial.image).join("\n") } : empty);
  const [custom, setCustom] = useState("");
  const [uploading, setUploading] = useState(false);
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const amenityList = [...new Set([...AMENITY_OPTIONS, ...f.amenities])];

  const toggleAmenity = (a) => setF((p) => ({ ...p, amenities: p.amenities.includes(a) ? p.amenities.filter((x) => x !== a) : [...p.amenities, a] }));
  const addCustom = () => {
    const v = custom.trim();
    if (!v) return;
    setF((p) => ({ ...p, amenities: p.amenities.includes(v) ? p.amenities : [...p.amenities, v] }));
    setCustom("");
  };

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
    if (!key) return toast.error("Image upload is not configured. Paste an image URL instead.");
    setUploading(true);
    try {
      const body = new FormData();
      body.append("image", file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body });
      const data = await res.json();
      if (!data.success) throw new Error();
      setF((p) => ({ ...p, image: data.data.url }));
      toast.success("Image uploaded.");
    } catch {
      toast.error("Upload failed. Check the file or paste an image URL.");
    } finally {
      setUploading(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (f.title.trim().length < 3) return toast.error("Studio title must be at least 3 characters.");
    if (!f.category) return toast.error("Choose a category.");
    if (!(Number(f.hourlyRate) > 0)) return toast.error("Hourly rate must be greater than 0.");
    if (!(Number(f.maxCapacity) >= 1)) return toast.error("Max capacity must be at least 1.");
    if (!f.location.trim()) return toast.error("Add the studio location.");
    if (!/^https?:\/\//i.test(f.image.trim())) return toast.error("Add an image URL or upload a photo.");
    if (f.overview.trim().length < 20) return toast.error("Write an overview of at least 20 characters.");
    const extra = f.galleryText.split("\n").map((s) => s.trim()).filter(Boolean);
    onSubmit({
      title: f.title, category: f.category, hourlyRate: Number(f.hourlyRate), securityDeposit: Number(f.securityDeposit || 0),
      maxCapacity: Number(f.maxCapacity), location: f.location, image: f.image.trim(),
      gallery: [f.image.trim(), ...extra], amenities: f.amenities, overview: f.overview,
    });
  };

  return (
    <form onSubmit={submit} className="space-y-6 rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="form-control sm:col-span-2">
          <span className="label-text mb-1 font-medium">Studio title</span>
          <input className="field" value={f.title} onChange={set("title")} placeholder="Northlight Cyc Wall Studio" />
        </label>
        <label className="form-control">
          <span className="label-text mb-1 font-medium">Category</span>
          <select className="select select-bordered w-full bg-base-100" value={f.category} onChange={set("category")}>
            <option value="" disabled>Select a category</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className="form-control">
          <span className="label-text mb-1 font-medium">Location / address</span>
          <input className="field" value={f.location} onChange={set("location")} placeholder="Gulshan 2, Dhaka" />
        </label>
        <label className="form-control">
          <span className="label-text mb-1 font-medium">Hourly rate ($)</span>
          <input type="number" min="1" className="field" value={f.hourlyRate} onChange={set("hourlyRate")} />
        </label>
        <label className="form-control">
          <span className="label-text mb-1 font-medium">Security deposit ($)</span>
          <input type="number" min="0" className="field" value={f.securityDeposit} onChange={set("securityDeposit")} />
        </label>
        <label className="form-control">
          <span className="label-text mb-1 font-medium">Max capacity (people)</span>
          <input type="number" min="1" className="field" value={f.maxCapacity} onChange={set("maxCapacity")} />
        </label>
        <div className="form-control">
          <span className="label-text mb-1 font-medium">Main image</span>
          <div className="flex gap-2">
            <input className="field" value={f.image} onChange={set("image")} placeholder="https://..." aria-label="Image URL" />
            <label className={`btn btn-outline ${uploading ? "btn-disabled" : ""}`}>
              {uploading ? <span className="loading loading-spinner loading-sm" /> : "Upload"}
              <input type="file" accept="image/*" className="hidden" onChange={upload} />
            </label>
          </div>
        </div>
      </div>

      {f.image && <SafeImg src={f.image} alt="Preview of the main studio image" className="aspect-[16/6] w-full rounded-xl object-cover" />}

      <label className="form-control">
        <span className="label-text mb-1 font-medium">More gallery images <span className="font-normal text-base-content/60">(one URL per line, optional)</span></span>
        <textarea className="field-area min-h-20" value={f.galleryText} onChange={set("galleryText")} />
      </label>

      <fieldset>
        <legend className="label-text mb-2 font-medium">Amenities</legend>
        <div className="flex flex-wrap gap-2">
          {amenityList.map((a) => (
            <label key={a} className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm transition ${f.amenities.includes(a) ? "border-primary bg-primary text-primary-content" : "border-base-300 hover:border-primary"}`}>
              <input type="checkbox" className="sr-only" checked={f.amenities.includes(a)} onChange={() => toggleAmenity(a)} />
              {a}
            </label>
          ))}
        </div>
        <div className="mt-3 flex max-w-sm gap-2">
          <input className="field input-sm" value={custom} onChange={(e) => setCustom(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }} placeholder="Add your own amenity" />
          <button type="button" onClick={addCustom} className="btn btn-outline btn-sm">Add</button>
        </div>
      </fieldset>

      <label className="form-control">
        <span className="label-text mb-1 font-medium">Detailed overview</span>
        <textarea className="field-area min-h-36" value={f.overview} onChange={set("overview")} placeholder="Describe the space, its size, lighting, rules and what makes it right for creators." />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="form-control">
          <span className="label-text mb-1 font-medium">Host name</span>
          <input className="field opacity-70" value={user?.name || ""} readOnly />
        </label>
        <label className="form-control">
          <span className="label-text mb-1 font-medium">Host email</span>
          <input className="field opacity-70" value={user?.email || ""} readOnly />
        </label>
      </div>

      <button className="btn btn-primary w-full sm:w-auto" disabled={busy || uploading}>
        {busy && <span className="loading loading-spinner loading-sm" />}{submitLabel}
      </button>
    </form>
  );
}
