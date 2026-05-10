import logo from "./GDGCybersec-Assets/Cybersec_transparent.png";

/** Static hero graphic — avoids random layout and heavy motion from the prior 3D variant. */
export default function Shield3D() {
  return (
    <div className="relative w-full max-w-lg mx-auto flex items-center justify-center aspect-square">
      <div
        className="absolute inset-[12%] rounded-full bg-primary/10 blur-[60px]"
        aria-hidden
      />
      <img
        src={logo}
        alt="GDG PUP Cybersecurity"
        className="relative z-10 w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 object-contain drop-shadow-[0_0_24px_hsl(var(--primary)/0.35)]"
      />
    </div>
  );
}
