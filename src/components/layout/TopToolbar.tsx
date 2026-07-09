import React, { useState } from 'react';
import type { PFDModel } from '@/types/pfd';
import { exportAsSVG, triggerSVGDownload, triggerDWGSchemaDownload } from '@/lib/exportDWG';

interface TopToolbarProps {
  model: PFDModel;
  activeTestCase: 'TC-A' | 'TC-B';
  onSwitchTestCase: (id: 'TC-A' | 'TC-B') => void;
  onValidate: () => void;
  onReset: () => void;
  isValidated: boolean;
}

export default function TopToolbar({ model, activeTestCase, onSwitchTestCase, onValidate, onReset, isValidated }: TopToolbarProps) {
  const [exportMenu, setExportMenu] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState('');

  const handleExportSVG = () => {
    setExportMenu(false);
    setExporting(true);
    setExportMsg('Generating ISA-5.1 SVG vector…');
    setTimeout(() => {
      const svg = exportAsSVG(model);
      triggerSVGDownload(svg, `PFD-${model.id}-${model.revision}.svg`);
      setExporting(false);
      setExportMsg('SVG exported successfully');
      setTimeout(() => setExportMsg(''), 3000);
    }, 600);
  };

  const handleExportDWG = () => {
    setExportMenu(false);
    setExporting(true);
    setExportMsg('Building DWG model space schema…');
    setTimeout(() => {
      triggerDWGSchemaDownload(model);
      setExporting(false);
      setExportMsg('DWG schema exported (AutoCAD R2018 compatible)');
      setTimeout(() => setExportMsg(''), 4000);
    }, 800);
  };

  return (
    <header className="bg-white border-b border-[#E5E7EB] px-4 py-0 h-14 flex items-center gap-3 shrink-0 relative z-20">
      {/* Logo / Brand */}
      <div className="flex items-center gap-2.5 mr-4">
        <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center">
          <span className="text-white font-bold text-sm leading-none">P</span>
        </div>
        <div>
          <div className="text-sm font-bold text-[#111827] leading-tight tracking-tight">PFD-CAD</div>
          <div className="text-[9px] text-[#9CA3AF] leading-tight font-medium tracking-widest">ENTERPRISE</div>
        </div>
      </div>

      <div className="w-px h-6 bg-[#E5E7EB]" />

      {/* Test Case Selector */}
      <div className="flex items-center gap-1 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg p-0.5">
        {(['TC-A', 'TC-B'] as const).map(tc => (
          <button
            key={tc}
            onClick={() => onSwitchTestCase(tc)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-1 ${
              activeTestCase === tc
                ? 'bg-white text-[#111827] shadow-sm border border-[#E5E7EB]'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            {tc === 'TC-A' ? 'Test A: Tank Loop' : 'Test B: Column Feed'}
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-[#E5E7EB]" />

      {/* Model info */}
      <div className="hidden md:flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[#9CA3AF] font-medium">MODEL</span>
          <span className="font-mono text-[11px] text-[#374151] font-semibold">PFD-{model.id}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[#9CA3AF] font-medium">REV</span>
          <span className="font-mono text-[11px] text-[#374151]">{model.revision}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[#9CA3AF] font-medium">STD</span>
          <span className="font-mono text-[11px] text-[#2563EB]">ISA-5.1</span>
        </div>
      </div>

      {/* Export feedback */}
      {exportMsg && (
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-[#F0FDF4] border border-[#22C55E] rounded-md">
          <span className="text-[10px] text-[#16A34A] font-medium">{exportMsg}</span>
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        {/* Validate button */}
        {!isValidated ? (
          <button
            onClick={onValidate}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#111827] hover:bg-[#1F2937] active:bg-[#374151] text-white text-xs font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#111827] focus:ring-offset-2"
          >
            <span className="text-sm">▶</span> Run Validation
          </button>
        ) : (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E5E7EB] text-[#374151] text-xs font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#E5E7EB] focus:ring-offset-2"
          >
            ↺ Reset
          </button>
        )}

        {/* Export DWG button */}
        <div className="relative">
          <button
            onClick={() => setExportMenu(prev => !prev)}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] disabled:opacity-60 text-white text-xs font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
          >
            {exporting ? (
              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7,10 12,15 17,10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            )}
            Export DWG
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="6,9 12,15 18,9" />
            </svg>
          </button>

          {exportMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setExportMenu(false)} />
              <div className="absolute right-0 top-full mt-1.5 z-40 w-64 bg-white border border-[#E5E7EB] rounded-xl shadow-lg overflow-hidden">
                <div className="px-3 py-2 bg-[#F8FAFC] border-b border-[#E5E7EB]">
                  <p className="text-[10px] font-bold text-[#111827] tracking-tight">EXPORT FORMATS</p>
                  <p className="text-[9px] text-[#9CA3AF]">PFD-{model.id} · {model.revision}</p>
                </div>
                <div className="p-1.5 space-y-1">
                  <button
                    onClick={handleExportDWG}
                    className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-[#EFF6FF] transition-colors text-left focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white font-bold text-[10px]">DWG</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#111827]">AutoCAD DWG Schema</p>
                      <p className="text-[10px] text-[#6B7280]">JSON model space (R2018 compatible)</p>
                      <p className="text-[9px] text-[#9CA3AF]">Layers · Blocks · Polylines · Instruments</p>
                    </div>
                  </button>
                  <button
                    onClick={handleExportSVG}
                    className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-[#F0FDF4] transition-colors text-left focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#22C55E] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white font-bold text-[10px]">SVG</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#111827]">ISA-5.1 Vector Drawing</p>
                      <p className="text-[10px] text-[#6B7280]">Scalable SVG with full annotations</p>
                      <p className="text-[9px] text-[#9CA3AF]">Title block · Legend · Flow arrows</p>
                    </div>
                  </button>
                </div>
                <div className="px-3 py-2 bg-[#FFFBEB] border-t border-[#F59E0B]">
                  <p className="text-[9px] text-[#92400E]">⚡ All engineering gatekeeper rules applied to export</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
