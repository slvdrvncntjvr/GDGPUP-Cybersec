import { useEffect, useRef, useState } from "react";

export default function Shield3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);
      setMousePos({ x: x * 15, y: -y * 15 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-lg aspect-square flex items-center justify-center"
      style={{ perspective: "1200px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style>{`
        @keyframes float3dAdvanced {
          0%, 100% { transform: translateY(0px) translateZ(0px); }
          25% { transform: translateY(-12px) translateZ(10px); }
          50% { transform: translateY(-6px) translateZ(5px); }
          75% { transform: translateY(-18px) translateZ(15px); }
        }
        
        @keyframes glowIntense {
          0%, 100% { 
            filter: drop-shadow(0 0 25px rgba(34, 197, 94, 0.5)) 
                    drop-shadow(0 0 50px rgba(34, 197, 94, 0.3))
                    drop-shadow(0 0 75px rgba(34, 197, 94, 0.1));
          }
          50% { 
            filter: drop-shadow(0 0 35px rgba(34, 197, 94, 0.7)) 
                    drop-shadow(0 0 70px rgba(34, 197, 94, 0.4))
                    drop-shadow(0 0 100px rgba(34, 197, 94, 0.2));
          }
        }
        
        @keyframes orbitSlow { 
          from { transform: rotate(0deg) translateX(140px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(140px) rotate(-360deg); }
        }
        
        @keyframes orbitMedium { 
          from { transform: rotate(45deg) translateX(110px) rotate(-45deg); }
          to { transform: rotate(405deg) translateX(110px) rotate(-405deg); }
        }
        
        @keyframes orbitFast { 
          from { transform: rotate(180deg) translateX(90px) rotate(-180deg); }
          to { transform: rotate(-180deg) translateX(90px) rotate(180deg); }
        }
        
        @keyframes ringPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        
        @keyframes checkDraw {
          0% { stroke-dashoffset: 50; }
          100% { stroke-dashoffset: 0; }
        }
        
        @keyframes hexFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-15px) rotate(30deg); opacity: 0.7; }
        }
        
        .shield-advanced {
          animation: float3dAdvanced 5s ease-in-out infinite, glowIntense 3s ease-in-out infinite;
          transform-style: preserve-3d;
          transition: transform 0.15s ease-out;
        }
        
        .orbit-1 { animation: orbitSlow 20s linear infinite; }
        .orbit-2 { animation: orbitMedium 15s linear infinite; }
        .orbit-3 { animation: orbitFast 10s linear infinite reverse; }
        
        .ring-pulse { animation: ringPulse 4s ease-in-out infinite; }
        
        .check-animate {
          stroke-dasharray: 50;
          animation: checkDraw 1s ease-out 0.5s forwards;
          stroke-dashoffset: 50;
        }
        
        .hex-float { animation: hexFloat 4s ease-in-out infinite; }
      `}</style>

      <div className="absolute w-80 h-80 rounded-full bg-primary/8 blur-[80px] animate-pulse" />
      <div className="absolute w-60 h-60 rounded-full bg-primary/15 blur-[50px] animate-pulse" style={{ animationDelay: "0.5s" }} />

      <div className="absolute w-72 h-72 rounded-full border border-primary/10 ring-pulse" />
      <div className="absolute w-80 h-80 rounded-full border border-primary/5 ring-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute w-88 h-88 rounded-full border border-primary/3 ring-pulse" style={{ animationDelay: "2s" }} />

      <div
        className="shield-advanced"
        style={{
          transform: `rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <svg
          viewBox="0 0 220 250"
          className="w-64 h-64 md:w-80 md:h-80"
          style={{ transformStyle: "preserve-3d" }}
        >
          <defs>
            <linearGradient id="shieldMain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(152, 80%, 55%)" />
              <stop offset="50%" stopColor="hsl(152, 76%, 45%)" />
              <stop offset="100%" stopColor="hsl(152, 72%, 32%)" />
            </linearGradient>
            
            <linearGradient id="shieldInner" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(152, 85%, 60%)" />
              <stop offset="100%" stopColor="hsl(152, 75%, 40%)" />
            </linearGradient>
            
            <linearGradient id="shieldGloss" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0.5" />
              <stop offset="40%" stopColor="white" stopOpacity="0.1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            
            <linearGradient id="rimGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(152, 90%, 70%)" />
              <stop offset="50%" stopColor="hsl(152, 80%, 50%)" />
              <stop offset="100%" stopColor="hsl(152, 70%, 35%)" />
            </linearGradient>

            <filter id="shieldGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.13  0 0 0 0 0.77  0 0 0 0 0.37  0 0 0 1 0" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            <filter id="innerShadow">
              <feOffset dx="0" dy="4" />
              <feGaussianBlur stdDeviation="4" result="offset-blur" />
              <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
              <feFlood floodColor="black" floodOpacity="0.4" result="color" />
              <feComposite operator="in" in="color" in2="inverse" result="shadow" />
              <feComposite operator="over" in="shadow" in2="SourceGraphic" />
            </filter>
          </defs>
          
          <ellipse cx="110" cy="225" rx="45" ry="8" fill="hsl(200, 25%, 5%)" opacity="0.7">
            <animate attributeName="rx" values="45;50;45" dur="5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0.4;0.7" dur="5s" repeatCount="indefinite" />
          </ellipse>
          
          <g transform="translate(110, 110)" filter="url(#shieldGlow)">
            <path
              d="M0,-85 L70,-58 L70,22 C70,62 38,85 0,102 C-38,85 -70,62 -70,22 L-70,-58 Z"
              fill="url(#shieldMain)"
              stroke="url(#rimGradient)"
              strokeWidth="4"
            />
            
            <path
              d="M0,-75 L60,-52 L60,18 C60,52 32,72 0,88 C-32,72 -60,52 -60,18 L-60,-52 Z"
              fill="url(#shieldInner)"
              opacity="0.9"
            />
            
            <path
              d="M0,-70 L50,-48 L50,12 C50,42 28,60 0,74 C-28,60 -50,42 -50,12 L-50,-48 Z"
              fill="url(#shieldGloss)"
              opacity="0.6"
            />
            
            <path
              d="M-25,-60 L-25,-45 L-40,-45"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              opacity="0.4"
              strokeLinecap="round"
            />
            <path
              d="M40,-55 L40,-42"
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.2"
              strokeLinecap="round"
            />
            
            <g filter="url(#innerShadow)">
              <path
                d="M-20,8 L-5,23 L28,-12"
                fill="none"
                stroke="white"
                strokeWidth="9"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="check-animate"
              />
            </g>
            
            <circle cx="0" cy="-60" r="3" fill="white" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="orbit-1">
          <div className="w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/50" />
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="orbit-2">
          <div className="w-2 h-2 rounded-full bg-cyber-blue/80" />
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="orbit-3">
          <div className="w-2.5 h-2.5 rounded-full bg-primary/60" />
        </div>
      </div>

      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/40 hex-float"
          style={{
            top: `${15 + Math.random() * 70}%`,
            left: `${10 + Math.random() * 80}%`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}

      <svg className="absolute top-8 left-12 w-6 h-6 text-primary/30 hex-float" viewBox="0 0 24 24" style={{ animationDelay: "0.3s" }}>
        <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" fill="currentColor" />
      </svg>
      <svg className="absolute bottom-20 right-8 w-5 h-5 text-cyber-blue/25 hex-float" viewBox="0 0 24 24" style={{ animationDelay: "1.2s" }}>
        <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" fill="currentColor" />
      </svg>
      <svg className="absolute top-1/3 right-4 w-4 h-4 text-primary/20 hex-float" viewBox="0 0 24 24" style={{ animationDelay: "2s" }}>
        <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" fill="currentColor" />
      </svg>
    </div>
  );
}
