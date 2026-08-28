import React from 'react';
import { GameCharacter, TerritoryZone, WorldHouse } from '../../types';

interface GameMiniMapProps {
  player: GameCharacter;
  otherPlayers: GameCharacter[];
  houses: WorldHouse[];
  territories: TerritoryZone[];
  worldSize: number;
  onClose: () => void;
}

export function GameMiniMap({
  player,
  otherPlayers,
  houses,
  territories,
  worldSize = 2400,
  onClose,
}: GameMiniMapProps) {
  const mapWidth = 220;
  const scale = mapWidth / worldSize;

  return (
    <div translate="no" lang="en" className="notranslate absolute top-16 right-4 z-30 bg-slate-950/90 backdrop-blur-md border border-indigo-900/80 rounded-3xl p-3 shadow-2xl text-white select-none animate-in fade-in zoom-in-95 duration-150">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-xs">
        <span className="font-black text-sky-300 font-mono flex items-center gap-1.5">
          🗺️ PulseWorld Atlas
        </span>
        <button
          onClick={onClose}
          className="text-azure-200/60 hover:text-white text-xs px-1 cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Mini-Map Canvas / SVG View */}
      <div className="relative w-[220px] h-[220px] bg-slate-900 rounded-2xl border border-indigo-950/80 overflow-hidden shadow-inner">
        <svg viewBox="0 0 2400 2400" className="w-full h-full">
          
          {/* Background grid */}
          <rect x="0" y="0" width="2400" height="2400" fill="#090d16" />
          <path d="M 0 1200 L 2400 1200 M 1200 0 L 1200 2400" stroke="rgba(255,255,255,0.06)" strokeWidth="8" strokeDasharray="16 16" />

          {/* 4 Territory Safe Zone Radiuses */}
          {territories.map((t) => (
            <g key={t.id}>
              {/* Forcefield Area */}
              <circle
                cx={t.centerX}
                cy={t.centerY}
                r={t.radius}
                fill={t.color}
                fillOpacity="0.12"
                stroke={t.color}
                strokeWidth="6"
                strokeDasharray="12 12"
              />
              {/* Crystal Shrine Core */}
              <circle
                cx={t.centerX}
                cy={t.centerY}
                r="36"
                fill={t.color}
                fillOpacity="0.9"
              />
              {/* Label */}
              <text
                x={t.centerX}
                y={t.centerY + t.radius - 20}
                fill="#ffffff"
                fontSize="64"
                fontWeight="bold"
                textAnchor="middle"
                opacity="0.8"
              >
                {t.race}
              </text>
            </g>
          ))}

          {/* Player Houses */}
          {houses.map((h) => (
            <rect
              key={h.id}
              x={h.x - 18}
              y={h.y - 18}
              width="36"
              height="36"
              fill={h.owner_id === player.user_id ? '#38bdf8' : '#e2e8f0'}
              stroke="#0f172a"
              strokeWidth="4"
              rx="4"
            />
          ))}

          {/* Other Online Players */}
          {otherPlayers.map((other) => (
            <circle
              key={other.id || other.user_id}
              cx={other.x}
              cy={other.y}
              r="28"
              fill={
                other.race === 'Human'
                  ? '#38bdf8'
                  : other.race === 'Elf'
                  ? '#34d399'
                  : other.race === 'Dwarf'
                  ? '#fbbf24'
                  : '#f43f5e'
              }
              stroke="#ffffff"
              strokeWidth="4"
            />
          ))}

          {/* Current Local Player */}
          <g>
            <circle
              cx={player.x}
              cy={player.y}
              r="40"
              fill="#22c55e"
              stroke="#ffffff"
              strokeWidth="6"
            />
            <circle
              cx={player.x}
              cy={player.y}
              r="80"
              fill="none"
              stroke="#22c55e"
              strokeWidth="3"
              strokeDasharray="8 8"
              className="animate-pulse"
            />
          </g>

        </svg>

        {/* Legend Overlay */}
        <div className="absolute bottom-1 left-2 right-2 flex justify-between text-[9px] font-mono text-azure-200/70">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> You
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" /> Players
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded bg-azure-200" /> House
          </span>
        </div>
      </div>

      {/* World Coordinates Tag */}
      <div className="mt-2 text-center text-[10px] font-mono text-azure-200/60">
        X: {Math.round(player.x)} • Y: {Math.round(player.y)}
      </div>

    </div>
  );
}
