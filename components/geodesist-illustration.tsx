export function GeodesistIllustration({ className = "w-full h-auto" }: { className?: string }) {
  return (
    <svg
      width="600"
      height="400"
      viewBox="0 0 600 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background gradient */}
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E3F2FD" />
          <stop offset="100%" stopColor="#BBDEFB" />
        </linearGradient>
        <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C8E6C9" />
          <stop offset="100%" stopColor="#A5D6A7" />
        </linearGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#00000020" />
        </filter>
      </defs>

      {/* Sky */}
      <rect width="600" height="280" fill="url(#skyGradient)" />

      {/* Ground */}
      <rect x="0" y="280" width="600" height="120" fill="url(#groundGradient)" />

      {/* Mountains in background */}
      <path
        d="M0 200 L100 120 L200 160 L300 100 L400 140 L500 80 L600 120 L600 280 L0 280 Z"
        fill="#81C784"
        opacity="0.6"
      />

      {/* Modern surveyor with tablet */}
      <g transform="translate(80, 200)">
        {/* Body */}
        <rect x="20" y="50" width="25" height="45" fill="#2196F3" rx="5" />

        {/* Head */}
        <circle cx="32" cy="35" r="15" fill="#FFDBCB" />

        {/* Safety helmet */}
        <path d="M17 30 Q32 20 47 30 Q47 35 32 35 Q17 35 17 30" fill="#FF9800" />
        <rect x="30" y="25" width="4" height="8" fill="#FFC107" />

        {/* Face */}
        <circle cx="28" cy="33" r="1.5" fill="#333" />
        <circle cx="36" cy="33" r="1.5" fill="#333" />
        <path d="M30 38 Q32 40 34 38" stroke="#333" strokeWidth="1" fill="none" />

        {/* Arms */}
        <rect x="8" y="55" width="18" height="10" fill="#FFDBCB" rx="5" />
        <rect x="39" y="55" width="18" height="10" fill="#FFDBCB" rx="5" />

        {/* Legs */}
        <rect x="23" y="95" width="8" height="30" fill="#424242" />
        <rect x="33" y="95" width="8" height="30" fill="#424242" />

        {/* Tablet in hands */}
        <rect x="45" y="58" width="15" height="20" fill="#263238" rx="2" />
        <rect x="46" y="59" width="13" height="15" fill="#4CAF50" />
        <circle cx="52.5" cy="76" r="1" fill="#FFC107" />

        {/* Topographic lines on tablet screen */}
        <path d="M47 61 Q50 63 53 61 Q56 63 58 61" stroke="#2E7D32" strokeWidth="0.5" fill="none" />
        <path d="M47 64 Q52 66 58 64" stroke="#2E7D32" strokeWidth="0.5" fill="none" />
        <path d="M47 67 Q50 69 53 67 Q56 69 58 67" stroke="#2E7D32" strokeWidth="0.5" fill="none" />
        <circle cx="50" cy="65" r="0.5" fill="#F44336" />
        <circle cx="55" cy="68" r="0.5" fill="#F44336" />
      </g>

      {/* Modern GNSS/Total Station */}
      <g transform="translate(350, 180)">
        {/* Tripod */}
        <path d="M50 120L70 60" stroke="#616161" strokeWidth="6" strokeLinecap="round" />
        <path d="M50 120L30 60" stroke="#616161" strokeWidth="6" strokeLinecap="round" />
        <path d="M50 120L50 60" stroke="#616161" strokeWidth="6" strokeLinecap="round" />

        {/* Instrument base */}
        <circle cx="50" cy="55" r="12" fill="#37474F" />
        <circle cx="50" cy="55" r="8" fill="#546E7A" />

        {/* Telescope/Antenna */}
        <rect x="45" y="40" width="10" height="15" fill="#1976D2" rx="2" />
        <circle cx="50" cy="40" r="6" fill="#2196F3" />
        <circle cx="50" cy="40" r="3" fill="#64B5F6" />

        {/* Display screen */}
        <rect x="58" y="50" width="12" height="8" fill="#263238" rx="1" />
        <rect x="59" y="51" width="10" height="6" fill="#4CAF50" />

        {/* Signal waves */}
        <circle cx="50" cy="40" r="15" stroke="#2196F3" strokeWidth="1" fill="none" opacity="0.4" />
        <circle cx="50" cy="40" r="25" stroke="#2196F3" strokeWidth="1" fill="none" opacity="0.3" />
        <circle cx="50" cy="40" r="35" stroke="#2196F3" strokeWidth="1" fill="none" opacity="0.2" />
      </g>

      {/* Measurement points with coordinates */}
      <g>
        <circle cx="150" cy="320" r="4" fill="#F44336" />
        <text x="155" y="315" fontSize="10" fill="#333" fontWeight="bold">
          A (125.45, 67.89)
        </text>

        <circle cx="300" cy="340" r="4" fill="#F44336" />
        <text x="305" y="335" fontSize="10" fill="#333" fontWeight="bold">
          B (234.12, 45.67)
        </text>

        <circle cx="480" cy="310" r="4" fill="#F44336" />
        <text x="485" y="305" fontSize="10" fill="#333" fontWeight="bold">
          C (345.78, 89.23)
        </text>

        <circle cx="250" cy="300" r="4" fill="#F44336" />
        <text x="255" y="295" fontSize="10" fill="#333" fontWeight="bold">
          D (198.34, 78.56)
        </text>
      </g>

      {/* Measurement lines */}
      <path d="M150 320 L400 235" stroke="#FF5722" strokeWidth="2" strokeDasharray="5,5" opacity="0.7" />
      <path d="M300 340 L400 235" stroke="#FF5722" strokeWidth="2" strokeDasharray="5,5" opacity="0.7" />
      <path d="M480 310 L400 235" stroke="#FF5722" strokeWidth="2" strokeDasharray="5,5" opacity="0.7" />
      <path d="M250 300 L400 235" stroke="#FF5722" strokeWidth="2" strokeDasharray="5,5" opacity="0.7" />

      {/* Topographic contour lines */}
      <g opacity="0.6">
        <path
          d="M50 350 Q200 330 350 350 Q450 360 550 350"
          stroke="#4CAF50"
          strokeWidth="2"
          fill="none"
          strokeDasharray="3,3"
        />
        <path
          d="M30 370 Q180 350 330 370 Q430 380 530 370"
          stroke="#4CAF50"
          strokeWidth="2"
          fill="none"
          strokeDasharray="3,3"
        />
        <text x="520" y="345" fontSize="8" fill="#2E7D32">
          h=125m
        </text>
        <text x="500" y="365" fontSize="8" fill="#2E7D32">
          h=120m
        </text>
      </g>

      {/* Digital elements */}
      <g transform="translate(450, 50)">
        {/* Data cloud */}
        <ellipse cx="75" cy="40" rx="35" ry="20" fill="white" stroke="#2196F3" strokeWidth="2" />
        <text x="60" y="35" fontSize="8" fill="#1976D2" fontWeight="bold">
          CLOUD
        </text>
        <text x="58" y="45" fontSize="8" fill="#1976D2">
          DATA
        </text>

        {/* Data transfer lines */}
        <path
          d="M40 40 Q60 30 75 40"
          stroke="#2196F3"
          strokeWidth="2"
          fill="none"
          strokeDasharray="2,2"
          opacity="0.8"
        />
        <circle cx="35" cy="42" r="2" fill="#4CAF50" />
        <circle cx="30" cy="40" r="1" fill="#4CAF50" />
        <circle cx="25" cy="38" r="1" fill="#4CAF50" />
      </g>

      {/* GPS satellites */}
      <g>
        <g transform="translate(120, 60)">
          <rect x="-3" y="-8" width="6" height="16" fill="#FFD54F" />
          <rect x="-8" y="-3" width="16" height="6" fill="#FFD54F" />
          <circle cx="0" cy="0" r="3" fill="#FF8F00" />
          <text x="-15" y="-12" fontSize="8" fill="#333">
            GPS
          </text>
        </g>

        <g transform="translate(480, 40)">
          <rect x="-3" y="-8" width="6" height="16" fill="#FFD54F" />
          <rect x="-8" y="-3" width="16" height="6" fill="#FFD54F" />
          <circle cx="0" cy="0" r="3" fill="#FF8F00" />
        </g>

        <g transform="translate(320, 30)">
          <rect x="-3" y="-8" width="6" height="16" fill="#FFD54F" />
          <rect x="-8" y="-3" width="16" height="6" fill="#FFD54F" />
          <circle cx="0" cy="0" r="3" fill="#FF8F00" />
        </g>
      </g>

      {/* Signal lines from satellites */}
      <path d="M120 60 Q250 150 400 235" stroke="#FFD54F" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
      <path d="M480 40 Q440 140 400 235" stroke="#FFD54F" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
      <path d="M320 30 Q360 130 400 235" stroke="#FFD54F" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />

      {/* Title and accuracy indicator */}
      <g transform="translate(50, 30)">
        <text x="0" y="0" fontSize="18" fill="#1976D2" fontWeight="bold">
          Высокоточная топографическая съемка
        </text>
        <text x="0" y="20" fontSize="12" fill="#666">
          Точность: ±2 см • GNSS RTK • Цифровая обработка
        </text>
      </g>

      {/* Accuracy indicator */}
      <g transform="translate(500, 150)">
        <circle cx="0" cy="0" r="15" fill="#4CAF50" opacity="0.2" />
        <circle cx="0" cy="0" r="10" fill="#4CAF50" opacity="0.4" />
        <circle cx="0" cy="0" r="5" fill="#4CAF50" />
        <text x="-20" y="25" fontSize="8" fill="#2E7D32" fontWeight="bold">
          ±2 см
        </text>
      </g>
    </svg>
  )
}
