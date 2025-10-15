export type GemType = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

export interface Gem {
  id: string;
  type: GemType;
  row: number;
  col: number;
  matched?: boolean;
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
