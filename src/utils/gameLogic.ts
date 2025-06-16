import { GridType, Direction, Position, GameTile, MoveResult, TileMovement } from '../types/Game';

const GRID_SIZE = 4;
let tileIdCounter = 0;

// Generate unique tile ID
const generateTileId = (): string => {
  return `tile-${++tileIdCounter}`;
};

// Convert tiles to grid for display/compatibility
export const tilesToGrid = (tiles: GameTile[]): GridType => {
  const grid: GridType = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
  
  tiles.forEach(tile => {
    grid[tile.position.row][tile.position.col] = tile.value;
  });
  
  return grid;
};

// Initialize empty grid (legacy compatibility)
export const initializeGrid = (): GridType => {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
};

// Create a new tile at random empty position
export const createRandomTile = (existingTiles: GameTile[]): GameTile | null => {
  const occupiedPositions = new Set(
    existingTiles.map(tile => `${tile.position.row}-${tile.position.col}`)
  );
  
  const emptyCells: Position[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!occupiedPositions.has(`${row}-${col}`)) {
        emptyCells.push({ row, col });
      }
    }
  }
  
  if (emptyCells.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const position = emptyCells[randomIndex];
  const value = Math.random() < 0.9 ? 2 : 4;
  
  return {
    id: generateTileId(),
    value,
    position
  };
};

// Initialize game with two random tiles
export const initializeGameTiles = (): GameTile[] => {
  console.log('=== Initializing Game with Tiles ===');
  tileIdCounter = 0;
  
  const tiles: GameTile[] = [];
  
  // Add first tile
  const firstTile = createRandomTile(tiles);
  if (firstTile) tiles.push(firstTile);
  
  // Add second tile
  const secondTile = createRandomTile(tiles);
  if (secondTile) tiles.push(secondTile);
  
  console.log('Initial tiles:', tiles);
  return tiles;
};

// Legacy function for backward compatibility
export const initializeGame = (): GridType => {
  const tiles = initializeGameTiles();
  return tilesToGrid(tiles);
};

// Add random tile (legacy compatibility)
export const addRandomTile = (grid: GridType): GridType => {
  // Convert grid to tiles, add new tile, convert back
  const tiles: GameTile[] = [];
  
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] !== null) {
        tiles.push({
          id: generateTileId(),
          value: grid[row][col]!,
          position: { row, col }
        });
      }
    }
  }
  
  const newTile = createRandomTile(tiles);
  if (newTile) tiles.push(newTile);
  
  return tilesToGrid(tiles);
};

// Core move function with explicit tile tracking
export const moveTiles = (tiles: GameTile[], direction: Direction): MoveResult => {
  console.log('=== Move Tiles ===');
  console.log('Direction:', direction);
  console.log('Input tiles:', tiles);
  
  const tileMoves: TileMovement[] = [];
  let totalScore = 0;
  
  // Group tiles by the line they'll move along
  const getLineKey = (pos: Position): number => {
    switch (direction) {
      case 'left':
      case 'right':
        return pos.row;
      case 'up':
      case 'down':
        return pos.col;
    }
  };
  
  const getPositionInLine = (pos: Position): number => {
    switch (direction) {
      case 'left':
      case 'up':
        return direction === 'left' ? pos.col : pos.row;
      case 'right':
        return GRID_SIZE - 1 - pos.col;
      case 'down':
        return GRID_SIZE - 1 - pos.row;
    }
  };
  
  const createNewPosition = (lineKey: number, positionInLine: number): Position => {
    switch (direction) {
      case 'left':
        return { row: lineKey, col: positionInLine };
      case 'right':
        return { row: lineKey, col: GRID_SIZE - 1 - positionInLine };
      case 'up':
        return { row: positionInLine, col: lineKey };
      case 'down':
        return { row: GRID_SIZE - 1 - positionInLine, col: lineKey };
    }
  };
  
  // Group tiles by line
  const lineGroups: { [key: number]: GameTile[] } = {};
  tiles.forEach(tile => {
    const lineKey = getLineKey(tile.position);
    if (!lineGroups[lineKey]) lineGroups[lineKey] = [];
    lineGroups[lineKey].push(tile);
  });
  
  const resultTiles: GameTile[] = [];
  
  // Process each line
  Object.keys(lineGroups).forEach(lineKeyStr => {
    const lineKey = parseInt(lineKeyStr);
    const lineTiles = lineGroups[lineKey];
    
    // Sort tiles by their position in the line
    lineTiles.sort((a, b) => getPositionInLine(a.position) - getPositionInLine(b.position));
    
    let newPositionInLine = 0;
    let i = 0;
    
    while (i < lineTiles.length) {
      const currentTile = lineTiles[i];
      const nextTile = i + 1 < lineTiles.length ? lineTiles[i + 1] : null;
      
      // Check if we can merge with the next tile
      if (nextTile && currentTile.value === nextTile.value) {
        // Merge tiles
        const newPosition = createNewPosition(lineKey, newPositionInLine);
        const mergedValue = currentTile.value * 2;
        totalScore += mergedValue;
        
        // Create merged tile (reuse first tile's ID)
        const mergedTile: GameTile = {
          id: currentTile.id,
          value: mergedValue,
          position: newPosition
        };
        resultTiles.push(mergedTile);
        
        // Record tile movements
        tileMoves.push({
          tileId: currentTile.id,
          from: currentTile.position,
          to: newPosition,
          type: 'merge'
        });
        
        tileMoves.push({
          tileId: nextTile.id,
          from: nextTile.position,
          to: newPosition,
          type: 'disappear',
          mergedInto: currentTile.id
        });
        
        console.log(`Merged ${currentTile.id}(${currentTile.value}) + ${nextTile.id}(${nextTile.value}) = ${mergedValue}`);
        
        newPositionInLine++;
        i += 2; // Skip both tiles
      } else {
        // Move tile without merging
        const newPosition = createNewPosition(lineKey, newPositionInLine);
        
        const movedTile: GameTile = {
          id: currentTile.id,
          value: currentTile.value,
          position: newPosition
        };
        resultTiles.push(movedTile);
        
        // Only record as a move if position actually changed
        if (currentTile.position.row !== newPosition.row || currentTile.position.col !== newPosition.col) {
          tileMoves.push({
            tileId: currentTile.id,
            from: currentTile.position,
            to: newPosition,
            type: 'move'
          });
          console.log(`Moved ${currentTile.id}(${currentTile.value}) from (${currentTile.position.row},${currentTile.position.col}) to (${newPosition.row},${newPosition.col})`);
        }
        
        newPositionInLine++;
        i++;
      }
    }
  });
  
  console.log('Result tiles:', resultTiles);
  console.log('Tile moves:', tileMoves);
  
  return {
    tiles: resultTiles,
    score: totalScore,
    tileMoves
  };
};

