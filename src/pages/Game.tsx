import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GameBoard } from "@/components/game/GameBoard";
import { GameHeader } from "@/components/game/GameHeader";
import { GameOverModal } from "@/components/game/GameOverModal";
import { ComboDisplay } from "@/components/game/ComboDisplay";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { GemType } from "@/types/game";
import { toast } from "sonner";
import { soundManager } from "@/utils/soundManager";

const LEVELS = [
  { id: 1, name: '🇦🇫 Afganistan', moves: 30, goals: [{ type: 'red' as GemType, count: 10 }, { type: 'blue' as GemType, count: 10 }] },
  { id: 2, name: '🇪🇹 Etiyopya', moves: 30, goals: [{ type: 'green' as GemType, count: 12 }, { type: 'yellow' as GemType, count: 12 }] },
  { id: 3, name: '🇧🇩 Bangladeş', moves: 28, goals: [{ type: 'purple' as GemType, count: 15 }, { type: 'orange' as GemType, count: 15 }] },
  { id: 4, name: '🇳🇵 Nepal', moves: 28, goals: [{ type: 'pink' as GemType, count: 15 }, { type: 'cyan' as GemType, count: 15 }] },
  { id: 5, name: '🇰🇪 Kenya', moves: 26, goals: [{ type: 'lime' as GemType, count: 18 }, { type: 'magenta' as GemType, count: 18 }] },
  { id: 6, name: '🇵🇭 Filipinler', moves: 26, goals: [{ type: 'red' as GemType, count: 15 }, { type: 'blue' as GemType, count: 15 }, { type: 'green' as GemType, count: 15 }] },
  { id: 7, name: '🇻🇳 Vietnam', moves: 25, goals: [{ type: 'yellow' as GemType, count: 18 }, { type: 'purple' as GemType, count: 18 }] },
  { id: 8, name: '🇮🇩 Endonezya', moves: 25, goals: [{ type: 'orange' as GemType, count: 20 }, { type: 'pink' as GemType, count: 20 }] },
  { id: 9, name: '🇪🇬 Mısır', moves: 24, goals: [{ type: 'cyan' as GemType, count: 22 }, { type: 'lime' as GemType, count: 22 }] },
  { id: 10, name: '🇮🇳 Hindistan', moves: 24, goals: [{ type: 'magenta' as GemType, count: 20 }, { type: 'red' as GemType, count: 20 }] },
  { id: 11, name: '🇹🇭 Tayland', moves: 23, goals: [{ type: 'blue' as GemType, count: 20 }, { type: 'green' as GemType, count: 20 }, { type: 'yellow' as GemType, count: 20 }] },
  { id: 12, name: '🇧🇷 Brezilya', moves: 23, goals: [{ type: 'purple' as GemType, count: 25 }, { type: 'orange' as GemType, count: 25 }] },
  { id: 13, name: '🇲🇽 Meksika', moves: 22, goals: [{ type: 'pink' as GemType, count: 25 }, { type: 'cyan' as GemType, count: 25 }] },
  { id: 14, name: '🇦🇷 Arjantin', moves: 22, goals: [{ type: 'lime' as GemType, count: 22 }, { type: 'magenta' as GemType, count: 22 }, { type: 'red' as GemType, count: 22 }] },
  { id: 15, name: '🇿🇦 Güney Afrika', moves: 21, goals: [{ type: 'blue' as GemType, count: 28 }, { type: 'green' as GemType, count: 28 }] },
  { id: 16, name: '🇷🇺 Rusya', moves: 21, goals: [{ type: 'yellow' as GemType, count: 28 }, { type: 'purple' as GemType, count: 28 }] },
  { id: 17, name: '🇵🇱 Polonya', moves: 20, goals: [{ type: 'orange' as GemType, count: 25 }, { type: 'pink' as GemType, count: 25 }, { type: 'cyan' as GemType, count: 25 }] },
  { id: 18, name: '🇪🇸 İspanya', moves: 20, goals: [{ type: 'lime' as GemType, count: 30 }, { type: 'magenta' as GemType, count: 30 }] },
  { id: 19, name: '🇮🇹 İtalya', moves: 19, goals: [{ type: 'red' as GemType, count: 30 }, { type: 'blue' as GemType, count: 30 }] },
  { id: 20, name: '🇫🇷 Fransa', moves: 19, goals: [{ type: 'green' as GemType, count: 28 }, { type: 'yellow' as GemType, count: 28 }, { type: 'purple' as GemType, count: 28 }] },
  { id: 21, name: '🇬🇧 İngiltere', moves: 18, goals: [{ type: 'orange' as GemType, count: 32 }, { type: 'pink' as GemType, count: 32 }] },
  { id: 22, name: '🇨🇦 Kanada', moves: 18, goals: [{ type: 'cyan' as GemType, count: 30 }, { type: 'lime' as GemType, count: 30 }, { type: 'magenta' as GemType, count: 30 }] },
  { id: 23, name: '🇩🇪 Almanya', moves: 17, goals: [{ type: 'red' as GemType, count: 35 }, { type: 'blue' as GemType, count: 35 }] },
  { id: 24, name: '🇯🇵 Japonya', moves: 17, goals: [{ type: 'green' as GemType, count: 32 }, { type: 'yellow' as GemType, count: 32 }, { type: 'purple' as GemType, count: 32 }] },
  { id: 25, name: '🇹🇷 Türkiye', moves: 16, goals: [{ type: 'orange' as GemType, count: 35 }, { type: 'pink' as GemType, count: 35 }, { type: 'cyan' as GemType, count: 35 }] },
];

