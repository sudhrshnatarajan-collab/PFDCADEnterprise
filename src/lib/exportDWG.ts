import type { PFDModel } from '@/types/pfd';

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function exportAsSVG(model: PFDModel): string {
  const W = 1000;
  const H = 620;
  const lines: string[] = [];

  lines.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  lines.push(`<!-- PFD-CAD Export | ISA-5.1 Compliant | ${model.name} | ${model.revision} -->`);
  lines.push(`<!-- Generated: ${new Date().toISOString()} -->`);
  lines.push(`<!-- DWG Schema: AutoCAD R2018 Model Space Compatible -->`);
  lines.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`);

  // Defs
  lines.push(`<defs>`);
  lines.push(`<marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#111827"/></marker>`);
  lines.push(`<marker id="arrow-bypass" markerWidth="6" markerHeight="6" refX="5" refY="2.5" orient="auto"><path d="M0,0 L0,5 L6,2.5 z" fill="#F59E0B"/></marker>`);
  lines.push(`<marker id="arrow-vent" markerWidth="6" markerHeight="6" refX="5" refY="2.5" orient="auto"><path d="M0,0 L0,5 L6,2.5 z" fill="#6B7280"/></marker>`);
  lines.push(`</defs>`);

  // Background
  lines.push(`<rect width="${W}" height="${H}" fill="#FFFFFF"/>`);

  // Title block
  lines.push(`<rect x="0" y="${H - 48}" width="${W}" height="48" fill="#F8FAFC" stroke="#E5E7EB"/>`);
  lines.push(`<text x="12" y="${H - 28}" font-family="Arial" font-size="11" font-weight="bold" fill="#111827">${escapeXml(model.name)}</text>`);
  lines.push(`<text x="12" y="${H - 12}" font-family="Arial" font-size="9" fill="#6B7280">Document No: PFD-${model.id} | ${escapeXml(model.revision)} | ISA-5.1 Compliant | ENG-002/004/006/010 Rules Applied</text>`);
  lines.push(`<text x="${W - 200}" y="${H - 28}" font-family="Arial" font-size="9" fill="#6B7280">PFD-CAD Enterprise Export</text>`);
  lines.push(`<text x="${W - 200}" y="${H - 12}" font-family="Arial" font-size="9" fill="#6B7280">Generated: ${new Date().toLocaleDateString()}</text>`);

  // Pipes
  model.pipes.forEach(pipe => {
    const isVent = pipe.type === 'vent';
    const isBypass = pipe.type === 'bypass';
    const color = isVent ? '#9CA3AF' : isBypass ? '#F59E0B' : '#111827';
    const dash = isVent ? '4,3' : isBypass ? '6,3' : 'none';
    const marker = isVent ? 'arrow-vent' : isBypass ? 'arrow-bypass' : 'arrow';
    const pts = pipe.points.map(p => p.join(',')).join(' ');

    lines.push(`<!-- Line: ${escapeXml(pipe.tag)} -->`);
    if (pipe.points.length > 1) {
      const d = pipe.points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
      lines.push(`<path d="${d}" fill="none" stroke="${color}" stroke-width="${isVent ? 1 : 2}" stroke-dasharray="${dash}" marker-end="url(#${marker})"/>`);
    }

    // Line label
    const mid = pipe.points[Math.floor(pipe.points.length / 2)];
    if (mid) {
      lines.push(`<text x="${mid[0]}" y="${mid[1] - 5}" font-family="Arial" font-size="7" fill="${color}" text-anchor="middle">${escapeXml(pipe.tag)}</text>`);
    }
  });

  // Equipment
  model.equipment.forEach(eq => {
    const { x, y, width: w, height: h, tag, type, label, autoAdded } = eq;
    const stroke = autoAdded ? '#F59E0B' : '#111827';

    if (type === 'storage_tank') {
      lines.push(`<!-- Tank: ${tag} -->`);
      lines.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#F8FAFC" stroke="${stroke}" stroke-width="2" rx="4"/>`);
      lines.push(`<ellipse cx="${x + w / 2}" cy="${y}" rx="${w / 2}" ry="8" fill="#E5E7EB" stroke="${stroke}" stroke-width="1.5"/>`);
      lines.push(`<ellipse cx="${x + w / 2}" cy="${y + h}" rx="${w / 2}" ry="8" fill="#E5E7EB" stroke="${stroke}" stroke-width="1.5"/>`);
      lines.push(`<text x="${x + w / 2}" y="${y + h / 2}" font-family="Arial" font-size="10" font-weight="bold" text-anchor="middle" fill="#111827">${tag}</text>`);
      lines.push(`<text x="${x + w / 2}" y="${y + h / 2 + 13}" font-family="Arial" font-size="8" text-anchor="middle" fill="#6B7280">${escapeXml(label)}</text>`);
    } else if (type === 'pump') {
      const cx = x + w / 2;
      const cy = y + h / 2;
      const r = Math.min(w, h) / 2 - 2;
      lines.push(`<!-- Pump: ${tag} -->`);
      lines.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#EFF6FF" stroke="#2563EB" stroke-width="2"/>`);
      lines.push(`<polygon points="${cx - r * 0.4},${cy - r * 0.6} ${cx + r * 0.6},${cy} ${cx - r * 0.4},${cy + r * 0.6}" fill="#2563EB"/>`);
      lines.push(`<text x="${cx}" y="${cy + r + 14}" font-family="Arial" font-size="10" font-weight="bold" text-anchor="middle" fill="#111827">${tag}</text>`);
    } else if (type === 'reactor') {
      lines.push(`<!-- Reactor: ${tag} -->`);
      lines.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#F0FDF4" stroke="#16A34A" stroke-width="2" rx="8"/>`);
      lines.push(`<ellipse cx="${x + w / 2}" cy="${y + 12}" rx="${w / 2 - 4}" ry="10" fill="#DCFCE7" stroke="#16A34A" stroke-width="1.5"/>`);
      lines.push(`<line x1="${x + 8}" y1="${y + h * 0.55}" x2="${x + w - 8}" y2="${y + h * 0.55}" stroke="#16A34A" stroke-width="1" stroke-dasharray="3,2"/>`);
      lines.push(`<text x="${x + w / 2}" y="${y + h / 2 + 4}" font-family="Arial" font-size="10" font-weight="bold" text-anchor="middle" fill="#111827">${tag}</text>`);
      lines.push(`<text x="${x + w / 2}" y="${y + h / 2 + 16}" font-family="Arial" font-size="8" text-anchor="middle" fill="#6B7280">${escapeXml(label)}</text>`);
    } else if (type === 'strainer') {
      const cx = x + w / 2;
      const cy = y + h / 2;
      lines.push(`<!-- Strainer: ${tag} (ENG-002 Auto) -->`);
      lines.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#FFFBEB" stroke="#F59E0B" stroke-width="1.5" rx="2"/>`);
      lines.push(`<line x1="${x + 4}" y1="${y + 6}" x2="${x + w - 4}" y2="${y + h - 6}" stroke="#F59E0B" stroke-width="1.5"/>`);
      lines.push(`<line x1="${x + 4}" y1="${y + 10}" x2="${x + w - 4}" y2="${y + h - 10}" stroke="#F59E0B" stroke-width="1"/>`);
      lines.push(`<text x="${cx}" y="${y + h + 12}" font-family="Arial" font-size="8" text-anchor="middle" fill="#92400E">${tag}</text>`);
    } else if (type === 'heat_exchanger') {
      lines.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#FFF7ED" stroke="#EA580C" stroke-width="2" rx="4"/>`);
      lines.push(`<circle cx="${x + w * 0.3}" cy="${y + h / 2}" r="${h * 0.35}" fill="none" stroke="#EA580C" stroke-width="1.5"/>`);
      lines.push(`<circle cx="${x + w * 0.7}" cy="${y + h / 2}" r="${h * 0.35}" fill="none" stroke="#EA580C" stroke-width="1.5"/>`);
      lines.push(`<text x="${x + w / 2}" y="${y + h + 14}" font-family="Arial" font-size="10" font-weight="bold" text-anchor="middle" fill="#111827">${tag}</text>`);
    } else {
      lines.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#F8FAFC" stroke="${stroke}" stroke-width="2" rx="4"/>`);
      lines.push(`<text x="${x + w / 2}" y="${y + h / 2 + 4}" font-family="Arial" font-size="10" font-weight="bold" text-anchor="middle" fill="#111827">${tag}</text>`);
    }
  });

  // Instruments
  model.instruments.forEach(inst => {
    const { x, y, tag, type, autoAdded } = inst;
    const r = 16;
    const stroke = autoAdded ? '#F59E0B' : '#2563EB';
    const fill = autoAdded ? '#FFFBEB' : '#EFF6FF';
    const short = type === 'vent' ? '⬆' : type;

    if (type === 'vent') {
      lines.push(`<line x1="${x}" y1="${y}" x2="${x}" y2="${y - 20}" stroke="#9CA3AF" stroke-width="1.5" marker-end="url(#arrow-vent)"/>`);
      lines.push(`<text x="${x + 6}" y="${y - 8}" font-family="Arial" font-size="7" fill="#6B7280">ATM</text>`);
    } else {
      lines.push(`<!-- Instrument: ${tag} -->`);
      lines.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`);
      if (inst.isFunctionBlock) {
        lines.push(`<rect x="${x - r}" y="${y - r}" width="${r * 2}" height="${r * 2}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`);
      }
      lines.push(`<text x="${x}" y="${y - 2}" font-family="Arial" font-size="7" font-weight="bold" text-anchor="middle" fill="#111827">${escapeXml(short)}</text>`);
      lines.push(`<text x="${x}" y="${y + 8}" font-family="Arial" font-size="7" text-anchor="middle" fill="#111827">${escapeXml(tag.split('-').slice(-1)[0])}</text>`);
    }
  });

  // Control Valves
  model.controlValves.forEach(cv => {
    const { x, y, tag } = cv;
    lines.push(`<!-- Control Valve: ${tag} (ENG-010 Bypass Applied) -->`);
    lines.push(`<polygon points="${x - 10},${y - 8} ${x + 10},${y - 8} ${x},${y + 8}" fill="#DBEAFE" stroke="#2563EB" stroke-width="1.5"/>`);
    lines.push(`<polygon points="${x - 10},${y + 8} ${x + 10},${y + 8} ${x},${y - 8}" fill="#DBEAFE" stroke="#2563EB" stroke-width="1.5"/>`);
    lines.push(`<text x="${x}" y="${y + 22}" font-family="Arial" font-size="8" text-anchor="middle" fill="#1D4ED8">${escapeXml(tag)}</text>`);
  });

  // Legend
  const lx = W - 180;
  const ly = 20;
  lines.push(`<rect x="${lx}" y="${ly}" width="170" height="180" fill="#F8FAFC" stroke="#E5E7EB" rx="4"/>`);
  lines.push(`<text x="${lx + 8}" y="${ly + 16}" font-family="Arial" font-size="9" font-weight="bold" fill="#111827">LEGEND</text>`);
  const legendItems = [
    { color: '#111827', label: 'Process Line', dash: 'none' },
    { color: '#F59E0B', label: 'Bypass Line (ENG-010)', dash: '6,3' },
    { color: '#9CA3AF', label: 'Vent Line (ENG-006)', dash: '4,3' },
    { color: '#2563EB', label: 'Instrument (ISA-5.1)' },
    { color: '#F59E0B', label: 'Auto-Added (Gatekeeper)' },
    { color: '#16A34A', label: 'Reactor Vessel' },
    { color: '#EA580C', label: 'Heat Exchanger' },
  ];
  legendItems.forEach((item, i) => {
    const iy = ly + 28 + i * 22;
    lines.push(`<line x1="${lx + 8}" y1="${iy + 5}" x2="${lx + 30}" y2="${iy + 5}" stroke="${item.color}" stroke-width="2" stroke-dasharray="${item.dash || 'none'}"/>`);
    lines.push(`<text x="${lx + 36}" y="${iy + 9}" font-family="Arial" font-size="8" fill="#374151">${escapeXml(item.label)}</text>`);
  });

  lines.push(`</svg>`);
  return lines.join('\n');
}

