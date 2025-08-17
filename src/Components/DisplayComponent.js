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
