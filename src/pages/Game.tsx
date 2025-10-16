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
  { id: 1, moves: 25, goals: [{ type: 'red' as GemType, count: 15 }, { type: 'blue' as GemType, count: 15 }] },
  { id: 2, moves: 23, goals: [{ type: 'green' as GemType, count: 18 }, { type: 'yellow' as GemType, count: 18 }] },
  { id: 3, moves: 20, goals: [{ type: 'purple' as GemType, count: 22 }, { type: 'orange' as GemType, count: 22 }] },
  { id: 4, moves: 20, goals: [{ type: 'pink' as GemType, count: 25 }, { type: 'cyan' as GemType, count: 25 }] },
  { id: 5, moves: 18, goals: [{ type: 'lime' as GemType, count: 28 }, { type: 'magenta' as GemType, count: 28 }] },
  { id: 6, moves: 18, goals: [{ type: 'red' as GemType, count: 20 }, { type: 'blue' as GemType, count: 20 }, { type: 'green' as GemType, count: 20 }] },
  { id: 7, moves: 16, goals: [{ type: 'yellow' as GemType, count: 25 }, { type: 'purple' as GemType, count: 25 }, { type: 'orange' as GemType, count: 25 }] },
  { id: 8, moves: 16, goals: [{ type: 'pink' as GemType, count: 30 }, { type: 'cyan' as GemType, count: 30 }] },
  { id: 9, moves: 15, goals: [{ type: 'lime' as GemType, count: 35 }, { type: 'red' as GemType, count: 35 }] },
  { id: 10, moves: 15, goals: [{ type: 'blue' as GemType, count: 30 }, { type: 'green' as GemType, count: 30 }, { type: 'yellow' as GemType, count: 30 }] },
  { id: 11, moves: 14, goals: [{ type: 'purple' as GemType, count: 35 }, { type: 'orange' as GemType, count: 35 }] },
  { id: 12, moves: 14, goals: [{ type: 'pink' as GemType, count: 40 }, { type: 'magenta' as GemType, count: 40 }] },
  { id: 13, moves: 13, goals: [{ type: 'cyan' as GemType, count: 35 }, { type: 'lime' as GemType, count: 35 }, { type: 'red' as GemType, count: 35 }] },
  { id: 14, moves: 13, goals: [{ type: 'blue' as GemType, count: 40 }, { type: 'green' as GemType, count: 40 }] },
  { id: 15, moves: 12, goals: [{ type: 'yellow' as GemType, count: 45 }, { type: 'purple' as GemType, count: 45 }] },
  { id: 16, moves: 12, goals: [{ type: 'orange' as GemType, count: 40 }, { type: 'pink' as GemType, count: 40 }, { type: 'cyan' as GemType, count: 40 }] },
  { id: 17, moves: 11, goals: [{ type: 'lime' as GemType, count: 45 }, { type: 'magenta' as GemType, count: 45 }] },
  { id: 18, moves: 11, goals: [{ type: 'red' as GemType, count: 50 }, { type: 'blue' as GemType, count: 50 }] },
  { id: 19, moves: 10, goals: [{ type: 'green' as GemType, count: 45 }, { type: 'yellow' as GemType, count: 45 }, { type: 'purple' as GemType, count: 45 }] },
  { id: 20, moves: 10, goals: [{ type: 'orange' as GemType, count: 55 }, { type: 'pink' as GemType, count: 55 }] },
  { id: 21, moves: 9, goals: [{ type: 'cyan' as GemType, count: 50 }, { type: 'lime' as GemType, count: 50 }, { type: 'magenta' as GemType, count: 50 }] },
  { id: 22, moves: 9, goals: [{ type: 'red' as GemType, count: 60 }, { type: 'blue' as GemType, count: 60 }] },
  { id: 23, moves: 8, goals: [{ type: 'green' as GemType, count: 55 }, { type: 'yellow' as GemType, count: 55 }, { type: 'purple' as GemType, count: 55 }] },
  { id: 24, moves: 8, goals: [{ type: 'orange' as GemType, count: 65 }, { type: 'pink' as GemType, count: 65 }] },
  { id: 25, moves: 7, goals: [{ type: 'cyan' as GemType, count: 60 }, { type: 'lime' as GemType, count: 60 }, { type: 'magenta' as GemType, count: 60 }, { type: 'red' as GemType, count: 60 }] },
];

export default function Game() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const levelId = parseInt(searchParams.get('level') || '1');
  const level = LEVELS[levelId - 1];

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
          <h1 className="text-2xl font-bold">Seviye {levelId}</h1>
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
