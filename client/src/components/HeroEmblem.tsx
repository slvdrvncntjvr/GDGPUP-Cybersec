import logo from "./GDGCybersec-Assets/Cybersec_transparent.png";

/**
 * Hero centerpiece — the green cybersec emblem floating inside a soft glow and
 * slow orbital rings. Keeps the floating-logo concept in a modern, layered look.
 */
export default function HeroEmblem() {
  return (
    <div className="relative mx-auto flex aspect-square w-56 items-center justify-center sm:w-64 md:w-72">
      {/* Layered glow */}
      <div
        className="pointer-events-none absolute inset-[14%] -z-10 rounded-full bg-primary/15 blur-[55px] animate-pulse-glow"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-[20%] -z-10 rounded-full bg-cyber-blue/10 blur-[45px] animate-pulse-glow"
        style={{ animationDelay: "0.6s" }}
        aria-hidden
      />

      {/* Orbital rings */}
      <div
        className="absolute inset-[4%] rounded-full border border-primary/15 animate-spin-slow"
        aria-hidden
      />
      <div
        className="absolute inset-[11%] rounded-full border border-dashed border-primary/10 animate-spin-slow-reverse"
        aria-hidden
      />

      {/* Emblem */}
      <div className="relative z-10 animate-float">
        <img
          src={logo}
          alt="GDG PUP Cybersecurity"
          className="h-48 w-48 object-contain drop-shadow-[0_0_28px_hsl(var(--primary)/0.45)] sm:h-56 sm:w-56 md:h-60 md:w-60"
          draggable={false}
        />
      </div>
    </div>
  );
}