// Legacy move function for backward compatibility
export const moveGridWithTracking = (grid: GridType, direction: Direction) => {
  // Convert grid to tiles
  const tiles: GameTile[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] !== null) {
        tiles.push({
          id: generateTileId(),
          value: grid[row][col]!,
          position: { row, col }
        });
      }
    }
  }
  
  const result = moveTiles(tiles, direction);
  
  // Convert back to legacy format
  return {
    grid: tilesToGrid(result.tiles),
    score: result.score,
    moves: result.tileMoves.map(move => ({
      id: move.tileId,
      value: result.tiles.find(t => t.id === move.tileId)?.value || 0,
      from: move.from,
      to: move.to,
      merged: move.type === 'merge' || move.type === 'disappear'
    }))
  };
};

// Legacy function
export const moveGrid = (grid: GridType, direction: Direction): { grid: GridType, score: number } => {
  const result = moveGridWithTracking(grid, direction);
  return { grid: result.grid, score: result.score };
};

// Check if grids are equal
export const gridsEqual = (grid1: GridType, grid2: GridType): boolean => {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid1[row][col] !== grid2[row][col]) {
        return false;
      }
    }
  }
  return true;
};

// Check if tiles can move
export const canMoveTiles = (tiles: GameTile[]): boolean => {
  // Check for empty cells
  const occupiedPositions = new Set(
    tiles.map(tile => `${tile.position.row}-${tile.position.col}`)
  );
  
  if (occupiedPositions.size < GRID_SIZE * GRID_SIZE) {
    return true; // There are empty cells
  }
  
  // Check for possible merges
  const grid = tilesToGrid(tiles);
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const current = grid[row][col];
      // Check right neighbor
      if (col < GRID_SIZE - 1 && current === grid[row][col + 1]) {
        return true;
      }
      // Check bottom neighbor
      if (row < GRID_SIZE - 1 && current === grid[row + 1][col]) {
        return true;
      }
    }
  }
  
  return false;
};

// Legacy function
export const canMove = (grid: GridType): boolean => {
  const tiles: GameTile[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] !== null) {
        tiles.push({
          id: generateTileId(),
          value: grid[row][col]!,
          position: { row, col }
        });
      }
    }
  }
  return canMoveTiles(tiles);
};

// Check if player won (has 2048 tile)
export const hasWonTiles = (tiles: GameTile[]): boolean => {
  return tiles.some(tile => tile.value === 2048);
};

// Legacy function
export const hasWon = (grid: GridType): boolean => {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 2048) {
        return true;
      }
    }
  }
  return false;
};

// Get tile color based on value
export const getTileColor = (value: number | null): string => {
  if (value === null) return '#CDC1B4';
  
  const colors: { [key: number]: string } = {
    2: '#EEE4DA',
    4: '#EDE0C8',
    8: '#F2B179',
    16: '#F59563',
    32: '#F67C5F',
    64: '#F65E3B',
    128: '#EDCF72',
    256: '#EDCC61',
    512: '#EDC850',
    1024: '#EDC53F',
    2048: '#EDC22E',
  };
  
  return colors[value] || '#3C3A32';
};

// Get text color based on value
export const getTileTextColor = (value: number | null): string => {
  if (value === null) return 'transparent';
  return value <= 4 ? '#776E65' : '#F9F6F2';
}; 