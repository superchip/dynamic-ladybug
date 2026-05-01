"use client";

type Props = {
  color?: string;
  intensity?: number;
  animated?: boolean;
};

export default function AuroraBackground({ color = "#7c5cff", intensity = 1, animated = true }: Props) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div
        className={animated ? "aurora-mesh" : ""}
        style={{
          position: "absolute",
          inset: "-20%",
          background: `
            radial-gradient(60% 50% at 22% 28%, ${color}55 0%, transparent 60%),
            radial-gradient(50% 60% at 78% 18%, ${color}3a 0%, transparent 65%),
            radial-gradient(70% 60% at 50% 90%, ${color}33 0%, transparent 70%),
            radial-gradient(40% 40% at 90% 65%, #1c4cff22 0%, transparent 70%)
          `,
          filter: "blur(40px)",
          opacity: intensity,
          animation: animated ? "aurora-shift 24s ease-in-out infinite" : "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/><feColorMatrix values=%220 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.06 0%22/></filter><rect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22/></svg>')",
          opacity: 0.5,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}
