export function LandSurveyIllustration({ className = "w-full h-auto" }: { className?: string }) {
  return (
    <svg
      width="600"
      height="400"
      viewBox="0 0 600 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background */}
      <defs>
        <linearGradient id="landGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E8F5E9" />
          <stop offset="100%" stopColor="#C8E6C9" />
        </linearGradient>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#BBDEFB" />
          <stop offset="100%" stopColor="#E3F2FD" />
        </linearGradient>
        <filter id="landShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#00000015" />
        </filter>
      </defs>

      {/* Sky */}
      <rect width="600" height="150" fill="url(#skyGradient)" />

      {/* Land */}
      <rect y="150" width="600" height="250" fill="url(#landGradient)" />

      {/* Land plot with boundary markers */}
      <g transform="translate(50, 180)">
        {/* Plot outline */}
        <path
          d="M0 0 L300 0 L400 100 L100 200 L0 0 Z"
          fill="#A5D6A7"
          stroke="#388E3C"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Boundary markers */}
        <circle cx="0" cy="0" r="6" fill="#F44336" stroke="#B71C1C" strokeWidth="2" />
        <circle cx="300" cy="0" r="6" fill="#F44336" stroke="#B71C1C" strokeWidth="2" />
        <circle cx="400" cy="100" r="6" fill="#F44336" stroke="#B71C1C" strokeWidth="2" />
        <circle cx="100" cy="200" r="6" fill="#F44336" stroke="#B71C1C" strokeWidth="2" />

        {/* Coordinates */}
        <text x="0" y="-10" fontSize="10" fill="#333" textAnchor="middle">
          A (0,0)
        </text>
        <text x="300" y="-10" fontSize="10" fill="#333" textAnchor="middle">
          B (300,0)
        </text>
        <text x="410" y="100" fontSize="10" fill="#333">
          C (400,100)
        </text>
        <text x="100" y="220" fontSize="10" fill="#333" textAnchor="middle">
          D (100,200)
        </text>

        {/* Area label */}
        <text x="200" y="80" fontSize="14" fill="#1B5E20" fontWeight="bold" textAnchor="middle">
          Площадь: 45 000 м²
        </text>

        {/* Dimensions */}
        <path d="M0 -20 L300 -20" stroke="#2196F3" strokeWidth="1" strokeDasharray="4,2" />
        <path d="M0 -25 L0 -15" stroke="#2196F3" strokeWidth="1" />
        <path d="M300 -25 L300 -15" stroke="#2196F3" strokeWidth="1" />
        <text x="150" y="-30" fontSize="10" fill="#0D47A1" textAnchor="middle">
          300 м
        </text>

        <path d="M420 0 L520 100" stroke="#2196F3" strokeWidth="1" strokeDasharray="4,2" />
        <path d="M415 0 L425 10" stroke="#2196F3" strokeWidth="1" />
        <path d="M515 90 L525 100" stroke="#2196F3" strokeWidth="1" />
        <text x="480" y="40" fontSize="10" fill="#0D47A1" textAnchor="middle">
          141 м
        </text>
      </g>

      {/* Surveyor with equipment */}
      <g transform="translate(480, 200)">
        {/* Tripod */}
        <path d="M0 80 L-20 30" stroke="#795548" strokeWidth="4" strokeLinecap="round" />
        <path d="M0 80 L20 30" stroke="#795548" strokeWidth="4" strokeLinecap="round" />
        <path d="M0 80 L0 30" stroke="#795548" strokeWidth="4" strokeLinecap="round" />

        {/* Instrument */}
        <circle cx="0" cy="25" r="10" fill="#455A64" />
        <rect x="-5" y="15" width="10" height="10" fill="#607D8B" />
        <circle cx="0" cy="15" r="3" fill="#FFC107" />

        {/* Surveyor */}
        <circle cx="30" cy="50" r="8" fill="#FFCCBC" />
        <rect x="25" y="58" width="10" height="20" fill="#1976D2" />
        <rect x="22" y="78" width="5" height="15" fill="#424242" />
        <rect x="33" y="78" width="5" height="15" fill="#424242" />
        <rect x="20" y="65" width="8" height="5" fill="#FFCCBC" />
        <path d="M30 45 Q35 40 40 45" fill="#5D4037" />
        <circle cx="27" cy="48" r="1" fill="#212121" />
        <circle cx="33" cy="48" r="1" fill="#212121" />
      </g>

      {/* Cadastral document */}
      <g transform="translate(100, 50)">
        {/* Document background */}
        <rect width="200" height="100" fill="white" stroke="#BDBDBD" strokeWidth="2" filter="url(#landShadow)" />

        {/* Document header */}
        <rect width="200" height="20" fill="#4CAF50" />
        <text x="100" y="15" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">
          МЕЖЕВОЙ ПЛАН
        </text>

        {/* Document content */}
        <line x1="10" y1="30" x2="190" y2="30" stroke="#EEEEEE" strokeWidth="1" />
        <line x1="10" y1="40" x2="190" y2="40" stroke="#EEEEEE" strokeWidth="1" />
        <line x1="10" y1="50" x2="190" y2="50" stroke="#EEEEEE" strokeWidth="1" />
        <line x1="10" y1="60" x2="190" y2="60" stroke="#EEEEEE" strokeWidth="1" />
        <line x1="10" y1="70" x2="190" y2="70" stroke="#EEEEEE" strokeWidth="1" />
        <line x1="10" y1="80" x2="190" y2="80" stroke="#EEEEEE" strokeWidth="1" />
        <line x1="10" y1="90" x2="190" y2="90" stroke="#EEEEEE" strokeWidth="1" />

        {/* Stamp */}
        <rect
          x="140"
          y="60"
          width="50"
          height="30"
          fill="none"
          stroke="#BDBDBD"
          strokeWidth="1"
          strokeDasharray="2,2"
        />
        <text x="165" y="75" fontSize="6" fill="#757575" textAnchor="middle">
          МЕСТО
        </text>
        <text x="165" y="82" fontSize="6" fill="#757575" textAnchor="middle">
          ДЛЯ ПЕЧАТИ
        </text>
      </g>

      {/* GPS satellites */}
      <g>
        <g transform="translate(150, 30)">
          <rect x="-5" y="-5" width="10" height="10" fill="#FFC107" />
          <circle cx="0" cy="0" r="3" fill="#FF9800" />
          <path d="M-10 0 L-5 0 M5 0 L10 0 M0 -10 L0 -5 M0 5 L0 10" stroke="#FF9800" strokeWidth="1" />
        </g>

        <g transform="translate(350, 40)">
          <rect x="-5" y="-5" width="10" height="10" fill="#FFC107" />
          <circle cx="0" cy="0" r="3" fill="#FF9800" />
          <path d="M-10 0 L-5 0 M5 0 L10 0 M0 -10 L0 -5 M0 5 L0 10" stroke="#FF9800" strokeWidth="1" />
        </g>

        <g transform="translate(500, 60)">
          <rect x="-5" y="-5" width="10" height="10" fill="#FFC107" />
          <circle cx="0" cy="0" r="3" fill="#FF9800" />
          <path d="M-10 0 L-5 0 M5 0 L10 0 M0 -10 L0 -5 M0 5 L0 10" stroke="#FF9800" strokeWidth="1" />
        </g>

        {/* GPS signals */}
        <path d="M150 30 L480 200" stroke="#FFC107" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
        <path d="M350 40 L480 200" stroke="#FFC107" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
        <path d="M500 60 L480 200" stroke="#FFC107" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
      </g>

      {/* Neighbors' plots */}
      <g opacity="0.5">
        <path
          d="M50 180 L-50 180 L-50 280 L50 380 L50 180"
          fill="#C5E1A5"
          stroke="#7CB342"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <text x="0" y="280" fontSize="10" fill="#33691E" textAnchor="middle">
          Соседний участок
        </text>

        <path
          d="M350 180 L450 180 L500 280 L450 380 L350 280 L350 180"
          fill="#C5E1A5"
          stroke="#7CB342"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <text x="425" y="280" fontSize="10" fill="#33691E" textAnchor="middle">
          Соседний участок
        </text>
      </g>

      {/* Title */}
      <text x="300" y="30" fontSize="20" fill="#2E7D32" fontWeight="bold" textAnchor="middle">
        Межевание земельного участка
      </text>

      {/* Cadastral number */}
      <text x="300" y="370" fontSize="14" fill="#1B5E20" fontWeight="bold" textAnchor="middle">
        Кадастровый номер: 50:21:0000000:12345
      </text>

      {/* Process arrows */}
      <g>
        <path d="M200 100 Q250 120 300 100" stroke="#2E7D32" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#2E7D32" />
          </marker>
        </defs>
        <text x="250" y="130" fontSize="10" fill="#2E7D32" textAnchor="middle">
          Регистрация в ЕГРН
        </text>
      </g>

      {/* Legend */}
      <g transform="translate(450, 330)">
        <rect width="140" height="60" fill="white" opacity="0.8" rx="5" />
        <text x="5" y="15" fontSize="10" fill="#333" fontWeight="bold">
          Условные обозначения:
        </text>
        <circle cx="10" cy="30" r="4" fill="#F44336" />
        <text x="20" y="33" fontSize="8" fill="#333">
          Поворотные точки границ
        </text>
        <rect x="5" y="40" width="8" height="8" fill="#A5D6A7" stroke="#388E3C" strokeWidth="1" />
        <text x="20" y="48" fontSize="8" fill="#333">
          Земельный участок
        </text>
      </g>
    </svg>
  )
}
