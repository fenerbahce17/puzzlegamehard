import { useState, useEffect, useCallback, useRef } from "react";
import { Gem, GemType, PowerUpType } from "@/types/game";
import { GemTile } from "./GemTile";
import { cn } from "@/lib/utils";
import { soundManager } from "@/utils/soundManager";
import { ParticleEffect } from "./ParticleEffect";

interface GameBoardProps {
  onScoreChange: (score: number) => void;
  onMoveUsed: () => void;
  onGemsCollected: (type: GemType, count: number) => void;
  onCombo: (combo: number) => void;
  gameOver: boolean;
}

const BOARD_SIZE = 8;
const GEM_TYPES: GemType[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan', 'lime', 'magenta'];

const createRandomGem = (row: number, col: number): Gem => {
  const gem: Gem = {
    id: `${row}-${col}-${Math.random()}`,
    type: GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)],
    row,
    col,
    isNew: true,
  };
  
  // 5% chance to create a power-up on match of 4+
  if (Math.random() < 0.05) {
    const powerUps: PowerUpType[] = ['bomb', 'horizontal', 'vertical', 'rainbow'];
    gem.powerUp = powerUps[Math.floor(Math.random() * powerUps.length)];
  }
  
  return gem;
};

const initializeBoard = (): (Gem | null)[][] => {
  const board: (Gem | null)[][] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    board[row] = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      board[row][col] = createRandomGem(row, col);
    }
  }
  return board;
};

