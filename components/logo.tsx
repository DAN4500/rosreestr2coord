export function GeodesicLogo({ className = "h-12 w-auto" }: { className?: string }) {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Circle background */}
      <circle cx="100" cy="100" r="90" fill="white" stroke="#2563eb" strokeWidth="4" />

      {/* Surveying tool icon */}
      <g transform="translate(50, 40) scale(0.9)">
        {/* Tripod */}
        <path d="M50 30L30 110" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" />
        <path d="M50 30L70 110" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" />
        <path d="M50 30L50 110" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" />

        {/* Surveying instrument */}
        <circle cx="50" cy="30" r="15" fill="#2563eb" />
        <circle cx="50" cy="30" r="8" fill="white" />
        <circle cx="50" cy="30" r="3" fill="#fb923c" />

        {/* Horizontal line */}
        <path d="M20 30L80 30" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  )
}