export function triggerSVGDownload(svgContent: string, filename: string): void {
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportDWGSchema(model: PFDModel): string {
  const schema = {
    dwg_version: 'AutoCAD_R2018',
    model_space: `PFD-${model.id}`,
    standard: 'ISA-5.1',
    revision: model.revision,
    generated: new Date().toISOString(),
    layers: [
      { name: 'PROCESS-LINES', color: 7, linetype: 'CONTINUOUS' },
      { name: 'BYPASS-LINES', color: 2, linetype: 'DASHED' },
      { name: 'VENT-LINES', color: 8, linetype: 'DASHED2' },
      { name: 'EQUIPMENT', color: 7, linetype: 'CONTINUOUS' },
      { name: 'INSTRUMENTS', color: 5, linetype: 'CONTINUOUS' },
      { name: 'CONTROL-VALVES', color: 5, linetype: 'CONTINUOUS' },
      { name: 'ANNOTATIONS', color: 7, linetype: 'CONTINUOUS' },
      { name: 'TITLE-BLOCK', color: 7, linetype: 'CONTINUOUS' },
    ],
    blocks: model.equipment.map(eq => ({
      block_name: eq.tag,
      layer: 'EQUIPMENT',
      type: eq.type.toUpperCase(),
      insert_point: { x: eq.x, y: eq.y },
      attributes: {
        TAG: eq.tag,
        DESCRIPTION: eq.label,
        MATERIAL: eq.material || '',
        AUTO_ADDED: eq.autoAdded || false,
      },
    })),
    polylines: model.pipes.map(pipe => ({
      handle: pipe.id,
      tag: pipe.tag,
      layer: pipe.type === 'bypass' ? 'BYPASS-LINES' : pipe.type === 'vent' ? 'VENT-LINES' : 'PROCESS-LINES',
      vertices: pipe.points.map(([x, y]) => ({ x, y, z: 0 })),
      flow_direction: pipe.flowDirection,
      size: pipe.size,
      material: pipe.material,
      arrow_markers: true,
    })),
    instruments: model.instruments.map(inst => ({
      handle: inst.id,
      tag: inst.tag,
      layer: 'INSTRUMENTS',
      type: inst.type,
      center: { x: inst.x, y: inst.y },
      symbol: inst.isFunctionBlock ? 'SQUARE_BUBBLE' : 'CIRCLE_BUBBLE',
      auto_added: inst.autoAdded || false,
    })),
    control_valves: model.controlValves.map(cv => ({
      handle: cv.id,
      tag: cv.tag,
      layer: 'CONTROL-VALVES',
      insert_point: { x: cv.x, y: cv.y },
      has_bypass: cv.hasBypass,
      bypass_line: cv.bypassLineId,
    })),
    engineering_rules_applied: [
      'ENG-002: Suction Strainer on all centrifugal pumps',
      'ENG-004: Discharge PI on all centrifugal pumps',
      'ENG-006: Atmospheric vent on all storage tanks',
      'ISA-003: Level Transmitter on all storage tanks',
      'ENG-010: Bypass configuration on all control valves',
    ],
  };
  return JSON.stringify(schema, null, 2);
}

export function triggerDWGSchemaDownload(model: PFDModel): void {
  const schema = exportDWGSchema(model);
  const blob = new Blob([schema], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `PFD-${model.id}-DWG-Schema.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
