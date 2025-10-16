import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LevelCard } from "@/components/game/LevelCard";
import { Level } from "@/types/game";

const TOTAL_LEVELS = 25;

const LEVEL_NAMES = [
  '🇦🇫 Afganistan', '🇪🇹 Etiyopya', '🇧🇩 Bangladeş', '🇳🇵 Nepal', '🇰🇪 Kenya',
  '🇵🇭 Filipinler', '🇻🇳 Vietnam', '🇮🇩 Endonezya', '🇪🇬 Mısır', '🇮🇳 Hindistan',
  '🇹🇭 Tayland', '🇧🇷 Brezilya', '🇲🇽 Meksika', '🇦🇷 Arjantin', '🇿🇦 Güney Afrika',
  '🇷🇺 Rusya', '🇵🇱 Polonya', '🇪🇸 İspanya', '🇮🇹 İtalya', '🇫🇷 Fransa',
  '🇬🇧 İngiltere', '🇨🇦 Kanada', '🇩🇪 Almanya', '🇯🇵 Japonya', '🇹🇷 Türkiye'
];

const LEVEL_MOVES = [30, 30, 28, 28, 26, 26, 25, 25, 24, 24, 23, 23, 22, 22, 21, 21, 20, 20, 19, 19, 18, 18, 17, 17, 16];

const createInitialLevels = (): Level[] => {
  const unlockedLevel = parseInt(localStorage.getItem('unlockedLevel') || '1');
  
  return Array.from({ length: TOTAL_LEVELS }, (_, i) => ({
    id: i + 1,
    name: LEVEL_NAMES[i],
    moves: LEVEL_MOVES[i],
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
    <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-block animate-bounce">
            <h1 className="text-7xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent drop-shadow-2xl">
              💎 Gem Quest
            </h1>
          </div>
          <p className="text-2xl font-semibold text-foreground/90">
            Dünyayı Fethet, Taşları Eşleştir!
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            25 farklı ülkede macerana başla. Her seviyede yeni zorluklarla karşılaş ve Türkiye'ye ulaşmak için tüm dünyayı dolaş!
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 bg-card/60 backdrop-blur-sm rounded-full px-4 py-2 border border-border/50">
              <span className="text-2xl">🎯</span>
              <span>Hedefleri Tamamla</span>
            </div>
            <div className="flex items-center gap-2 bg-card/60 backdrop-blur-sm rounded-full px-4 py-2 border border-border/50">
              <span className="text-2xl">⚡</span>
              <span>Kombo Yap</span>
            </div>
            <div className="flex items-center gap-2 bg-card/60 backdrop-blur-sm rounded-full px-4 py-2 border border-border/50">
              <span className="text-2xl">🏆</span>
              <span>Seviyeleri Aç</span>
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
              3 veya daha fazla taşı eşleştirerek kombo yap!
            </span>
            <span className="text-3xl">✨</span>
          </div>
        </div>
      </div>
    </div>
  );
}
