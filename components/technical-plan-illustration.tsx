export function TechnicalPlanIllustration({ className = "w-full h-auto" }: { className?: string }) {
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
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F8F9FA" />
          <stop offset="100%" stopColor="#E9ECEF" />
        </linearGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#00000015" />
        </filter>
      </defs>

      <rect width="600" height="400" fill="url(#bgGradient)" />

      {/* Building/House */}
      <g transform="translate(50, 150)">
        {/* Foundation */}
        <rect x="0" y="180" width="200" height="20" fill="#8D6E63" />

        {/* Walls */}
        <rect x="10" y="80" width="180" height="100" fill="#FFCC80" stroke="#FF8F00" strokeWidth="2" />

        {/* Roof */}
        <path d="M0 80 L100 20 L200 80 Z" fill="#D32F2F" stroke="#B71C1C" strokeWidth="2" />

        {/* Door */}
        <rect x="85" y="130" width="30" height="50" fill="#8D6E63" stroke="#5D4037" strokeWidth="1" />
        <circle cx="108" cy="155" r="2" fill="#FFD54F" />

        {/* Windows */}
        <rect x="30" y="110" width="25" height="25" fill="#81D4FA" stroke="#0277BD" strokeWidth="1" />
        <path d="M42.5 110 L42.5 135 M30 122.5 L55 122.5" stroke="#0277BD" strokeWidth="1" />

        <rect x="145" y="110" width="25" height="25" fill="#81D4FA" stroke="#0277BD" strokeWidth="1" />
        <path d="M157.5 110 L157.5 135 M145 122.5 L170 122.5" stroke="#0277BD" strokeWidth="1" />

        {/* Chimney */}
        <rect x="140" y="30" width="15" height="30" fill="#8D6E63" stroke="#5D4037" strokeWidth="1" />
      </g>

      {/* Measurement lines and dimensions */}
      <g stroke="#E91E63" strokeWidth="2" fill="none">
        {/* Building width */}
        <path d="M60 320 L240 320" />
        <path d="M60 315 L60 325" />
        <path d="M240 315 L240 325" />
        <text x="150" y="340" fontSize="12" fill="#E91E63" textAnchor="middle" fontWeight="bold">
          18.0 м
        </text>

        {/* Building height */}
        <path d="M270 230 L270 170" />
        <path d="M265 230 L275 230" />
        <path d="M265 170 L275 170" />
        <text x="285" y="205" fontSize="12" fill="#E91E63" fontWeight="bold">
          6.0 м
        </text>

        {/* Room dimensions */}
        <path d="M70 200 L130 200" strokeDasharray="3,3" />
        <text x="100" y="195" fontSize="10" fill="#E91E63" textAnchor="middle">
          6.0 м
        </text>
      </g>

      {/* Technical plan document */}
      <g transform="translate(320, 80)">
        {/* Document background */}
        <rect
          x="0"
          y="0"
          width="250"
          height="300"
          fill="white"
          stroke="#DEE2E6"
          strokeWidth="2"
          filter="url(#shadow)"
        />

        {/* Header */}
        <rect x="0" y="0" width="250" height="40" fill="#2196F3" />
        <text x="125" y="25" fontSize="14" fill="white" textAnchor="middle" fontWeight="bold">
          ТЕХНИЧЕСКИЙ ПЛАН
        </text>

        {/* Content sections */}
        <text x="15" y="65" fontSize="12" fill="#333" fontWeight="bold">
          1. Общие сведения об объекте
        </text>
        <rect x="15" y="70" width="220" height="2" fill="#E3F2FD" />

        <text x="20" y="90" fontSize="10" fill="#666">
          Назначение: жилой дом
        </text>
        <text x="20" y="105" fontSize="10" fill="#666">
          Этажность: 1 этаж
        </text>
        <text x="20" y="120" fontSize="10" fill="#666">
          Площадь: 108.0 м²
        </text>

        <text x="15" y="145" fontSize="12" fill="#333" fontWeight="bold">
          2. Поэтажный план
        </text>
        <rect x="15" y="150" width="220" height="2" fill="#E3F2FD" />

        {/* Mini floor plan */}
        <g transform="translate(20, 160)">
          <rect x="0" y="0" width="80" height="60" fill="none" stroke="#666" strokeWidth="1" />
          <rect x="10" y="10" width="25" height="20" fill="none" stroke="#999" strokeWidth="0.5" />
          <rect x="45" y="10" width="25" height="20" fill="none" stroke="#999" strokeWidth="0.5" />
          <rect x="10" y="35" width="60" height="20" fill="none" stroke="#999" strokeWidth="0.5" />
          <text x="22" y="22" fontSize="8" fill="#666">
            Спальня
          </text>
          <text x="52" y="22" fontSize="8" fill="#666">
            Кухня
          </text>
          <text x="35" y="47" fontSize="8" fill="#666">
            Гостиная
          </text>
        </g>

        <text x="15" y="240" fontSize="12" fill="#333" fontWeight="bold">
          3. Экспликация помещений
        </text>
        <rect x="15" y="245" width="220" height="2" fill="#E3F2FD" />

        <text x="20" y="265" fontSize="10" fill="#666">
          1. Спальня - 18.5 м²
        </text>
        <text x="20" y="280" fontSize="10" fill="#666">
          2. Кухня - 12.0 м²
        </text>
        <text x="20" y="295" fontSize="10" fill="#666">
          3. Гостиная - 35.2 м²
        </text>

        {/* Stamp area */}
        <rect x="150" y="320" width="80" height="50" fill="none" stroke="#999" strokeWidth="1" strokeDasharray="2,2" />
        <text x="190" y="340" fontSize="8" fill="#999" textAnchor="middle">
          Место для
        </text>
        <text x="190" y="350" fontSize="8" fill="#999" textAnchor="middle">
          печати
        </text>
      </g>

      {/* Surveyor with equipment */}
      <g transform="translate(80, 50)">
        {/* Surveyor */}
        <circle cx="0" cy="0" r="8" fill="#FFDBCB" />
        <rect x="-6" y="8" width="12" height="20" fill="#2196F3" />
        <rect x="-8" y="12" width="6" height="8" fill="#FFDBCB" />
        <rect x="2" y="12" width="6" height="8" fill="#FFDBCB" />
        <rect x="-3" y="28" width="6" height="15" fill="#424242" />

        {/* Measuring tape */}
        <circle cx="8" cy="15" r="3" fill="#FFD54F" />
        <path d="M8 15 L25 25" stroke="#FFD54F" strokeWidth="2" />

        {/* Hard hat */}
        <path d="M-8 -3 Q0 -8 8 -3" fill="#FF9800" />
      </g>

      {/* Measurement tools */}
      <g transform="translate(400, 30)">
        {/* Laser measure */}
        <rect x="0" y="0" width="15" height="8" fill="#333" rx="2" />
        <rect x="2" y="2" width="11" height="4" fill="#4CAF50" />
        <circle cx="16" cy="4" r="1" fill="#F44336" />
        <path d="M17 4 L30 4" stroke="#F44336" strokeWidth="1" strokeDasharray="1,1" />

        <text x="0" y="20" fontSize="8" fill="#666">
          Лазерный дальномер
        </text>
      </g>

      {/* Arrows showing measurement process */}
      <g stroke="#4CAF50" strokeWidth="2" fill="#4CAF50">
        <path d="M250 200 Q280 180 320 200" fill="none" />
        <path d="M315 195 L320 200 L315 205" />

        <text x="285" y="185" fontSize="10" fill="#4CAF50" textAnchor="middle">
          Обмер
        </text>
      </g>

      {/* Title */}
      <text x="300" y="30" fontSize="18" fill="#1976D2" fontWeight="bold" textAnchor="middle">
        Изготовление технического плана
      </text>
      <text x="300" y="50" fontSize="12" fill="#666" textAnchor="middle">
        Точные обмеры • Поэтажные планы • Кадастровый учет
      </text>
    </svg>
  )
}
