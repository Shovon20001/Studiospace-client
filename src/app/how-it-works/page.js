import Link from "next/link";

export const metadata = { title: "How It Works" };

const GUESTS = [
  ["Search and compare", "Filter studios by category, price and area. Every card shows the rate, rating and location."],
  ["Check the slot", "Open a studio, choose a date and time. Hours that are already confirmed are shown before you send a request."],
  ["Send your request", "Your booking starts as Pending with the total cost and refundable deposit clearly listed."],
  ["Show up and create", "Once the host confirms, download your invoice and arrive ready. Review the space afterwards."],
];
const HOSTS = [
  ["List your space", "Add photos, amenities, your hourly rate and a deposit. It takes a few minutes."],
  ["Review requests", "See every request under My Bookings. Confirm or decline in one click."],
  ["No double bookings", "Two confirmed bookings can never overlap, so your calendar stays clean."],
  ["Get paid for idle hours", "Track confirmed earnings from your dashboard."],
];

function Col({ title, items }) {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-6">
      <h2 className="mb-4 text-2xl font-bold">{title}</h2>
      <ol className="space-y-5">
        {items.map(([h, t], i) => (
          <li key={h} className="flex gap-4">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary font-bold text-primary-content">{i + 1}</span>
            <div><h3 className="font-bold">{h}</h3><p className="text-sm text-base-content/70">{t}</p></div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <div className="wrap py-12">
      <h1 className="section-title">How StudioSpace works</h1>
      <p className="section-sub">One platform for the people who need a room and the people who have one.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-2"><Col title="For creators" items={GUESTS} /><Col title="For hosts" items={HOSTS} /></div>
      <div className="mt-10 flex flex-wrap gap-3"><Link href="/studios" className="btn btn-primary">Explore Studios</Link><Link href="/add-studio" className="btn btn-outline">Host Your Space</Link></div>
    </div>
  );
}
