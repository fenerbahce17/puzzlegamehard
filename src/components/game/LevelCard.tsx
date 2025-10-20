import { Level } from "@/types/game";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { getCountryFlag } from "@/utils/countryFlags";

interface LevelCardProps {
  level: Level;
  onSelect: () => void;
}

export const LevelCard = ({ level, onSelect }: LevelCardProps) => {
  const flag = getCountryFlag(level.name);
  
  return (
    <Card className={`bg-card/80 backdrop-blur-sm border-border/50 transition-all ${level.unlocked ? 'hover:border-primary/50 hover:scale-105 cursor-pointer' : 'opacity-60'}`}>
      <CardContent className="p-4">
        <div className="flex flex-col items-center gap-3">
          {level.unlocked ? (
            <>
              <div className="text-5xl mb-1">
                {flag}
              </div>
              <div className="text-center">
                <h3 className="text-base font-semibold mb-1 line-clamp-1">{level.name}</h3>
                <p className="text-xs text-muted-foreground">Level {level.id} • {level.moves} Moves</p>
              </div>
              <Button
                onClick={onSelect}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-sm py-2"
              >
                Play
              </Button>
            </>
          ) : (
            <>
              <div className="text-5xl mb-1">
                {flag}
              </div>
              <div className="text-center">
                <h3 className="text-sm font-semibold text-muted-foreground line-clamp-1">{level.name}</h3>
                <p className="text-xs text-muted-foreground">Level {level.id}</p>
              </div>
              <Button
                disabled
                className="w-full text-sm py-2"
                variant="outline"
              >
                Locked
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
