import Link from "next/link";

export const metadata = { title: "About Us" };

export default function About() {
  const facts = [
    ["Our idea", "Great creative rooms sit empty most of the week while creators struggle to find one. StudioSpace connects the two with clear prices and live availability."],
    ["Who it is for", "Photographers, filmmakers, podcasters, musicians and makers who need a professional space for a few hours, and hosts who want to put theirs to work."],
    ["What we promise", "Transparent pricing, verified accounts, refundable deposits and a booking system that never lets two confirmed sessions collide."],
  ];
  return (
    <div className="wrap max-w-4xl py-12">
      <h1 className="section-title">About StudioSpace</h1>
      <p className="section-sub">A peer-to-peer marketplace for creative workspaces and production studios.</p>
      <div className="mt-8 space-y-4">
        {facts.map(([h, t]) => (
          <section key={h} className="rounded-2xl border border-base-300 bg-base-100 p-6"><h2 className="text-xl font-bold">{h}</h2><p className="mt-2 text-base-content/75">{t}</p></section>
        ))}
      </div>
      <Link href="/studios" className="btn btn-primary mt-8">Find a studio</Link>
    </div>
  );
}
