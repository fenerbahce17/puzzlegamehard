import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ParticleEffectProps {
  x: number;
  y: number;
  color: string;
}

export const ParticleEffect = ({ x, y, color }: ParticleEffectProps) => {
  const [particles] = useState(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      angle: (i * 360) / 8,
      distance: Math.random() * 50 + 20,
    }))
  );

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={cn(
            "absolute w-2 h-2 rounded-full animate-particle",
            `bg-[hsl(var(--gem-${color}))]`
          )}
          style={{
            transform: `rotate(${particle.angle}deg) translateX(${particle.distance}px)`,
            animationDuration: '0.6s',
          }}
        />
      ))}
    </div>
  );
};
