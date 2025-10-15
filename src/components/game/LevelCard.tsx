import { Level } from "@/types/game";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface LevelCardProps {
  level: Level;
  onSelect: () => void;
}

export const LevelCard = ({ level, onSelect }: LevelCardProps) => {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="text-4xl font-bold text-primary">
            {level.unlocked ? level.id : <Lock className="w-8 h-8" />}
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-1">{level.name}</h3>
            <p className="text-sm text-muted-foreground">{level.moves} Hamle</p>
          </div>
          <Button
            onClick={onSelect}
            disabled={!level.unlocked}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            {level.unlocked ? 'Oyna' : 'Kilitli'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
