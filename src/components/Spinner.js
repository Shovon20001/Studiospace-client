import { TbAperture } from "react-icons/tb";

export default function Spinner({ label = "Loading..." }) {
  return (
    <div className="grid min-h-[50vh] place-items-center" role="status">
      <div className="flex flex-col items-center gap-3">
        <TbAperture className="h-12 w-12 animate-spin text-primary [animation-duration:1.6s]" />
        <p className="text-sm text-base-content/60">{label}</p>
      </div>
    </div>
  );
}
