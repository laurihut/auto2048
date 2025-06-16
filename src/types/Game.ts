export type GridType = (number | null)[][];

export interface Position {
  row: number;
  col: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

// Core tile with persistent ID - this is now the primary data structure
export interface GameTile {
  id: string;
  value: number;
  position: Position;
}

// Game state now uses tiles as primary data, grid is derived
export interface GameState {
  tiles: GameTile[];
  score: number;
  bestScore: number;
  gameOver: boolean;
  won: boolean;
}

// Move result with explicit tile movements
export interface MoveResult {
  tiles: GameTile[];
  score: number;
  tileMoves: TileMovement[];
  newTile?: GameTile;
}

// Explicit tile movement information
export interface TileMovement {
  tileId: string;
  from: Position;
  to: Position;
  type: 'move' | 'merge' | 'disappear';
  mergedInto?: string; // ID of the tile this merged into
}

// Legacy types for backward compatibility
export interface TileData {
  id: string;
  value: number;
  position: Position;
  previousPosition?: Position;
  isNew?: boolean;
}

export interface TileMove {
  id: string;
  value: number;
  from: Position;
  to: Position;
  merged?: boolean;
} 