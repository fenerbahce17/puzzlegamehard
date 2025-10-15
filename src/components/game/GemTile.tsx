import { Gem } from "@/types/game";
import { cn } from "@/lib/utils";

interface GemTileProps {
  gem: Gem | null;
  isSelected?: boolean;
  onClick?: () => void;
}

const gemColors: Record<string, string> = {
  red: 'bg-[hsl(var(--gem-red))]',
  blue: 'bg-[hsl(var(--gem-blue))]',
  green: 'bg-[hsl(var(--gem-green))]',
  yellow: 'bg-[hsl(var(--gem-yellow))]',
  purple: 'bg-[hsl(var(--gem-purple))]',
  orange: 'bg-[hsl(var(--gem-orange))]',
  pink: 'bg-[hsl(var(--gem-pink))]',
  cyan: 'bg-[hsl(var(--gem-cyan))]',
  lime: 'bg-[hsl(var(--gem-lime))]',
  magenta: 'bg-[hsl(var(--gem-magenta))]',
};

const gemIcons: Record<string, string> = {
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

export const GemTile = ({ gem, isSelected, onClick }: GemTileProps) => {
  if (!gem) {
    return <div className="w-full h-full bg-muted/20 rounded-lg" />;
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full h-full rounded-xl transition-all duration-200 flex items-center justify-center text-4xl",
        "shadow-[var(--shadow-gem)] hover:scale-110 active:scale-95",
        gemColors[gem.type],
        isSelected && "ring-4 ring-foreground scale-110",
        gem.matched && "pop-out",
        "bounce-in gem-glow"
      )}
    >
      {gemIcons[gem.type]}
    </button>
  );
};
