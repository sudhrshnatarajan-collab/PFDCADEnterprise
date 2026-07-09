import React from 'react';
import type { PFDModel } from '@/types/pfd';

interface PFDCanvasProps {
  model: PFDModel;
  isValidated: boolean;
}

const CANVAS_W = 920;
const CANVAS_H = 560;

function TankSymbol({ x, y, w, h, tag, label, autoAdded }: { x: number; y: number; w: number; h: number; tag: string; label: string; autoAdded?: boolean }) {
  const stroke = autoAdded ? '#F59E0B' : '#374151';
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#F8FAFC" stroke={stroke} strokeWidth={2} rx={3} />
      <ellipse cx={x + w / 2} cy={y} rx={w / 2} ry={9} fill="#E5E7EB" stroke={stroke} strokeWidth={1.5} />
      <ellipse cx={x + w / 2} cy={y + h} rx={w / 2} ry={9} fill="#E5E7EB" stroke={stroke} strokeWidth={1.5} />
      {/* level lines */}
      <rect x={x + 3} y={y + h * 0.55} width={w - 6} height={h * 0.38} fill="#DBEAFE" opacity={0.5} />
      <text x={x + w / 2} y={y + h / 2 - 2} textAnchor="middle" fontSize={10} fontWeight={700} fill="#111827">{tag}</text>
      <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" fontSize={8} fill="#6B7280">{label}</text>
    </g>
  );
}

function PumpSymbol({ x, y, w, h, tag }: { x: number; y: number; w: number; h: number; tag: string }) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const r = Math.min(w, h) / 2 - 3;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#EFF6FF" stroke="#2563EB" strokeWidth={2} />
      <polygon
        points={`${cx - r * 0.38},${cy - r * 0.58} ${cx + r * 0.62},${cy} ${cx - r * 0.38},${cy + r * 0.58}`}
        fill="#2563EB"
      />
      <text x={cx} y={cy + r + 14} textAnchor="middle" fontSize={10} fontWeight={700} fill="#111827">{tag}</text>
      <text x={cx} y={cy + r + 25} textAnchor="middle" fontSize={8} fill="#6B7280">Centrifugal</text>
    </g>
  );
}

function ReactorSymbol({ x, y, w, h, tag, label }: { x: number; y: number; w: number; h: number; tag: string; label: string }) {
  return (
    <g>
      <rect x={x} y={y + 12} width={w} height={h - 12} fill="#F0FDF4" stroke="#16A34A" strokeWidth={2} rx={5} />
      <ellipse cx={x + w / 2} cy={y + 14} rx={w / 2} ry={12} fill="#DCFCE7" stroke="#16A34A" strokeWidth={1.5} />
      <line x1={x + 8} y1={y + h * 0.6} x2={x + w - 8} y2={y + h * 0.6} stroke="#16A34A" strokeWidth={1} strokeDasharray="3,2" />
      <line x1={x + 8} y1={y + h * 0.75} x2={x + w - 8} y2={y + h * 0.75} stroke="#16A34A" strokeWidth={1} strokeDasharray="3,2" />
      <text x={x + w / 2} y={y + h / 2 + 6} textAnchor="middle" fontSize={10} fontWeight={700} fill="#111827">{tag}</text>
      <text x={x + w / 2} y={y + h / 2 + 19} textAnchor="middle" fontSize={8} fill="#6B7280">{label}</text>
    </g>
  );
}

function HeatExchangerSymbol({ x, y, w, h, tag, label }: { x: number; y: number; w: number; h: number; tag: string; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#FFF7ED" stroke="#EA580C" strokeWidth={2} rx={4} />
      <circle cx={x + w * 0.33} cy={y + h / 2} r={h * 0.3} fill="none" stroke="#EA580C" strokeWidth={1.5} />
      <circle cx={x + w * 0.67} cy={y + h / 2} r={h * 0.3} fill="none" stroke="#EA580C" strokeWidth={1.5} />
      <text x={x + w / 2} y={y + h + 14} textAnchor="middle" fontSize={10} fontWeight={700} fill="#111827">{tag}</text>
      <text x={x + w / 2} y={y + h + 25} textAnchor="middle" fontSize={8} fill="#6B7280">{label}</text>
    </g>
  );
}

