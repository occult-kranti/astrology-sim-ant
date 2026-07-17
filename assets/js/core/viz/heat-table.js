// ============================================================================
//  core/viz/heat-table.js — a generic HTML-string heat table (SAV/BAV, the
//  kūṭa 36-guṇa grid, weekly transit hit-counts). A table, not SVG: the numbers
//  want header semantics. Heat colour is REDUNDANT — every cell prints its
//  number, so the grid is colour-blind-safe by construction. [dataviz §3.7]
//  Pure, deterministic, returns {html, textModel}.
// ============================================================================
import { esc } from './svg.js';

// heatTable({cols, rows, scale:{min,max,steps=4}, emphasis:{rowId,threshold}, caption})
//   cols: [{id, label}]
//   rows: [{id, label, cells:[{v, el}]}]   (cells aligned to cols by index)
//   scale: linear quantisation of (v-min)/(max-min) into `steps` heat classes
//   emphasis: the footer/SAV row id + a threshold; cells ≥ threshold get .heat-hi
export function heatTable({ cols, rows, scale, emphasis = null, caption = '' }) {
  const { min, max, steps = 4 } = scale;
  const span = (max - min) || 1;
  const heatCls = v => {
    const q = Math.round((Math.max(min, Math.min(max, v)) - min) / span * steps);
    return `heat-${Math.max(0, Math.min(steps, q))}`;
  };
  const emphRowId = emphasis && emphasis.rowId;
  const threshold = emphasis && emphasis.threshold;

  const th0 = `<th scope="col"></th>`;
  const headCells = cols.map(c => `<th scope="col" data-c="${esc(c.id)}">${esc(c.label)}</th>`).join('');
  const thead = `<thead><tr>${th0}${headCells}</tr></thead>`;

  const bodyRows = [];
  const footRows = [];
  for (const row of rows) {
    const isEmph = row.id === emphRowId;
    const cells = row.cells.map((cell, i) => {
      const col = cols[i] || {};
      const hi = isEmph && threshold != null && cell.v >= threshold ? ' heat-hi' : '';
      const el = cell.el != null ? ` data-el="${esc(cell.el)}"` : '';
      return `<td class="${heatCls(cell.v)}${hi}" data-r="${esc(row.id)}" data-c="${esc(col.id ?? i)}"${el}>${esc(cell.v)}</td>`;
    }).join('');
    const rowHtml = `<tr><th scope="row" data-r="${esc(row.id)}">${esc(row.label)}</th>${cells}</tr>`;
    if (isEmph) footRows.push(rowHtml); else bodyRows.push(rowHtml);
  }
  const tbody = `<tbody>${bodyRows.join('')}</tbody>`;
  const tfoot = footRows.length ? `<tfoot>${footRows.join('')}</tfoot>` : '';
  const cap = caption ? `<caption>${esc(caption)}</caption>` : '';
  const html = `<div class="table-scroll"><table class="data heat-table">${cap}${thead}${tbody}${tfoot}</table></div>`;

  const textModel = rows.map(row =>
    `${row.label}: ${row.cells.map((c, i) => `${(cols[i] || {}).label ?? i} ${c.v}`).join(', ')}.`);
  if (caption) textModel.unshift(caption);
  return { html, textModel };
}
