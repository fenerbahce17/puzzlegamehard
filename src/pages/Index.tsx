import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LevelCard } from "@/components/game/LevelCard";
import { Level } from "@/types/game";
import { LEVELS } from "@/pages/Game";

const createInitialLevels = (): Level[] => {
  const unlockedLevel = parseInt(localStorage.getItem('unlockedLevel') || '1');
  
  return LEVELS.map(level => ({
    ...level,
    unlocked: level.id <= unlockedLevel,
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
    <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-block">
            <h1 className="text-7xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-2xl tracking-tight">
              🌍 City Match 3 Quest
            </h1>
          </div>
          <p className="text-2xl font-semibold text-foreground/90">
            Conquer the World, Match the Gems!
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start your adventure in 400 cities around the world. Face new challenges at each level and travel the entire world!
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 bg-card/60 backdrop-blur-sm rounded-full px-4 py-2 border border-border/50">
              <span className="text-2xl">🎯</span>
              <span>Complete Goals</span>
            </div>
            <div className="flex items-center gap-2 bg-card/60 backdrop-blur-sm rounded-full px-4 py-2 border border-border/50">
              <span className="text-2xl">⚡</span>
              <span>Make Combos</span>
            </div>
            <div className="flex items-center gap-2 bg-card/60 backdrop-blur-sm rounded-full px-4 py-2 border border-border/50">
              <span className="text-2xl">🏆</span>
              <span>Unlock Levels</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {levels.map((level) => (
            <LevelCard
              key={level.id}
              level={level}
              onSelect={() => handleLevelSelect(level.id)}
            />
          ))}
        </div>

        <div className="mt-12 text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-primary/20 shadow-lg">
            <span className="text-3xl">✨</span>
            <span className="text-lg font-semibold text-foreground">
              Match 3 or more gems to make combos!
            </span>
            <span className="text-3xl">✨</span>
          </div>
        </div>
      </div>
    </div>
  );
}
