import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GameBoard } from "@/components/game/GameBoard";
import { GameHeader } from "@/components/game/GameHeader";
import { GameOverModal } from "@/components/game/GameOverModal";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { GemType } from "@/types/game";
import { toast } from "sonner";

const LEVELS = [
  {
    id: 1,
    moves: 20,
    goals: [
      { type: 'red' as GemType, count: 15 },
      { type: 'blue' as GemType, count: 15 },
    ],
  },
  {
    id: 2,
    moves: 18,
    goals: [
      { type: 'green' as GemType, count: 20 },
      { type: 'yellow' as GemType, count: 20 },
    ],
  },
  {
    id: 3,
    moves: 15,
    goals: [
      { type: 'purple' as GemType, count: 25 },
      { type: 'orange' as GemType, count: 25 },
    ],
  },
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

  useEffect(() => {
    const allGoalsCompleted = goals.every(g => g.current >= g.target);
    if (allGoalsCompleted && moves >= 0) {
      setIsWon(true);
      setIsGameOver(true);
      toast.success("Seviyeyi tamamladın! 🎉");
    } else if (moves === 0 && !allGoalsCompleted) {
      setIsGameOver(true);
      toast.error("Hamle kalmadı! 😢");
    }
  }, [goals, moves]);

  const handleRestart = () => {
    setScore(0);
    setMoves(level.moves);
    setGoals(level.goals.map(g => ({ ...g, current: 0, target: g.count })));
    setIsGameOver(false);
    setIsWon(false);
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
          <div className="w-10" />
        </div>

        <GameHeader score={score} moves={moves} goals={goals} />
        <GameBoard
          onScoreChange={handleScoreChange}
          onMoveUsed={handleMoveUsed}
          onGemsCollected={handleGemsCollected}
          gameOver={isGameOver}
        />
      </div>

      <GameOverModal
        isOpen={isGameOver}
        isWon={isWon}
        score={score}
        onRestart={handleRestart}
        onLevelSelect={() => navigate('/')}
      />
    </div>
  );
}
