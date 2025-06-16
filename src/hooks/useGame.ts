import { useState, useCallback, useEffect } from 'react';
import { GameState, Direction, GameTile, TileMovement } from '../types/Game';
import { 
  initializeGameTiles, 
  moveTiles, 
  createRandomTile, 
  canMoveTiles, 
  hasWonTiles,
  tilesToGrid
} from '../utils/gameLogic';

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>(() => ({
    tiles: initializeGameTiles(),
    score: 0,
    bestScore: 0,
    gameOver: false,
    won: false,
  }));
  
  const [lastTileMoves, setLastTileMoves] = useState<TileMovement[]>([]);
  const [newTile, setNewTile] = useState<GameTile | null>(null);
  const [gameKey, setGameKey] = useState(0); // Force component remount on restart

  // Update best score when score changes
  useEffect(() => {
    if (gameState.score > gameState.bestScore) {
      setGameState(prev => ({ ...prev, bestScore: gameState.score }));
    }
  }, [gameState.score, gameState.bestScore]);

  // Check for win condition
  useEffect(() => {
    if (hasWonTiles(gameState.tiles) && !gameState.won) {
      setGameState(prev => ({ ...prev, won: true }));
    }
  }, [gameState.tiles, gameState.won]);

  const move = useCallback((direction: Direction) => {
    console.log('=== Game Move ===');
    console.log('Direction:', direction);
    console.log('Current tiles:', gameState.tiles);
    
    if (gameState.gameOver) {
      console.log('Game over, move ignored');
      return;
    }

    const moveResult = moveTiles(gameState.tiles, direction);
    console.log('Move result:', moveResult);
    
    // Check if any tiles actually moved
    const tilesChanged = moveResult.tileMoves.length > 0;
    if (!tilesChanged) {
      console.log('No tiles moved, invalid move');
      return;
    }

    // Store move information for animations
    setLastTileMoves(moveResult.tileMoves);

    // Add new random tile
    const newRandomTile = createRandomTile(moveResult.tiles);
    let finalTiles = moveResult.tiles;
    
    if (newRandomTile) {
      finalTiles = [...moveResult.tiles, newRandomTile];
      setNewTile(newRandomTile);
      console.log('Added new tile:', newRandomTile);
    } else {
      setNewTile(null);
    }
    
    // Update score
    const newScore = gameState.score + moveResult.score;
    
    // Check if game is over
    const isGameOver = !canMoveTiles(finalTiles);
    
    setGameState(prev => ({
      tiles: finalTiles,
      score: newScore,
      bestScore: Math.max(prev.bestScore, newScore),
      gameOver: isGameOver,
      won: prev.won, // Keep existing win state
    }));
    
    console.log('Final game state tiles:', finalTiles);
  }, [gameState]);

  const restart = useCallback(() => {
    console.log('🔄 RESTARTING GAME - Incrementing game key');
    const newTiles = initializeGameTiles();
    
    // Increment game key to force complete component remount
    setGameKey(prev => prev + 1);
    
    setGameState({
      tiles: newTiles,
      score: 0,
      bestScore: gameState.bestScore, // Keep best score
      gameOver: false,
      won: false,
    });
    
    // Clear all animation state
    setLastTileMoves([]);
    setNewTile(null);
    
    console.log('Game restarted with tiles:', newTiles);
    console.log('New game key:', gameKey + 1);
  }, [gameState.bestScore, gameKey]);

  const continueAfterWin = useCallback(() => {
    setGameState(prev => ({ ...prev, won: false }));
  }, []);

  // Convert tiles to grid for backward compatibility
  const grid = tilesToGrid(gameState.tiles);

  return {
    gameState: {
      ...gameState,
      grid // Add grid for backward compatibility
    },
    tiles: gameState.tiles,
    lastTileMoves,
    newTile,
    gameKey, // Export game key for component remounting
    move,
    restart,
    continueAfterWin,
  };
}; 