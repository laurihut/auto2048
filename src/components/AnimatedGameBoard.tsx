import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GameTile, TileMovement } from '../types/Game';
import AnimatedTile from './AnimatedTile';

interface AnimatedGameBoardProps {
  tiles: GameTile[];
  tileMoves: TileMovement[];
  newTile: GameTile | null;
}

const { width } = Dimensions.get('window');
const BOARD_SIZE = 600; // Fixed large size, no longer constrained by screen width
const GAP = 12; // Slightly larger gap for bigger board
const TILE_SIZE = (BOARD_SIZE - GAP * 5) / 4;

// Animation timing constants
const MOVEMENT_DURATION = 200; // Time for tiles to move/merge
const SPAWN_DELAY = 100; // Additional delay before spawned tile appears

// Stable tile representation for rendering
interface RenderTile {
  id: string;           // Stable unique identifier for React key
  originalId: string;   // Original tile ID (for cleanup tracking)
  value: number;        // Current value
  row: number;          // Current position
  col: number;
  fromRow?: number;     // Animation source (if moved)
  fromCol?: number;
  isSpawning: boolean;  // Just appeared
  isMerged: boolean;    // Result of a merge
  isDisappearing: boolean; // Should fade out and be removed
  spawnDelay: number;   // Delay before spawning animation starts
}

