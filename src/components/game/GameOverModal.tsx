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
}

export const GameOverModal = ({
  isOpen,
  isWon,
  score,
  onRestart,
  onLevelSelect,
}: GameOverModalProps) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="bg-card/95 backdrop-blur-sm border-border/50">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center mb-2">
            {isWon ? '🎉 Tebrikler!' : '😢 Oyun Bitti'}
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            {isWon
              ? 'Seviyeyi başarıyla tamamladın!'
              : 'Hamle kalmadı! Tekrar dene.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="text-center py-4">
          <div className="text-sm text-muted-foreground">Toplam Skor</div>
          <div className="text-4xl font-bold text-primary">{score}</div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onRestart}
            className="flex-1 bg-gradient-to-r from-primary to-accent"
          >
            Tekrar Oyna
          </Button>
          <Button
            onClick={onLevelSelect}
            variant="outline"
            className="flex-1"
          >
            Seviye Seç
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
