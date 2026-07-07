export function ChakraIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="50" cy="50" r="45" />
      <circle cx="50" cy="50" r="8" fill="currentColor" />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i * 15 * Math.PI) / 180;
        const x2 = 50 + Math.cos(a) * 43;
        const y2 = 50 + Math.sin(a) * 43;
        return <line key={i} x1="50" y1="50" x2={x2} y2={y2} strokeWidth="1.2" />;
      })}
    </svg>
  );
}
