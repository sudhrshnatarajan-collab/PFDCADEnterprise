import React from 'react';
import type { ValidationRule } from '@/types/pfd';

interface ValidationPanelProps {
  rules: ValidationRule[];
  stats: { passed: number; autofixed: number; warnings: number; failed: number; total: number };
  isValidated: boolean;
  onValidate: () => void;
}

const statusConfig = {
  passed: { bg: 'bg-[#F0FDF4]', border: 'border-[#22C55E]', text: 'text-[#16A34A]', badge: 'bg-[#22C55E]', icon: '✓', label: 'PASSED' },
  autofixed: { bg: 'bg-[#FFFBEB]', border: 'border-[#F59E0B]', text: 'text-[#92400E]', badge: 'bg-[#F59E0B]', icon: '⚡', label: 'AUTO-FIX' },
  warning: { bg: 'bg-[#FFF7ED]', border: 'border-[#F59E0B]', text: 'text-[#C2410C]', badge: 'bg-[#FB923C]', icon: '⚠', label: 'WARNING' },
  failed: { bg: 'bg-[#FEF2F2]', border: 'border-[#EF4444]', text: 'text-[#B91C1C]', badge: 'bg-[#EF4444]', icon: '✕', label: 'FAILED' },
};

export default function ValidationPanel({ rules, stats, isValidated, onValidate }: ValidationPanelProps) {
  return (
    <div className="flex flex-col h-full bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#E5E7EB]">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-[#111827] tracking-tight">ENGINEERING GATEKEEPER</h2>
          <span className="text-xs font-mono text-[#9CA3AF]">ISA-5.1 Rule Engine</span>
        </div>
        {!isValidated ? (
          <button
            onClick={onValidate}
            className="w-full py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
          >
            ▶ Run Validation & Auto-Fix Matrix
          </button>
        ) : (
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { label: 'PASS', count: stats.passed, color: 'text-[#22C55E]', bg: 'bg-[#F0FDF4]' },
              { label: 'FIX', count: stats.autofixed, color: 'text-[#F59E0B]', bg: 'bg-[#FFFBEB]' },
              { label: 'WARN', count: stats.warnings, color: 'text-[#F97316]', bg: 'bg-[#FFF7ED]' },
              { label: 'FAIL', count: stats.failed, color: 'text-[#EF4444]', bg: 'bg-[#FEF2F2]' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-lg py-1.5 text-center`}>
                <div className={`text-lg font-bold ${s.color} leading-none`}>{s.count}</div>
                <div className="text-[9px] font-semibold text-[#6B7280] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rule list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {!isValidated && (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-10">
            <div className="w-12 h-12 rounded-full bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-center text-2xl">🔍</div>
            <p className="text-xs text-[#9CA3AF] text-center">Run validation to check ISA-5.1 compliance and apply auto-fix rules</p>
          </div>
        )}

        {isValidated && rules.map(rule => {
          const cfg = statusConfig[rule.status] || statusConfig.warning;
          return (
            <div key={rule.ruleId} className={`${cfg.bg} border ${cfg.border} rounded-lg p-2.5`}>
              <div className="flex items-start gap-2">
                <span className={`${cfg.badge} text-white text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5`}>
                  {cfg.icon} {cfg.label}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-mono text-[10px] font-bold text-[#111827]">{rule.ruleId}</span>
                    <span className="text-[9px] text-[#9CA3AF]">{rule.standard}</span>
                  </div>
                  <p className={`text-[11px] ${cfg.text} leading-snug`}>{rule.description}</p>
                  {rule.autoFixApplied && (
                    <p className="text-[10px] text-[#92400E] mt-1 italic">↳ {rule.autoFixApplied}</p>
                  )}
                  {rule.affectedEquipment.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {rule.affectedEquipment.slice(0, 3).map(tag => (
                        <span key={tag} className="bg-white border border-[#E5E7EB] text-[#374151] text-[9px] font-mono px-1.5 py-0.5 rounded">
                          {tag.length > 20 ? tag.slice(0, 20) + '…' : tag}
                        </span>
                      ))}
                      {rule.affectedEquipment.length > 3 && (
                        <span className="text-[9px] text-[#9CA3AF] px-1 py-0.5">+{rule.affectedEquipment.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer standards reference */}
      {isValidated && (
        <div className="px-3 py-2 bg-[#F8FAFC] border-t border-[#E5E7EB]">
          <p className="text-[9px] text-[#9CA3AF] text-center">
            Standards: ISA-5.1 · API-610 · API-650 · ISA-75 · CAD Best Practice
          </p>
        </div>
      )}
    </div>
  );
}