function StrainerSymbol({ x, y, w, h, tag }: { x: number; y: number; w: number; h: number; tag: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#FFFBEB" stroke="#F59E0B" strokeWidth={1.5} rx={2} />
      <line x1={x + 4} y1={y + 4} x2={x + w - 4} y2={y + h - 4} stroke="#F59E0B" strokeWidth={1.5} />
      <line x1={x + 4} y1={y + 9} x2={x + w - 4} y2={y + h - 9} stroke="#D97706" strokeWidth={1} />
      <text x={x + w / 2} y={y + h + 12} textAnchor="middle" fontSize={7.5} fill="#92400E" fontWeight={600}>{tag}</text>
      <text x={x + w / 2} y={y + h + 21} textAnchor="middle" fontSize={6.5} fill="#B45309">AUTO</text>
    </g>
  );
}

function InstrumentBubble({ x, y, tag, type, autoAdded, isFunctionBlock }: {
  x: number; y: number; tag: string; type: string; autoAdded?: boolean; isFunctionBlock?: boolean;
}) {
  const r = 15;
  const stroke = autoAdded ? '#F59E0B' : '#2563EB';
  const fill = autoAdded ? '#FFFBEB' : '#EFF6FF';
  const shortTag = tag.split('-').pop() || '';

  return (
    <g>
      {isFunctionBlock ? (
        <rect x={x - r} y={y - r} width={r * 2} height={r * 2} fill={fill} stroke={stroke} strokeWidth={1.5} />
      ) : (
        <circle cx={x} cy={y} r={r} fill={fill} stroke={stroke} strokeWidth={1.5} />
      )}
      <text x={x} y={y - 3} textAnchor="middle" fontSize={7} fontWeight={700} fill="#111827">{type}</text>
      <text x={x} y={y + 7} textAnchor="middle" fontSize={6.5} fill="#374151">{shortTag}</text>
      {autoAdded && (
        <circle cx={x + r - 4} cy={y - r + 4} r={4} fill="#F59E0B" />
      )}
    </g>
  );
}

function ControlValveSymbol({ x, y, tag }: { x: number; y: number; tag: string }) {
  return (
    <g>
      <polygon points={`${x - 10},${y - 8} ${x + 10},${y - 8} ${x},${y + 8}`} fill="#DBEAFE" stroke="#2563EB" strokeWidth={1.5} />
      <polygon points={`${x - 10},${y + 8} ${x + 10},${y + 8} ${x},${y - 8}`} fill="#DBEAFE" stroke="#2563EB" strokeWidth={1.5} />
      <line x1={x} y1={y - 16} x2={x} y2={y - 28} stroke="#2563EB" strokeWidth={1.5} />
      <text x={x} y={y + 22} textAnchor="middle" fontSize={8} fill="#1D4ED8" fontWeight={600}>{tag}</text>
    </g>
  );
}

function PipePath({ points, type, tag }: { points: [number, number][]; type: string; tag: string }) {
  if (points.length < 2) return null;
  const d = points.map(([px, py], i) => `${i === 0 ? 'M' : 'L'}${px},${py}`).join(' ');
  const isVent = type === 'vent';
  const isBypass = type === 'bypass';
  const color = isVent ? '#9CA3AF' : isBypass ? '#F59E0B' : '#374151';
  const dash = isVent ? '5,3' : isBypass ? '7,3' : undefined;
  const sw = isVent ? 1.5 : isBypass ? 1.5 : 2.5;
  const markerId = isVent ? 'arrow-vent' : isBypass ? 'arrow-bypass' : 'arrow-main';

  const midIdx = Math.floor(points.length / 2);
  const [lx, ly] = points[midIdx];
  const sizeLabel = tag.split('-')[0] || '';

  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={sw}
        strokeDasharray={dash}
        markerEnd={`url(#${markerId})`}
      />
      {!isVent && (
        <text x={lx} y={ly - 6} textAnchor="middle" fontSize={7} fill={color} opacity={0.8}>{sizeLabel}</text>
      )}
    </g>
  );
}

