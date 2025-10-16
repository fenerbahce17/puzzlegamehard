import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LevelCard } from "@/components/game/LevelCard";
import { Level } from "@/types/game";

const TOTAL_LEVELS = 25;

const createInitialLevels = (): Level[] => {
  const unlockedLevel = parseInt(localStorage.getItem('unlockedLevel') || '1');
  
  return Array.from({ length: TOTAL_LEVELS }, (_, i) => ({
    id: i + 1,
    name: i < 5 ? "Kolay" : i < 10 ? "Orta" : i < 15 ? "Zor" : i < 20 ? "Çok Zor" : "Efsane",
    moves: 25 - Math.floor(i * 0.7),
    goals: [],
    unlocked: i + 1 <= unlockedLevel,
  }));
};

export default function Index() {
  const navigate = useNavigate();
  const [levels, setLevels] = useState<Level[]>(createInitialLevels);

  useEffect(() => {
    // Seviye tamamlandığında güncelleme için event listener
    const handleLevelComplete = () => {
      setLevels(createInitialLevels());
    };
    
    window.addEventListener('levelComplete', handleLevelComplete);
    return () => window.removeEventListener('levelComplete', handleLevelComplete);
  }, []);

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

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
