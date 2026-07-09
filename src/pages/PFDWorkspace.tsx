import React from 'react';
import TopToolbar from '@/components/layout/TopToolbar';
import PFDCanvas from '@/components/features/PFDCanvas';
import ValidationPanel from '@/components/features/ValidationPanel';
import EquipmentLegend from '@/components/features/EquipmentLegend';
import { usePFDData } from '@/hooks/usePFDData';

export default function PFDWorkspace() {
  const { model, activeTestCase, isValidated, validate, reset, switchTestCase, stats } = usePFDData();

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] overflow-hidden">
      <TopToolbar
        model={model}
        activeTestCase={activeTestCase}
        onSwitchTestCase={switchTestCase}
        onValidate={validate}
        onReset={reset}
        isValidated={isValidated}
      />

      {/* Status bar */}
      <div className="flex items-center gap-4 px-4 py-1.5 bg-white border-b border-[#E5E7EB] text-[10px] text-[#9CA3AF] font-medium shrink-0">
        <span className="text-[#2563EB] font-semibold">{model.name}</span>
        <span className="text-[#E5E7EB]">|</span>
        <span>{model.equipment.length} Equipment</span>
        <span className="text-[#E5E7EB]">|</span>
        <span>{model.instruments.length} Instruments</span>
        <span className="text-[#E5E7EB]">|</span>
        <span>{model.pipes.length} Lines</span>
        <span className="text-[#E5E7EB]">|</span>
        <span>{model.controlValves.length} Control Valves</span>
        <span className="text-[#E5E7EB]">|</span>
        <span className="text-[#F59E0B] font-semibold">
          {model.equipment.filter(e => e.autoAdded).length + model.instruments.filter(i => i.autoAdded).length} Auto-Added by Gatekeeper
        </span>
        <span className="text-[#E5E7EB]">|</span>
        <span>Manhattan Orthogonal Routing</span>
        <div className="ml-auto flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] inline-block" />
            <span>ENG-002 Strainer</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] inline-block" />
            <span>ENG-004 Discharge PI</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] inline-block" />
            <span>ENG-006 Tank Vent + LT</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] inline-block" />
            <span>ENG-010 CV Bypass</span>
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 gap-3 p-3 min-h-0 overflow-hidden">
        {/* Left sidebar: Equipment Legend */}
        <aside className="w-56 shrink-0 overflow-y-auto">
          <EquipmentLegend model={model} />
        </aside>

        {/* Center: PFD Canvas */}
        <main className="flex-1 min-w-0 overflow-auto">
          <PFDCanvas model={model} isValidated={isValidated} />

          {/* Engineering rules applied banner */}
          {isValidated && (
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { rule: 'ENG-002', label: 'Suction Strainer', desc: 'Y-Strainer auto-inserted', icon: '🔧' },
                { rule: 'ENG-004', label: 'Discharge PI', desc: 'Pressure indicator placed', icon: '🔧' },
                { rule: 'ENG-006', label: 'Tank Vent + LT', desc: 'Vent path + level transmitter', icon: '🔧' },
                { rule: 'ENG-010', label: 'CV Bypass', desc: 'Bypass line configured', icon: '🔧' },
              ].map(r => (
                <div key={r.rule} className="bg-white border border-[#E5E7EB] rounded-lg p-2.5 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] border border-[#F59E0B] flex items-center justify-center shrink-0">
                    <span className="text-sm">{r.icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold text-[#F59E0B]">{r.rule}</span>
                      <span className="text-[9px] bg-[#F0FDF4] text-[#16A34A] border border-[#22C55E] px-1 rounded font-medium">APPLIED</span>
                    </div>
                    <p className="text-[10px] font-semibold text-[#111827]">{r.label}</p>
                    <p className="text-[9px] text-[#9CA3AF]">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Line schedule table */}
          <div className="mt-3 bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#E5E7EB] flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#111827] tracking-tight">LINE SCHEDULE</h3>
              <span className="text-[10px] text-[#9CA3AF]">{model.pipes.length} lines · Manhattan orthogonal routing verified</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-[#E5E7EB]">
                    {['Line No.', 'From', 'To', 'Size', 'Material', 'Type', 'Flow Dir.', 'Routing', 'Status'].map(h => (
                      <th key={h} className="px-3 py-2 text-left font-semibold text-[#6B7280] whitespace-nowrap bg-[#F8FAFC]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {model.pipes.map((pipe, i) => (
                    <tr key={pipe.id} className={`border-b border-[#F3F4F6] ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                      <td className="px-3 py-2 font-mono font-semibold text-[#111827]">{pipe.tag}</td>
                      <td className="px-3 py-2 text-[#374151]">{pipe.from}</td>
                      <td className="px-3 py-2 text-[#374151]">{pipe.to}</td>
                      <td className="px-3 py-2 font-mono text-[#374151]">{pipe.size}</td>
                      <td className="px-3 py-2 text-[#374151]">{pipe.material}</td>
                      <td className="px-3 py-2">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                          pipe.type === 'process' ? 'bg-[#EFF6FF] text-[#2563EB]' :
                          pipe.type === 'bypass' ? 'bg-[#FFFBEB] text-[#92400E]' :
                          'bg-[#F3F4F6] text-[#6B7280]'
                        }`}>
                          {pipe.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-[#374151]">
                        <span className="flex items-center gap-1">
                          <span className="text-[#2563EB]">▶</span>
                          {pipe.flowDirection}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-[#374151] font-mono text-[9px]">{pipe.points.length} pts</td>
                      <td className="px-3 py-2">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${pipe.autoAdded ? 'bg-[#FFFBEB] text-[#F59E0B]' : 'bg-[#F0FDF4] text-[#16A34A]'}`}>
                          {pipe.autoAdded ? '⚡ AUTO' : '✓ OK'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Right sidebar: Validation Panel */}
        <aside className="w-72 shrink-0 overflow-hidden flex flex-col">
          <ValidationPanel
            rules={model.validationResults}
            stats={stats}
            isValidated={isValidated}
            onValidate={validate}
          />
        </aside>
      </div>
    </div>
  );
}