export default function PFDCanvas({ model, isValidated }: PFDCanvasProps) {
  return (
    <div className="relative w-full overflow-auto bg-white border border-[#E5E7EB] rounded-xl">
      {/* Canvas header bar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-[#F8FAFC] border-b border-[#E5E7EB]">
        <span className="font-mono text-xs text-[#6B7280]">PFD-{model.id}</span>
        <span className="text-[#E5E7EB]">|</span>
        <span className="font-mono text-xs text-[#6B7280]">{model.name}</span>
        <span className="text-[#E5E7EB]">|</span>
        <span className="font-mono text-xs text-[#6B7280]">{model.revision}</span>
        <span className="text-[#E5E7EB]">|</span>
        <span className="font-mono text-xs text-[#2563EB]">ISA-5.1 Compliant</span>
        <div className="ml-auto flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${isValidated ? 'bg-[#F0FDF4] text-[#16A34A]' : 'bg-[#F8FAFC] text-[#6B7280]'}`}>
            {isValidated ? '✓ Validated' : 'Not Validated'}
          </span>
          <span className="font-mono text-xs text-[#9CA3AF]">Manhattan Orthogonal</span>
        </div>
      </div>

      <svg
        width={CANVAS_W}
        height={CANVAS_H}
        viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
        className="block"
        style={{ fontFamily: "'Inter', 'Arial', sans-serif" }}
      >
        <defs>
          <marker id="arrow-main" markerWidth={9} markerHeight={9} refX={7} refY={3} orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#374151" />
          </marker>
          <marker id="arrow-bypass" markerWidth={7} markerHeight={7} refX={5} refY={2.5} orient="auto">
            <path d="M0,0 L0,5 L7,2.5 z" fill="#F59E0B" />
          </marker>
          <marker id="arrow-vent" markerWidth={6} markerHeight={6} refX={4} refY={2.5} orient="auto">
            <path d="M0,0 L0,5 L6,2.5 z" fill="#9CA3AF" />
          </marker>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx={0} dy={1} stdDeviation={2} floodOpacity={0.08} />
          </filter>
          <filter id="shadow-eq" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx={0} dy={2} stdDeviation={4} floodOpacity={0.12} />
          </filter>
        </defs>

        {/* Grid dots */}
        <pattern id="grid" width={40} height={40} patternUnits="userSpaceOnUse">
          <circle cx={20} cy={20} r={1} fill="#E5E7EB" />
        </pattern>
        <rect width={CANVAS_W} height={CANVAS_H} fill="url(#grid)" />

        {/* Pipes — drawn first (bottom layer) */}
        <g id="pipes">
          {model.pipes.map(pipe => (
            <PipePath key={pipe.id} points={pipe.points} type={pipe.type} tag={pipe.tag} />
          ))}
        </g>

        {/* Equipment */}
        <g id="equipment" filter="url(#shadow-eq)">
          {model.equipment.map(eq => {
            if (eq.type === 'storage_tank') return <TankSymbol key={eq.id} x={eq.x} y={eq.y} w={eq.width} h={eq.height} tag={eq.tag} label={eq.label} autoAdded={eq.autoAdded} />;
            if (eq.type === 'pump') return <PumpSymbol key={eq.id} x={eq.x} y={eq.y} w={eq.width} h={eq.height} tag={eq.tag} />;
            if (eq.type === 'reactor') return <ReactorSymbol key={eq.id} x={eq.x} y={eq.y} w={eq.width} h={eq.height} tag={eq.tag} label={eq.label} />;
            if (eq.type === 'strainer') return <StrainerSymbol key={eq.id} x={eq.x} y={eq.y} w={eq.width} h={eq.height} tag={eq.tag} />;
            if (eq.type === 'heat_exchanger') return <HeatExchangerSymbol key={eq.id} x={eq.x} y={eq.y} w={eq.width} h={eq.height} tag={eq.tag} label={eq.label} />;
            if (eq.type === 'vessel') return <TankSymbol key={eq.id} x={eq.x} y={eq.y} w={eq.width} h={eq.height} tag={eq.tag} label={eq.label} />;
            return null;
          })}
        </g>

        {/* Control Valves */}
        <g id="control-valves">
          {model.controlValves.map(cv => (
            <ControlValveSymbol key={cv.id} x={cv.x} y={cv.y} tag={cv.tag} />
          ))}
        </g>

        {/* Instruments */}
        <g id="instruments">
          {model.instruments.map(inst => {
            if (inst.type === 'vent') {
              return (
                <g key={inst.id}>
                  <line x1={inst.x} y1={inst.y} x2={inst.x} y2={inst.y - 22} stroke="#9CA3AF" strokeWidth={1.5} markerEnd="url(#arrow-vent)" />
                  <text x={inst.x + 7} y={inst.y - 10} fontSize={7} fill="#9CA3AF">ATM</text>
                  <text x={inst.x + 7} y={inst.y - 2} fontSize={7} fill="#9CA3AF">{inst.tag.split('-')[0]}</text>
                </g>
              );
            }
            return (
              <g key={inst.id}>
                {/* leader line to nearest pipe/equipment */}
                <InstrumentBubble
                  x={inst.x}
                  y={inst.y}
                  tag={inst.tag}
                  type={inst.type}
                  autoAdded={inst.autoAdded}
                  isFunctionBlock={inst.isFunctionBlock}
                />
              </g>
            );
          })}
        </g>

        {/* Flow direction labels on main lines */}
        {model.pipes.filter(p => p.type === 'process').map(pipe => {
          const mid = pipe.points[Math.floor(pipe.points.length / 2)];
          if (!mid) return null;
          return (
            <text key={`fd-${pipe.id}`} x={mid[0]} y={mid[1] + 16} textAnchor="middle" fontSize={7} fill="#9CA3AF">
              ▶ {pipe.flowDirection}
            </text>
          );
        })}

        {/* Sequence badges */}
        {model.equipment.filter(e => e.sequence !== undefined && !e.autoAdded).map(eq => (
          <g key={`seq-${eq.id}`}>
            <circle cx={eq.x + eq.width - 8} cy={eq.y + 8} r={8} fill="#2563EB" />
            <text x={eq.x + eq.width - 8} y={eq.y + 12} textAnchor="middle" fontSize={8} fill="white" fontWeight={700}>{eq.sequence}</text>
          </g>
        ))}

        {/* Validation overlays */}
        {isValidated && model.validationResults.filter(r => r.status === 'autofixed').slice(0, 3).map((r, i) => (
          <g key={`val-${i}`}>
            <rect x={8} y={8 + i * 20} width={200} height={16} fill="#FFFBEB" stroke="#F59E0B" strokeWidth={1} rx={3} opacity={0.92} />
            <text x={14} y={20 + i * 20} fontSize={8} fill="#92400E">⚡ {r.ruleId}: {r.autoFixApplied?.slice(0, 28)}…</text>
          </g>
        ))}

        {/* Canvas title block */}
        <rect x={0} y={CANVAS_H - 42} width={CANVAS_W} height={42} fill="#F8FAFC" stroke="#E5E7EB" />
        <line x1={0} y1={CANVAS_H - 42} x2={CANVAS_W} y2={CANVAS_H - 42} stroke="#E5E7EB" strokeWidth={1} />
        <text x={12} y={CANVAS_H - 24} fontSize={10} fontWeight={700} fill="#111827">{model.name}</text>
        <text x={12} y={CANVAS_H - 10} fontSize={8} fill="#6B7280">PFD-{model.id} | {model.revision} | ISA-5.1 | ENG-002/004/006/010</text>
        <text x={CANVAS_W - 12} y={CANVAS_H - 24} fontSize={8} fill="#9CA3AF" textAnchor="end">PFD-CAD Enterprise</text>
        <text x={CANVAS_W - 12} y={CANVAS_H - 10} fontSize={7} fill="#9CA3AF" textAnchor="end">© {new Date().getFullYear()}</text>

        {/* Legend */}
        <g transform={`translate(${CANVAS_W - 175}, 16)`}>
          <rect width={163} height={140} fill="white" stroke="#E5E7EB" rx={6} filter="url(#shadow)" />
          <text x={10} y={18} fontSize={9} fontWeight={700} fill="#111827">LEGEND</text>
          {[
            { color: '#374151', label: 'Process Line', dash: undefined, sw: 2.5 },
            { color: '#F59E0B', label: 'Bypass (ENG-010)', dash: '7,3', sw: 1.5 },
            { color: '#9CA3AF', label: 'Vent Line (ENG-006)', dash: '5,3', sw: 1.5 },
            { color: '#2563EB', label: 'ISA Instrument Bubble', dash: undefined, sw: 1.5 },
            { color: '#F59E0B', label: 'Auto-Added (Gatekeeper)', dash: undefined, sw: 1.5 },
          ].map((item, i) => (
            <g key={i} transform={`translate(0, ${28 + i * 22})`}>
              <line x1={10} y1={8} x2={32} y2={8} stroke={item.color} strokeWidth={item.sw} strokeDasharray={item.dash} />
              <text x={38} y={12} fontSize={8} fill="#374151">{item.label}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
