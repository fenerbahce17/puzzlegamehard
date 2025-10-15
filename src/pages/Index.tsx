import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LevelCard } from "@/components/game/LevelCard";
import { Level } from "@/types/game";

const INITIAL_LEVELS: Level[] = [
  {
    id: 1,
    name: "Başlangıç",
    moves: 20,
    goals: [
      { type: 'red', count: 15 },
      { type: 'blue', count: 15 },
    ],
    unlocked: true,
  },
  {
    id: 2,
    name: "Zorlu Seviye",
    moves: 18,
    goals: [
      { type: 'green', count: 20 },
      { type: 'yellow', count: 20 },
    ],
    unlocked: true,
  },
  {
    id: 3,
    name: "Usta Seviye",
    moves: 15,
    goals: [
      { type: 'purple', count: 25 },
      { type: 'orange', count: 25 },
    ],
    unlocked: true,
  },
];

export default function Index() {
  const navigate = useNavigate();
  const [levels] = useState<Level[]>(INITIAL_LEVELS);

  const handleLevelSelect = (levelId: number) => {
    navigate(`/game?level=${levelId}`);
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            💎 Gem Quest
          </h1>
          <p className="text-xl text-muted-foreground">
            Renkli taşları eşleştir, seviyeleri aş!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {levels.map((level) => (
            <LevelCard
              key={level.id}
              level={level}
              onSelect={() => handleLevelSelect(level.id)}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full px-6 py-3 border border-border/50">
            <span className="text-sm text-muted-foreground">
              3 taş veya daha fazlasını eşleştir!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
