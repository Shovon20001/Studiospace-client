import Link from "next/link";
import { TbAperture } from "react-icons/tb";

export default function EmptyState({ title, text, cta, href, onClick }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-base-300 bg-base-100 px-6 py-14 text-center">
      <TbAperture className="mb-4 h-12 w-12 text-primary/60" />
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 text-base-content/70">{text}</p>
      {cta && (href ? <Link href={href} className="btn btn-primary mt-6">{cta}</Link> : <button onClick={onClick} className="btn btn-primary mt-6">{cta}</button>)}
    </div>
  );
}
