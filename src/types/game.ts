export type GemType = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'pink' | 'cyan' | 'lime' | 'magenta';
export type PowerUpType = 'bomb' | 'horizontal' | 'vertical' | 'rainbow' | null;

export interface Gem {
  id: string;
  type: GemType;
  row: number;
  col: number;
  matched?: boolean;
  powerUp?: PowerUpType;
  isNew?: boolean;
}

export interface Level {
  id: number;
  name: string;
  moves: number;
  goals: {
    type: GemType;
    count: number;
  }[];
  unlocked: boolean;
}

export interface GameState {
  board: (Gem | null)[][];
  score: number;
  moves: number;
  goals: {
    type: GemType;
    current: number;
    target: number;
  }[];
  isGameOver: boolean;
  isWon: boolean;
}
