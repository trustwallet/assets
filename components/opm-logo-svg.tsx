"use client"

export function OPMLogoSVG({ size = 200, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer ring */}
      <circle cx="100" cy="100" r="95" fill="url(#goldGradient)" />
      <circle cx="100" cy="100" r="90" fill="url(#goldGradientDark)" />

      {/* Inner decorative ring */}
      <circle cx="100" cy="100" r="82" fill="none" stroke="url(#goldGradient)" strokeWidth="2" />
      <circle cx="100" cy="100" r="78" fill="none" stroke="url(#goldGradientLight)" strokeWidth="1" />

      {/* Top text arc - ONEPREMIUM */}
      <path id="topArc" d="M 30 100 A 70 70 0 0 1 170 100" fill="none" />
      <text fill="url(#goldGradientText)" fontSize="14" fontWeight="bold" fontFamily="serif" letterSpacing="4">
        <textPath href="#topArc" startOffset="50%" textAnchor="middle">
          ONEPREMIUM
        </textPath>
      </text>

      {/* Bottom text arc - OPM */}
      <path id="bottomArc" d="M 45 115 A 55 55 0 0 0 155 115" fill="none" />
      <text fill="url(#goldGradientText)" fontSize="16" fontWeight="bold" fontFamily="serif" letterSpacing="6">
        <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
          OPM
        </textPath>
      </text>

      {/* Center circle background */}
      <circle cx="100" cy="100" r="55" fill="url(#goldGradientCenter)" />
      <circle cx="100" cy="100" r="52" fill="url(#goldGradientDark)" />

      {/* Center O letter */}
      <text
        x="100"
        y="115"
        textAnchor="middle"
        fill="url(#goldGradientText)"
        fontSize="60"
        fontWeight="bold"
        fontFamily="serif"
      >
        O
      </text>

      {/* Decorative dots */}
      <circle cx="35" cy="100" r="3" fill="url(#goldGradientLight)" />
      <circle cx="165" cy="100" r="3" fill="url(#goldGradientLight)" />

      {/* Gradient definitions */}
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4A84B" />
          <stop offset="50%" stopColor="#C9963C" />
          <stop offset="100%" stopColor="#B8862D" />
        </linearGradient>
        <linearGradient id="goldGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9963C" />
          <stop offset="50%" stopColor="#B8862D" />
          <stop offset="100%" stopColor="#A67625" />
        </linearGradient>
        <linearGradient id="goldGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E5C06A" />
          <stop offset="50%" stopColor="#D4A84B" />
          <stop offset="100%" stopColor="#C9963C" />
        </linearGradient>
        <linearGradient id="goldGradientText" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A67625" />
          <stop offset="50%" stopColor="#8B6320" />
          <stop offset="100%" stopColor="#70501A" />
        </linearGradient>
        <linearGradient id="goldGradientCenter" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4A84B" />
          <stop offset="100%" stopColor="#C9963C" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export { OPMLogoSVG as OPMLogo }
