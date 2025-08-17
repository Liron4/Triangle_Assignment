import React from 'react';
import './CSS/Components.css';

const toSvgY = (y) => 800 - y;

const DisplayComponent = ({ points = [], onReset }) => {
  const svgPoints = points.map((p) => `${p.x},${toSvgY(p.y)}`).join(' ');

  const centroid = points.length
    ? {
        x: Math.round(points.reduce((s, p) => s + p.x, 0) / points.length),
        y: Math.round(points.reduce((s, p) => s + p.y, 0) / points.length),
      }
    : { x: 400, y: 400 };

  const size = 800;
  const step = 100;
  const ticks = Array.from({ length: size / step + 1 }, (_, i) => i * step);

  // Helpers for angle calculation and arc path
  const len = (v) => Math.hypot(v.x, v.y);
  const norm = (v) => {
    const l = len(v);
    return l > 1e-6 ? { x: v.x / l, y: v.y / l } : null;
  };
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  const computeAngleData = () => {
    if (points.length < 3) return [];
    const svgPts = points.map((p) => ({ x: p.x, y: toSvgY(p.y) }));
    const r = 32; // arc radius
    return [0, 1, 2].map((i) => {
      const prev = svgPts[(i + 2) % 3];
      const curr = svgPts[i];
      const next = svgPts[(i + 1) % 3];

      const v1 = norm({ x: prev.x - curr.x, y: prev.y - curr.y });
      const v2 = norm({ x: next.x - curr.x, y: next.y - curr.y });
      if (!v1 || !v2) return null;

      const dot = clamp(v1.x * v2.x + v1.y * v2.y, -1, 1);
      const angleRad = Math.acos(dot);
      const angleDeg = (angleRad * 180) / Math.PI;

      // Arc endpoints
      const s = { x: curr.x + v1.x * r, y: curr.y + v1.y * r };
      const e = { x: curr.x + v2.x * r, y: curr.y + v2.y * r };
      const cross = v1.x * v2.y - v1.y * v2.x;
      const sweep = cross > 0 ? 1 : 0;
      const d = `M ${s.x} ${s.y} A ${r} ${r} 0 0 ${sweep} ${e.x} ${e.y}`;

      // Angle label along internal bisector
      const bis = norm({ x: v1.x + v2.x, y: v1.y + v2.y }) || { x: 0, y: -1 };
      const labelDist = r + 22;
      const label = { x: curr.x + bis.x * labelDist, y: curr.y + bis.y * labelDist };

      return { d, label, angleDeg: Math.round(angleDeg * 10) / 10 };
    }).filter(Boolean);
  };

  const angleData = computeAngleData();

  return (
    <div className="tc-display">
      <div className="display-header">
        <h2>Triangle Display (800×800)</h2>
        <button className="secondary" onClick={onReset}>Reset</button>
      </div>
      <svg width="800" height="800" viewBox="0 0 800 800" className="triangle-svg">
        {/* Grid lines */}
        <g className="grid">
          {ticks.map((t) => (
            <line key={`h-${t}`} x1={0} y1={toSvgY(t)} x2={size} y2={toSvgY(t)} className="grid-line" />
          ))}
          {ticks.map((t) => (
            <line key={`v-${t}`} x1={t} y1={0} x2={t} y2={size} className="grid-line" />
          ))}
        </g>

        {/* Axes */}
        <g className="axes">
          {/* Y axis at x=0 */}
          <line x1={0} y1={0} x2={0} y2={size} className="axis" />
          {/* X axis at y=0 (bottom) */}
          <line x1={0} y1={size} x2={size} y2={size} className="axis" />
        </g>

        {/* Axis labels (every 100) */}
        <g className="axis-labels">
          {ticks.map((t) => {
            const isMin = t === 0;
            const isMax = t === size;
            const x = isMax ? size - 6 : isMin ? 6 : t;
            const anchor = isMax ? 'end' : isMin ? 'start' : 'middle';
            return (
              <text key={`xl-${t}`} x={x} y={size - 6} className="axis-label" textAnchor={anchor}>{t}</text>
            );
          })}
          {ticks.filter((t) => t !== 0).map((t) => {
            const isMax = t === size; // 800 label at the top
            const y = isMax ? 6 : toSvgY(t) - 2;
            const baseline = isMax ? 'hanging' : 'alphabetic';
            return (
              <text key={`yl-${t}`} x={6} y={y} className="axis-label" textAnchor="start" dominantBaseline={baseline}>{t}</text>
            );
          })}
        </g>

        {/* Triangle */}
        {points.length >= 3 && (
          <polygon points={svgPoints} className="triangle-polygon" />
        )}
        {/* Angle arcs and labels */}
        {points.length >= 3 && (
          <g className="angles">
            {angleData.map((a, idx) => (
              <g key={`ang-${idx}`}>
                <path d={a.d} className="angle-arc" />
                <text x={a.label.x} y={a.label.y} className="angle-label" textAnchor="middle">
                  {a.angleDeg}°
                </text>
              </g>
            ))}
          </g>
        )}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={toSvgY(p.y)} r="6" className="vertex" />
            <text x={p.x + 10} y={toSvgY(p.y) - 10} className="vertex-label">{`(${p.x}, ${p.y})`}</text>
          </g>
        ))}
        {points.length >= 3 && (
          <text x={centroid.x} y={toSvgY(centroid.y)} className="centroid-label" textAnchor="middle">
            Coordinates
          </text>
        )}
      </svg>

  {/* no back button; reset is near the title */}
    </div>
  );
};

export default DisplayComponent;
