import React, { useEffect, useState } from 'react';
import './CSS/Components.css';

const defaultPoints = [
  { x: 100, y: 100 },
  { x: 400, y: 600 },
  { x: 700, y: 200 },
];

const InputComponent = ({ onSubmit, resetKey }) => {
  const [pts, setPts] = useState(defaultPoints);

  useEffect(() => {
    setPts(defaultPoints);
  }, [resetKey]);

  const handleChange = (idx, key, value) => {
    const num = Number(value || 0);
    setPts((prev) => prev.map((p, i) => (i === idx ? { ...p, [key]: num } : p)));
  };

  const submit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(pts);
  };

  return (
    <form className="tc-input-form" onSubmit={submit}>
      <h2>Enter three points (X, Y) — range 0–800</h2>
      {pts.map((p, i) => (
        <div key={i} className="point-row">
          <label className="point-label">Point {i + 1}:</label>
          <input
            type="number"
            min="0"
            max="800"
            value={p.x}
            onChange={(e) => handleChange(i, 'x', e.target.value)}
            className="point-input"
          />
          <input
            type="number"
            min="0"
            max="800"
            value={p.y}
            onChange={(e) => handleChange(i, 'y', e.target.value)}
            className="point-input"
          />
        </div>
      ))}

      <div className="form-actions">
        <button type="submit" className="primary">Show Triangle</button>
      </div>
    </form>
  );
};

export default InputComponent;
