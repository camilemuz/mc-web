import React, { useRef, useState } from 'react';

interface SpotlightProps {
  children: React.ReactNode;
  className?: string;
  radius?: number;
}

export const Spotlight: React.FC<SpotlightProps> = ({
  children,
  className = '',
  radius = 280,
}) => {
  const [position, setPosition] = useState({ x: -9999, y: -9999 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden group/spot ${className}`}
    >
      {/* Radial cursor highlight glow in Club MC Red */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(${radius}px circle at ${position.x}px ${position.y}px, rgba(230, 0, 43, 0.16), transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
};
