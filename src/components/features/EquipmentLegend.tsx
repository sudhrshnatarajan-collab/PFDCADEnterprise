import React from 'react';
import type { PFDModel } from '@/types/pfd';

interface EquipmentLegendProps {
  model: PFDModel;
}

const typeLabels: Record<string, string> = {
  storage_tank: 'Storage Tank',
  pump: 'Centrifugal Pump',
  reactor: 'Reactor Vessel',
  strainer: 'Y-Strainer',
  heat_exchanger: 'Heat Exchanger',
  vessel: 'Process Vessel',
};

const typeColors: Record<string, { bg: string; border: string; dot: string }> = {
  storage_tank: { bg: 'bg-[#F8FAFC]', border: 'border-[#374151]', dot: 'bg-[#374151]' },
  pump: { bg: 'bg-[#EFF6FF]', border: 'border-[#2563EB]', dot: 'bg-[#2563EB]' },
  reactor: { bg: 'bg-[#F0FDF4]', border: 'border-[#16A34A]', dot: 'bg-[#16A34A]' },
  strainer: { bg: 'bg-[#FFFBEB]', border: 'border-[#F59E0B]', dot: 'bg-[#F59E0B]' },
  heat_exchanger: { bg: 'bg-[#FFF7ED]', border: 'border-[#EA580C]', dot: 'bg-[#EA580C]' },
  vessel: { bg: 'bg-[#F8FAFC]', border: 'border-[#374151]', dot: 'bg-[#6B7280]' },
};

export default function EquipmentLegend({ model }: EquipmentLegendProps) {
  const autoAdded = model.equipment.filter(e => e.autoAdded);
  const manualEq = model.equipment.filter(e => !e.autoAdded);

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#E5E7EB]">
        <h3 className="text-xs font-bold text-[#111827] tracking-tight">EQUIPMENT REGISTER</h3>
        <p className="text-[10px] text-[#9CA3AF] mt-0.5">{model.equipment.length} items · {model.instruments.length} instruments · {model.pipes.length} lines</p>
      </div>

      <div className="p-3 space-y-1.5 max-h-56 overflow-y-auto">
        {/* Process Equipment */}
        <p className="text-[9px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-1">Process Equipment</p>
        {manualEq.map(eq => {
          const cfg = typeColors[eq.type] || typeColors.vessel;
          return (
            <div key={eq.id} className={`flex items-center gap-2.5 p-2 rounded-lg border ${cfg.bg} ${cfg.border}`}>
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-[#111827]">{eq.tag}</span>
                  <span className="text-[9px] text-[#6B7280]">Seq.{eq.sequence}</span>
                </div>
                <p className="text-[10px] text-[#374151] truncate">{eq.label}</p>
                <p className="text-[9px] text-[#9CA3AF]">{typeLabels[eq.type] || eq.type}</p>
              </div>
            </div>
          );
        })}

        {/* Auto-added */}
        {autoAdded.length > 0 && (
          <>
            <p className="text-[9px] font-semibold text-[#F59E0B] uppercase tracking-widest mt-2 mb-1">⚡ Gatekeeper Auto-Added</p>
            {autoAdded.map(eq => (
              <div key={eq.id} className="flex items-center gap-2.5 p-2 rounded-lg border bg-[#FFFBEB] border-[#F59E0B]">
                <div className="w-2.5 h-2.5 rounded-full shrink-0 bg-[#F59E0B]" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-[#92400E]">{eq.tag}</span>
                    <span className="text-[9px] bg-[#F59E0B] text-white px-1 rounded">AUTO</span>
                  </div>
                  <p className="text-[10px] text-[#92400E] truncate">{eq.label}</p>
                  <p className="text-[9px] text-[#B45309]">{eq.notes?.[0]}</p>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Pipe summary */}
        <p className="text-[9px] font-semibold text-[#9CA3AF] uppercase tracking-widest mt-2 mb-1">Pipe Lines</p>
        {model.pipes.map(pipe => (
          <div key={pipe.id} className={`flex items-center gap-2 py-1.5 px-2 rounded border ${pipe.autoAdded ? 'bg-[#FFFBEB] border-[#F59E0B]' : 'bg-[#F8FAFC] border-[#E5E7EB]'}`}>
            <div className={`w-5 h-0.5 shrink-0 ${pipe.type === 'bypass' ? 'bg-[#F59E0B]' : pipe.type === 'vent' ? 'bg-[#9CA3AF]' : 'bg-[#374151]'}`} style={{ borderTop: pipe.type === 'bypass' ? '2px dashed #F59E0B' : pipe.type === 'vent' ? '2px dashed #9CA3AF' : '2px solid #374151' }} />
            <span className="font-mono text-[9px] text-[#374151] truncate">{pipe.tag}</span>
            {pipe.autoAdded && <span className="text-[8px] text-[#F59E0B] font-semibold ml-auto shrink-0">AUTO</span>}
          </div>
        ))}

        {/* Instruments summary */}
        <p className="text-[9px] font-semibold text-[#9CA3AF] uppercase tracking-widest mt-2 mb-1">Instrumentation</p>
        <div className="grid grid-cols-2 gap-1">
          {model.instruments.filter(i => i.type !== 'vent').map(inst => (
            <div key={inst.id} className={`flex items-center gap-1.5 py-1 px-2 rounded border text-[9px] ${inst.autoAdded ? 'bg-[#FFFBEB] border-[#F59E0B] text-[#92400E]' : 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1D4ED8]'}`}>
              <span className="font-bold">{inst.type}</span>
              <span className="font-mono truncate">{inst.tag.split('-').pop()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
