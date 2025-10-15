import { useState, useEffect, useCallback } from "react";
import { Gem, GemType } from "@/types/game";
import { GemTile } from "./GemTile";
import { cn } from "@/lib/utils";

interface GameBoardProps {
  onScoreChange: (score: number) => void;
  onMoveUsed: () => void;
  onGemsCollected: (type: GemType, count: number) => void;
  gameOver: boolean;
}

const BOARD_SIZE = 8;
const GEM_TYPES: GemType[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

const createRandomGem = (row: number, col: number): Gem => ({
  id: `${row}-${col}-${Math.random()}`,
  type: GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)],
  row,
  col,
});

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

export const GameBoard = ({ onScoreChange, onMoveUsed, onGemsCollected, gameOver }: GameBoardProps) => {
  const [board, setBoard] = useState<(Gem | null)[][]>(initializeBoard);
  const [selectedGem, setSelectedGem] = useState<{ row: number; col: number } | null>(null);

  const checkMatches = useCallback((currentBoard: (Gem | null)[][]) => {
    const matches: { row: number; col: number }[] = [];

    // Check horizontal matches
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE - 2; col++) {
        const gem = currentBoard[row][col];
        if (gem && 
            currentBoard[row][col + 1]?.type === gem.type &&
            currentBoard[row][col + 2]?.type === gem.type) {
          matches.push({ row, col }, { row, col: col + 1 }, { row, col: col + 2 });
        }
      }
    }

    // Check vertical matches
    for (let col = 0; col < BOARD_SIZE; col++) {
      for (let row = 0; row < BOARD_SIZE - 2; row++) {
        const gem = currentBoard[row][col];
        if (gem && 
            currentBoard[row + 1][col]?.type === gem.type &&
            currentBoard[row + 2][col]?.type === gem.type) {
          matches.push({ row, col }, { row: row + 1, col }, { row: row + 2, col });
        }
      }
    }

    return matches;
  }, []);

  const removeMatches = useCallback((matches: { row: number; col: number }[]) => {
    if (matches.length === 0) return;

    const newBoard = board.map(row => [...row]);
    const gemsCollected: Record<GemType, number> = {
      red: 0, blue: 0, green: 0, yellow: 0, purple: 0, orange: 0
    };

    matches.forEach(({ row, col }) => {
      const gem = newBoard[row][col];
      if (gem) {
        gemsCollected[gem.type]++;
        newBoard[row][col] = null;
      }
    });

    // Report collected gems
    Object.entries(gemsCollected).forEach(([type, count]) => {
      if (count > 0) {
        onGemsCollected(type as GemType, count);
      }
    });

    onScoreChange(matches.length * 10);
    setBoard(newBoard);

    setTimeout(() => {
      dropGems(newBoard);
    }, 300);
  }, [board, onScoreChange, onGemsCollected]);

  const dropGems = useCallback((currentBoard: (Gem | null)[][]) => {
    const newBoard = currentBoard.map(row => [...row]);
    
    for (let col = 0; col < BOARD_SIZE; col++) {
      let emptySpaces = 0;
      for (let row = BOARD_SIZE - 1; row >= 0; row--) {
        if (newBoard[row][col] === null) {
          emptySpaces++;
        } else if (emptySpaces > 0) {
          newBoard[row + emptySpaces][col] = newBoard[row][col];
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
      }
    }, 300);
  }, [checkMatches, removeMatches]);

  const swapGems = useCallback((row1: number, col1: number, row2: number, col2: number) => {
    const newBoard = board.map(row => [...row]);
    const temp = newBoard[row1][col1];
    newBoard[row1][col1] = newBoard[row2][col2];
    newBoard[row2][col2] = temp;

    setBoard(newBoard);

    setTimeout(() => {
      const matches = checkMatches(newBoard);
      if (matches.length > 0) {
        onMoveUsed();
        removeMatches(matches);
      } else {
        // Swap back if no matches
        const revertBoard = newBoard.map(row => [...row]);
        const temp = revertBoard[row1][col1];
        revertBoard[row1][col1] = revertBoard[row2][col2];
        revertBoard[row2][col2] = temp;
        setBoard(revertBoard);
      }
    }, 200);
  }, [board, checkMatches, removeMatches, onMoveUsed]);

  const handleGemClick = (row: number, col: number) => {
    if (gameOver) return;

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
  );
};
