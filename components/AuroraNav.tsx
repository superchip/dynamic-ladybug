"use client";

type Props = {
  page: "home" | "history";
  onNav: (target: "home" | "history") => void;
};

export default function AuroraNav({ page, onNav }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 28px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 8,
            background: "radial-gradient(120% 120% at 30% 25%, #ff6a8b, #c93cff 60%, #4a23a8)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 14px rgba(201,60,255,0.45)",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 15,
            letterSpacing: -0.1,
            color: "var(--fg)",
          }}
        >
          Lady&nbsp;Bug
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: 4,
          padding: 4,
          borderRadius: 999,
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid var(--hairline)",
        }}
      >
        {(["Today", "History"] as const).map((t, i) => {
          const target = i === 0 ? "home" : "history";
          const active = page === target;
          return (
            <button
              key={t}
              onClick={() => onNav(target)}
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                border: "none",
                background: active ? "rgba(255,255,255,0.14)" : "transparent",
                color: active ? "var(--fg)" : "var(--fg-dim)",
                fontFamily: "var(--font-text)",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}
