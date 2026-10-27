'use client'

import React from 'react'

interface HangerIconProps {
  className?: string
}

/**
 * Cintre chromé et structure incurvée haute fidélité style showroom de mode
 */
export function HangerIcon({ className = 'w-44 h-16 text-neutral-800' }: HangerIconProps) {
  return (
    <svg
      viewBox="0 0 240 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Gradient pour le crochet en métal chromé brillant */}
        <linearGradient id="chromeHook" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#d1d5db" />
          <stop offset="50%" stopColor="#6b7280" />
          <stop offset="75%" stopColor="#9ca3af" />
          <stop offset="100%" stopColor="#374151" />
        </linearGradient>

        {/* Gradient pour le corps du cintre en bois laqué noir mat / noyer sombre */}
        <linearGradient id="hangerBody" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#111827" />
          <stop offset="30%" stopColor="#1f2937" />
          <stop offset="50%" stopColor="#374151" />
          <stop offset="70%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>

        {/* Ombre portée subtile sous le cintre */}
        <filter id="hangerShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Crochet métallique qui s'enroule autour de la barre */}
      <g filter="url(#hangerShadow)">
        {/* Anneau / courbe du crochet supérieur */}
        <path
          d="M 120 32 C 120 18, 136 12, 136 24 C 136 32, 118 34, 118 42"
          stroke="url(#chromeHook)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Embout sphérique chromé du crochet */}
        <circle cx="136" cy="24" r="3" fill="#f3f4f6" stroke="#4b5563" strokeWidth="1" />
      </g>

      {/* Base du col métallique fixée dans le bois */}
      <rect x="115.5" y="40" width="7" height="6" rx="1.5" fill="url(#chromeHook)" />

      {/* Corps incurvé du cintre (forme ergonomique épaules) */}
      <path
        d="M 12 78 C 65 60, 105 44, 119 44 C 133 44, 175 60, 228 78 C 230 80, 228 83, 224 82 C 175 68, 134 52, 119 52 C 104 52, 63 68, 16 82 C 12 83, 10 80, 12 78 Z"
        fill="url(#hangerBody)"
        stroke="#0f172a"
        strokeWidth="1.2"
        filter="url(#hangerShadow)"
      />

      {/* Barre transversale inférieure en métal fin */}
      <path
        d="M 28 76 L 212 76"
        stroke="url(#chromeHook)"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  )
}