export const GameBoard = ({ onScoreChange, onMoveUsed, onGemsCollected, onCombo, gameOver }: GameBoardProps) => {
  const [board, setBoard] = useState<(Gem | null)[][]>(initializeBoard);
  const [selectedGem, setSelectedGem] = useState<{ row: number; col: number } | null>(null);
  const [particles, setParticles] = useState<Array<{ id: string; x: number; y: number; color: string }>>([]);
  const comboRef = useRef(0);
  const isProcessingRef = useRef(false);

  const checkMatches = useCallback((currentBoard: (Gem | null)[][]) => {
    const matchSet = new Set<string>();

    // Check horizontal matches
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE - 2; col++) {
        const gem = currentBoard[row][col];
        if (gem && !gem.powerUp &&
            currentBoard[row][col + 1]?.type === gem.type &&
            currentBoard[row][col + 2]?.type === gem.type) {
          matchSet.add(`${row}-${col}`);
          matchSet.add(`${row}-${col + 1}`);
          matchSet.add(`${row}-${col + 2}`);
          
          // Check for longer matches
          let extraCol = col + 3;
          while (extraCol < BOARD_SIZE && currentBoard[row][extraCol]?.type === gem.type) {
            matchSet.add(`${row}-${extraCol}`);
            extraCol++;
          }
        }
      }
    }

    // Check vertical matches
    for (let col = 0; col < BOARD_SIZE; col++) {
      for (let row = 0; row < BOARD_SIZE - 2; row++) {
        const gem = currentBoard[row][col];
        if (gem && !gem.powerUp &&
            currentBoard[row + 1][col]?.type === gem.type &&
            currentBoard[row + 2][col]?.type === gem.type) {
          matchSet.add(`${row}-${col}`);
          matchSet.add(`${row + 1}-${col}`);
          matchSet.add(`${row + 2}-${col}`);
          
          // Check for longer matches
          let extraRow = row + 3;
          while (extraRow < BOARD_SIZE && currentBoard[extraRow][col]?.type === gem.type) {
            matchSet.add(`${extraRow}-${col}`);
            extraRow++;
          }
        }
      }
    }

    return Array.from(matchSet).map(pos => {
      const [row, col] = pos.split('-').map(Number);
      return { row, col };
    });
  }, []);

  const removeMatches = useCallback((matches: { row: number; col: number }[]) => {
    if (matches.length === 0) {
      comboRef.current = 0;
      isProcessingRef.current = false;
      return;
    }

    const newBoard = board.map(row => [...row]);
    const gemsCollected: Record<GemType, number> = {
      red: 0, blue: 0, green: 0, yellow: 0, purple: 0, orange: 0, pink: 0, cyan: 0, lime: 0, magenta: 0
    };

    // Create particles for matched gems
    const newParticles: Array<{ id: string; x: number; y: number; color: string }> = [];
    
    matches.forEach(({ row, col }) => {
      const gem = newBoard[row][col];
      if (gem) {
        gemsCollected[gem.type]++;
        newBoard[row][col] = null;
        
        // Add particle effect
        newParticles.push({
          id: `particle-${row}-${col}-${Date.now()}`,
          x: col * 100 / 8,
          y: row * 100 / 8,
          color: gem.type,
        });
      }
    });

    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, 600);

    // Report collected gems
    Object.entries(gemsCollected).forEach(([type, count]) => {
      if (count > 0) {
        onGemsCollected(type as GemType, count);
      }
    });

    // Combo system
    comboRef.current++;
    const comboMultiplier = Math.min(comboRef.current, 5);
    const baseScore = matches.length * 10;
    const comboBonus = comboRef.current > 1 ? (comboRef.current - 1) * 20 : 0;
    const totalScore = (baseScore * comboMultiplier) + comboBonus;
    
    onScoreChange(totalScore);
    onCombo(comboRef.current);

    // Play sound based on combo
    if (comboRef.current >= 3) {
      soundManager.play('combo');
    } else if (comboRef.current === 2) {
      soundManager.play('cascade');
    } else {
      soundManager.play('match');
    }

    setBoard(newBoard);

    setTimeout(() => {
      dropGems(newBoard);
    }, 300);
  }, [board, onScoreChange, onGemsCollected, onCombo]);

  const dropGems = useCallback((currentBoard: (Gem | null)[][]) => {
    const newBoard = currentBoard.map(row => [...row]);
    
    for (let col = 0; col < BOARD_SIZE; col++) {
      let emptySpaces = 0;
      for (let row = BOARD_SIZE - 1; row >= 0; row--) {
        if (newBoard[row][col] === null) {
          emptySpaces++;
        } else if (emptySpaces > 0) {
          const gem = newBoard[row][col];
          if (gem) {
            gem.isNew = false;
          }
          newBoard[row + emptySpaces][col] = gem;
          newBoard[row][col] = null;
        }
      }
      
      for (let row = emptySpaces - 1; row >= 0; row--) {
        newBoard[row][col] = createRandomGem(row, col);
      }
    }

    setBoard(newBoard);

    setTimeout(() => {
      const newMatches = checkMatches(newBoard);
      if (newMatches.length > 0) {
        removeMatches(newMatches);
      } else {
        comboRef.current = 0;
        isProcessingRef.current = false;
      }
    }, 300);
  }, [checkMatches, removeMatches]);

  const swapGems = useCallback((row1: number, col1: number, row2: number, col2: number) => {
    if (isProcessingRef.current) return;
    
    isProcessingRef.current = true;
    soundManager.play('swap');
    
    const newBoard = board.map(row => [...row]);
    const temp = newBoard[row1][col1];
    newBoard[row1][col1] = newBoard[row2][col2];
    newBoard[row2][col2] = temp;

    setBoard(newBoard);

    setTimeout(() => {
      const matches = checkMatches(newBoard);
      if (matches.length > 0) {
        onMoveUsed();
        comboRef.current = 0;
        removeMatches(matches);
      } else {
        // Swap back if no matches
        soundManager.play('swap');
        const revertBoard = newBoard.map(row => [...row]);
        const temp = revertBoard[row1][col1];
        revertBoard[row1][col1] = revertBoard[row2][col2];
        revertBoard[row2][col2] = temp;
        setBoard(revertBoard);
        isProcessingRef.current = false;
      }
    }, 200);
  }, [board, checkMatches, removeMatches, onMoveUsed]);

  const handleGemClick = (row: number, col: number) => {
    if (gameOver || isProcessingRef.current) return;

    if (!selectedGem) {
      setSelectedGem({ row, col });
    } else {
      const rowDiff = Math.abs(selectedGem.row - row);
      const colDiff = Math.abs(selectedGem.col - col);
      
      if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
        swapGems(selectedGem.row, selectedGem.col, row, col);
      }
      setSelectedGem(null);
    }
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-8 gap-2 p-4 bg-card/50 rounded-2xl backdrop-blur-sm border border-border/50">
        {board.map((row, rowIndex) =>
          row.map((gem, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn("aspect-square", gameOver && "opacity-50 pointer-events-none")}
            >
              <GemTile
                gem={gem}
                isSelected={selectedGem?.row === rowIndex && selectedGem?.col === colIndex}
                onClick={() => handleGemClick(rowIndex, colIndex)}
              />
            </div>
          ))
        )}
      </div>
      
      {particles.map(particle => (
        <ParticleEffect
          key={particle.id}
          x={particle.x}
          y={particle.y}
          color={particle.color}
        />
      ))}
    </div>
  );
};
