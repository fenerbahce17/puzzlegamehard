import { GemType } from "@/types/game";

interface GameHeaderProps {
  score: number;
  moves: number;
  goals: {
    type: GemType;
    current: number;
    target: number;
  }[];
}

const gemIcons: Record<GemType, string> = {
  red: '💎',
  blue: '💠',
  green: '🔷',
  yellow: '⭐',
  purple: '💜',
  orange: '🔶',
  pink: '🌸',
  cyan: '💧',
  lime: '🍏',
  magenta: '🔮',
};

export const GameHeader = ({ score, moves, goals }: GameHeaderProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="bg-card/80 backdrop-blur-sm rounded-xl px-6 py-3 border border-border/50">
          <div className="text-sm text-muted-foreground">Skor</div>
          <div className="text-3xl font-bold text-primary">{score}</div>
        </div>
        
        <div className="bg-card/80 backdrop-blur-sm rounded-xl px-6 py-3 border border-border/50">
          <div className="text-sm text-muted-foreground">Hamle</div>
          <div className="text-3xl font-bold text-accent">{moves}</div>
        </div>
      </div>

      <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border/50">
        <div className="text-sm text-muted-foreground mb-2">Hedefler</div>
        <div className="flex gap-4 flex-wrap">
          {goals.map((goal, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-2xl">{gemIcons[goal.type]}</span>
              <span className="text-lg font-semibold">
                {goal.current}/{goal.target}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