const AnimatedGameBoard: React.FC<AnimatedGameBoardProps> = ({ 
  tiles, 
  tileMoves, 
  newTile 
}) => {
  // Single source of truth for rendered tiles
  const [renderTiles, setRenderTiles] = useState<RenderTile[]>([]);
  const gameVersionRef = useRef(0);
  const previousTilesRef = useRef<GameTile[]>([]);
  const cleanupTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const renderKeyCounterRef = useRef(0);
  const renderCountRef = useRef(0);
  
  renderCountRef.current++;
  console.log(`🎮 AnimatedGameBoard render #${renderCountRef.current} - Version 3.0 - UNIQUE KEYS`);

  // Generate guaranteed unique render key using UUID-like approach
  const generateUniqueRenderKey = (baseId: string, suffix?: string): string => {
    renderKeyCounterRef.current++;
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const key = `UNIQUE_${baseId}_${suffix || 'main'}_${timestamp}_${renderKeyCounterRef.current}_${random}`;
    console.log(`Generated unique key: ${key}`);
    return key;
  };

  // Detect game state changes and update render tiles
  useEffect(() => {
    console.log('=== Game State Update ===');
    console.log('Game tiles:', tiles);
    console.log('Tile moves:', tileMoves);
    console.log('New tile:', newTile);
    console.log('Previous tiles:', previousTilesRef.current);

    // Increment version for debugging
    gameVersionRef.current++;
    const version = gameVersionRef.current;

    // Build movement lookup for efficient access
    const movementMap = new Map<string, TileMovement>();
    tileMoves.forEach(move => {
      movementMap.set(move.tileId, move);
    });

    // Determine if there are any moving tiles that need animation time
    const hasMovingTiles = tileMoves.some(move => 
      move.type === 'move' || move.type === 'merge'
    );

    // Convert game tiles to render tiles
    const newRenderTiles: RenderTile[] = [];
    const usedKeys = new Set<string>();

    // Process all current game tiles (these are the survivors/results)
    tiles.forEach(tile => {
      const movement = movementMap.get(tile.id);
      
      // Generate unique key for this tile
      const uniqueKey = generateUniqueRenderKey(tile.id, 'current');
      
      const renderTile: RenderTile = {
        id: uniqueKey,
        originalId: tile.id,
        value: tile.value,
        row: tile.position.row,
        col: tile.position.col,
        isSpawning: false,
        isMerged: false,
        isDisappearing: false,
        spawnDelay: 0
      };

      // Add movement information if tile moved
      if (movement && (movement.type === 'move' || movement.type === 'merge')) {
        renderTile.fromRow = movement.from.row;
        renderTile.fromCol = movement.from.col;
        renderTile.isMerged = movement.type === 'merge';
        
        console.log(`Tile ${tile.id}: ${movement.type} from (${movement.from.row},${movement.from.col}) to (${tile.position.row},${tile.position.col}) [key: ${uniqueKey}]`);
      } else {
        console.log(`Tile ${tile.id}: static at (${tile.position.row},${tile.position.col}) [key: ${uniqueKey}]`);
      }

      usedKeys.add(uniqueKey);
      newRenderTiles.push(renderTile);
    });

    // Process disappearing tiles (tiles that were merged away)
    tileMoves.forEach(move => {
      if (move.type === 'disappear') {
        // Find the original tile from previous state
        const originalTile = previousTilesRef.current.find(t => t.id === move.tileId);
        if (originalTile) {
          // Generate unique key for disappearing tile
          const uniqueKey = generateUniqueRenderKey(move.tileId, 'disappearing');
          
          const disappearingTile: RenderTile = {
            id: uniqueKey,
            originalId: move.tileId,
            value: originalTile.value,
            row: move.to.row,        // Final position (where it merges)
            col: move.to.col,
            fromRow: move.from.row,  // Starting position
            fromCol: move.from.col,
            isSpawning: false,
            isMerged: false,
            isDisappearing: true,
            spawnDelay: 0
          };
          
          usedKeys.add(uniqueKey);
          newRenderTiles.push(disappearingTile);
          console.log(`Disappearing tile ${move.tileId}(${originalTile.value}): from (${move.from.row},${move.from.col}) to (${move.to.row},${move.to.col}) [key: ${uniqueKey}]`);
          
          // Set up cleanup timer for this specific disappearing tile
          const existingTimer = cleanupTimersRef.current.get(move.tileId);
          if (existingTimer) {
            clearTimeout(existingTimer);
          }
          
          const cleanupTimer = setTimeout(() => {
            console.log(`🧹 Cleaning up disappeared tile: ${move.tileId}`);
            setRenderTiles(prev => {
              const filtered = prev.filter(t => t.originalId !== move.tileId || !t.isDisappearing);
              console.log(`🧹 Before cleanup: ${prev.length} tiles, After cleanup: ${filtered.length} tiles`);
              return filtered;
            });
            cleanupTimersRef.current.delete(move.tileId);
          }, MOVEMENT_DURATION + 100); // Wait for animation to complete
          
          cleanupTimersRef.current.set(move.tileId, cleanupTimer);
        }
      }
    });

    // Add spawned tile if present - with proper timing coordination
    if (newTile) {
      // Check if spawned tile conflicts with any moving tile's destination
      const conflictsWithMovingTile = tileMoves.some(move => 
        (move.type === 'move' || move.type === 'merge') &&
        move.to.row === newTile.position.row && 
        move.to.col === newTile.position.col
      );

      const finalSpawnDelay = conflictsWithMovingTile ? 
        MOVEMENT_DURATION + SPAWN_DELAY : // Wait for movement + buffer
        (hasMovingTiles ? SPAWN_DELAY : 0); // Small delay if other tiles moving

      // Generate unique key for spawned tile
      const uniqueKey = generateUniqueRenderKey(newTile.id, 'spawned');

      newRenderTiles.push({
        id: uniqueKey,
        originalId: newTile.id,
        value: newTile.value,
        row: newTile.position.row,
        col: newTile.position.col,
        isSpawning: true,
        isMerged: false,
        isDisappearing: false,
        spawnDelay: finalSpawnDelay
      });
      
      usedKeys.add(uniqueKey);
      console.log(`Spawned tile ${newTile.id}(${newTile.value}) at (${newTile.position.row},${newTile.position.col}) with ${finalSpawnDelay}ms delay${conflictsWithMovingTile ? ' (conflict detected)' : ''} [key: ${uniqueKey}]`);
    }

    // Verify all keys are unique
    const keyArray = newRenderTiles.map(t => t.id);
    const uniqueKeys = new Set(keyArray);
    if (keyArray.length !== uniqueKeys.size) {
      console.error('❌ DUPLICATE KEYS DETECTED IN NEW RENDER TILES!', keyArray);
      console.error('Duplicates:', keyArray.filter((key, index) => keyArray.indexOf(key) !== index));
      console.error('Full tile details:', newRenderTiles);
    } else {
      console.log('✅ All keys are unique in new render tiles');
    }
    
    // Also check current render tiles before setting
    console.log('📊 Current render tiles count:', renderTiles.length);
    console.log('📊 New render tiles count:', newRenderTiles.length);

    console.log(`Version ${version}: Final render tiles:`, 
      newRenderTiles.map(t => `${t.id}(${t.value})@(${t.row},${t.col})${t.isSpawning ? ` SPAWN(${t.spawnDelay}ms)` : ''}${t.isMerged ? ' MERGED' : ''}${t.isDisappearing ? ' DISAPPEARING' : ''}${t.fromRow !== undefined ? ` FROM(${t.fromRow},${t.fromCol})` : ''}`)
    );

    console.log('🔄 Setting new render tiles:', newRenderTiles.map(t => `${t.id}(${t.value})`));
    setRenderTiles(newRenderTiles);
    previousTilesRef.current = [...tiles];
  }, [tiles, tileMoves, newTile]);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      cleanupTimersRef.current.forEach(timer => clearTimeout(timer));
      cleanupTimersRef.current.clear();
    };
  }, []);

  // Memoize grid background to prevent unnecessary re-renders
  const gridBackground = useMemo(() => {
    const backgrounds = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        backgrounds.push(
          <View
            key={`grid-${row}-${col}`}
            style={[
              styles.gridCell,
              {
                width: TILE_SIZE,
                height: TILE_SIZE,
                left: GAP + col * (TILE_SIZE + GAP),
                top: GAP + row * (TILE_SIZE + GAP),
              },
            ]}
          />
        );
      }
    }
    return backgrounds;
  }, []);

  // Final check before render
  const finalKeys = renderTiles.map(t => t.id);
  const finalUniqueKeys = new Set(finalKeys);
  if (finalKeys.length !== finalUniqueKeys.size) {
    console.error('❌ DUPLICATE KEYS DETECTED AT RENDER TIME!', finalKeys);
    console.error('Render tiles:', renderTiles);
  } else {
    console.log('✅ Final render keys are unique:', finalKeys);
  }

  return (
    <View style={[styles.board, { width: BOARD_SIZE, height: BOARD_SIZE }]}>
      {/* Static grid background */}
      {gridBackground}
      
      {/* Render tiles with guaranteed unique keys */}
      {renderTiles.map((tile) => {
        console.log(`🎨 Rendering tile with key: ${tile.id}, originalId: ${tile.originalId}, value: ${tile.value}`);
        return (
          <AnimatedTile
            key={tile.id} // Guaranteed unique key
            id={tile.originalId} // Pass original ID to component
          value={tile.value}
          size={TILE_SIZE}
          currentRow={tile.row}
          currentCol={tile.col}
          fromRow={tile.fromRow}
          fromCol={tile.fromCol}
          isSpawning={tile.isSpawning}
          isMerged={tile.isMerged}
          isDisappearing={tile.isDisappearing}
          spawnDelay={tile.spawnDelay}
        />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    backgroundColor: '#BBADA0',
    borderRadius: 12,
    position: 'relative',
  },
  gridCell: {
    position: 'absolute',
    backgroundColor: '#CDC1B4',
    borderRadius: 8,
  },
});

export default AnimatedGameBoard; 