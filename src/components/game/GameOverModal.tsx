import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GameOverModalProps {
  isOpen: boolean;
  isWon: boolean;
  score: number;
  onRestart: () => void;
  onLevelSelect: () => void;
  onNextLevel?: () => void;
}

export const GameOverModal = ({
  isOpen,
  isWon,
  score,
  onRestart,
  onLevelSelect,
  onNextLevel,
}: GameOverModalProps) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="bg-card/95 backdrop-blur-sm border-border/50">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center mb-2">
            {isWon ? '🎉 Congratulations!' : '😢 Game Over'}
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            {isWon
              ? 'You successfully completed the level!'
              : 'No moves left! Try again.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="text-center py-4">
          <div className="text-sm text-muted-foreground">Total Score</div>
          <div className="text-4xl font-bold text-primary">{score}</div>
        </div>

        <div className="flex gap-3">
          {isWon && onNextLevel && (
            <Button
              onClick={onNextLevel}
              className="flex-1 bg-gradient-to-r from-primary to-accent"
            >
              Next Level
            </Button>
          )}
          <Button
            onClick={onRestart}
            variant="outline"
            className="flex-1"
          >
            Restart
          </Button>
          <Button
            onClick={onLevelSelect}
            variant="outline"
            className="flex-1"
          >
            Level Select
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
