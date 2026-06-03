import React from "react";

interface IconProps {
  className?: string;
}

export function GithubIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

export function MRLogo() {
  return (
    <div className="w-[26px] h-[26px] bg-mr-blue rounded-[6px] flex items-center justify-center text-white font-bold text-[12px] tracking-[-0.4px] font-space shadow-[inset_0_1px_0_rgba(255,255,255,0.22),_0_1px_0_rgba(0,0,0,0.3)]">
      MR
    </div>
  );
}

interface MRTagProps {
  children: React.ReactNode;
  accent?: boolean;
}

export function MRTag({ children, accent }: MRTagProps) {
  return (
    <span className={`mono text-[11px] tracking-[0.4px] px-[8px] py-[3px] rounded-full border lowercase leading-[1.4] whitespace-nowrap ${
      accent
        ? "border-mr-blue-ring bg-mr-blue-soft text-[#93c5fd]"
        : "border-mr-border bg-transparent text-mr-muted"
    }`}>
      {children}
    </span>
  );
}

interface MRDotProps {
  live?: boolean;
}

export function MRDot({ live }: MRDotProps) {
  return (
    <span
      className="inline-block w-[7px] h-[7px] rounded-full shrink-0"
      style={{
        background: live ? "#22c55e" : "#eab308",
        boxShadow: live
          ? "0 0 0 3px rgba(34,197,94,0.18)"
          : "0 0 0 3px rgba(234,179,8,0.18)",
      }}
    />
  );
}

interface StatusPillProps {
  status: "live" | "beta";
}

export function StatusPill({ status }: StatusPillProps) {
  const live = status === "live";
  return (
    <span className={`inline-flex items-center gap-[6px] px-[9px] py-[3px] rounded-full border text-[11px] font-mono tracking-[0.8px] uppercase ${
      live
        ? "bg-[rgba(34,197,94,0.12)] border-[rgba(34,197,94,0.35)] text-[#86efac]"
        : "bg-[rgba(234,179,8,0.12)] border-[rgba(234,179,8,0.35)] text-[#fde047]"
    }`}>
      <span className="w-[6px] h-[6px] rounded-full bg-current" />
      {status}
    </span>
  );
}
