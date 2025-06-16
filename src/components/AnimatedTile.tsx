import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { getTileColor, getTileTextColor } from '../utils/gameLogic';

interface AnimatedTileProps {
  id: string;
  value: number;
  size: number;
  currentRow: number;
  currentCol: number;
  fromRow?: number;
  fromCol?: number;
  isSpawning: boolean;
  isMerged: boolean;
  isDisappearing: boolean;
  spawnDelay: number;
}

const AnimatedTile: React.FC<AnimatedTileProps> = ({ 
  id,
  value, 
  size, 
  currentRow,
  currentCol,
  fromRow,
  fromCol,
  isSpawning,
  isMerged,
  isDisappearing,
  spawnDelay
}) => {
  const animatedPosition = useRef(new Animated.ValueXY()).current;
  const scaleAnimation = useRef(new Animated.Value(isSpawning ? 0 : 1)).current;
  const opacityAnimation = useRef(new Animated.Value(1)).current;

  const GAP = 8;
  const targetX = GAP + currentCol * (size + GAP);
  const targetY = GAP + currentRow * (size + GAP);
  
  // Debug positioning
  console.log(`Tile ${id} positioning: size=${size}, GAP=${GAP}, pos=(${currentRow},${currentCol}), target=(${targetX},${targetY})`);

  // Handle position and movement animation
  useEffect(() => {
    const hasMovement = fromRow !== undefined && fromCol !== undefined;
    const startX = hasMovement ? fromCol * (size + GAP) : targetX;
    const startY = hasMovement ? fromRow * (size + GAP) : targetY;

    // Set initial position
    animatedPosition.setValue({ x: startX, y: startY });

    // Animate movement if tile moved
    if (hasMovement) {
      console.log(`Tile ${id}(${value}): Moving from (${fromRow},${fromCol}) to (${currentRow},${currentCol})${isDisappearing ? ' (disappearing)' : ''}`);
      
      // If disappearing, start fading immediately while moving
      if (isDisappearing) {
        Animated.timing(opacityAnimation, {
          toValue: 0,
          duration: 200, // Fade out during movement
          useNativeDriver: false,
        }).start();
      }
      
      Animated.spring(animatedPosition, {
        toValue: { x: targetX, y: targetY },
        useNativeDriver: false,
        tension: isMerged ? 200 : 150, // Faster animation for merged tiles
        friction: 8,
      }).start(() => {
        console.log(`Tile ${id}: Movement animation completed`);
      });
    } else {
      console.log(`Tile ${id}(${value}): Static at (${currentRow},${currentCol})`);
    }
  }, [id, value, currentRow, currentCol, fromRow, fromCol, isMerged, isDisappearing, size, targetX, targetY]);

  // Handle spawning animation with coordinated timing
  useEffect(() => {
    if (isSpawning) {
      console.log(`Tile ${id}(${value}): Spawning at (${currentRow},${currentCol}) with ${spawnDelay}ms delay`);
      
      // Start from scale 0
      scaleAnimation.setValue(0);
      
      // Animation configuration based on tile type
      const animationConfig = isMerged 
        ? { tension: 300, friction: 8 }      // Merged: snappy
        : { tension: 200, friction: 6 };     // Spawned: smooth

      const animate = () => {
        Animated.spring(scaleAnimation, {
          toValue: 1,
          useNativeDriver: false,
          tension: animationConfig.tension,
          friction: animationConfig.friction,
        }).start(() => {
          console.log(`Tile ${id}: Spawn animation completed`);
        });
      };

      // Use the coordinated delay
      if (spawnDelay > 0) {
        console.log(`Tile ${id}: Waiting ${spawnDelay}ms before spawning`);
        setTimeout(animate, spawnDelay);
      } else {
        animate();
      }
    }
  }, [id, value, isSpawning, isMerged, spawnDelay, currentRow, currentCol]);

  const tileStyle = {
    width: size,
    height: size,
    backgroundColor: getTileColor(value),
  };

  const textStyle = {
    color: getTileTextColor(value),
    fontSize: value >= 1000 ? size * 0.25 : size * 0.35,
  };

  return (
    <Animated.View
      style={[
        styles.tile,
        tileStyle,
        {
          left: animatedPosition.x,
          top: animatedPosition.y,
          transform: [
            { scale: scaleAnimation },
          ],
          opacity: opacityAnimation,
        },
      ]}
    >
      <Animated.Text style={[styles.tileText, textStyle]} numberOfLines={1}>
        {value}
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tile: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  tileText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AnimatedTile; 