export default function Game() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const levelId = parseInt(searchParams.get('level') || '1');
  const level = LEVELS.find(l => l.id === levelId) || LEVELS[0];

  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(level.moves);
  const [goals, setGoals] = useState(
    level.goals.map(g => ({ ...g, current: 0, target: g.count }))
  );
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [combo, setCombo] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleScoreChange = (points: number) => {
    setScore(prev => prev + points);
  };

  const handleMoveUsed = () => {
    setMoves(prev => prev - 1);
  };

  const handleGemsCollected = (type: GemType, count: number) => {
    setGoals(prev =>
      prev.map(goal =>
        goal.type === type
          ? { ...goal, current: Math.min(goal.current + count, goal.target) }
          : goal
      )
    );
  };

  const handleCombo = (comboCount: number) => {
    setCombo(comboCount);
    if (comboCount > 1) {
      setTimeout(() => setCombo(0), 2000);
    }
  };

  const toggleSound = () => {
    const newState = soundManager.toggle();
    setSoundEnabled(newState);
  };

  useEffect(() => {
    const allGoalsCompleted = goals.every(g => g.current >= g.target);
    if (allGoalsCompleted && moves >= 0) {
      setIsWon(true);
      setIsGameOver(true);
      
      // Bir sonraki seviyeyi aç
      const currentUnlocked = parseInt(localStorage.getItem('unlockedLevel') || '1');
      if (levelId >= currentUnlocked && levelId < 25) {
        localStorage.setItem('unlockedLevel', String(levelId + 1));
        window.dispatchEvent(new Event('levelComplete'));
      }
      
      toast.success("Seviyeyi tamamladın! 🎉");
    } else if (moves === 0 && !allGoalsCompleted) {
      setIsGameOver(true);
      toast.error("Hamle kalmadı! 😢");
    }
  }, [goals, moves, levelId]);

  const handleRestart = () => {
    setScore(0);
    setMoves(level.moves);
    setGoals(level.goals.map(g => ({ ...g, current: 0, target: g.count })));
    setIsGameOver(false);
    setIsWon(false);
    setCombo(0);
  };

  return (
    <div className="min-h-screen p-4 flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold">{level.name}</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSound}
            className="rounded-full"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>

        <GameHeader score={score} moves={moves} goals={goals} />
        
        {combo > 1 && <ComboDisplay combo={combo} />}
        
        <GameBoard
          onScoreChange={handleScoreChange}
          onMoveUsed={handleMoveUsed}
          onGemsCollected={handleGemsCollected}
          onCombo={handleCombo}
          gameOver={isGameOver}
        />
      </div>

      <GameOverModal
        isOpen={isGameOver}
        isWon={isWon}
        score={score}
        onRestart={handleRestart}
        onLevelSelect={() => navigate('/')}
        onNextLevel={isWon && levelId < 25 ? () => navigate(`/game?level=${levelId + 1}`) : undefined}
      />
    </div>
  );
}
