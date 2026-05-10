import logo from "./GDGCybersec-Assets/Cybersec_transparent.png";

/** Animated hero emblem — subtle float + layered glow (no layout jitter). */
export default function Shield3D() {
  return (
    <div className="relative w-full max-w-lg mx-auto flex items-center justify-center aspect-square">
      {/* Static outer rings for depth */}
      <div
        className="absolute inset-[10%] rounded-full border border-primary/15 animate-pulse"
        aria-hidden
      />
      <div
        className="absolute inset-[6%] rounded-full border border-primary/10 opacity-70"
        style={{ animationDelay: "0.4s" }}
        aria-hidden
      />

      <div
        className="absolute inset-[14%] rounded-full bg-primary/15 blur-[50px] animate-pulse-glow"
        aria-hidden
      />
      <div
        className="absolute inset-[18%] rounded-full bg-cyber-blue/10 blur-[40px] animate-pulse-glow"
        style={{ animationDelay: "0.6s" }}
        aria-hidden
      />

      <div className="relative z-10 animate-float">
        <img
          src={logo}
          alt="GDG PUP Cybersecurity"
          className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 object-contain drop-shadow-[0_0_28px_hsl(var(--primary)/0.45)]"
        />
      </div>
    </div>
  );
}
