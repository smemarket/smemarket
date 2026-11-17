/** Re-mounts on every navigation, so each page eases in instead of appearing instantly. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-[pageIn_.6s_cubic-bezier(.16,1,.3,1)_both]">{children}</div>;
}
