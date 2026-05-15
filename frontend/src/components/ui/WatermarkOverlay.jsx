import React from 'react';

export function WatermarkOverlay() {
  return (
    <div className="watermark-overlay" aria-hidden="true">
      {Array.from({ length: 24 }).map((_, i) => (
        <span 
          key={i} 
          className="watermark-text"
          style={{
            top: `${Math.floor(i / 3) * 200 + 50}px`,
            left: `${(i % 3) * 33}%`,
          }}
        >
          CONTRACTLY
        </span>
      ))}
    </div>
  );
}
