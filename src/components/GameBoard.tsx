import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GridType } from '../types/Game';
import Tile from './Tile';

interface GameBoardProps {
  grid: GridType;
}

const { width } = Dimensions.get('window');
const BOARD_SIZE = 600; // Fixed large size, no longer constrained by screen width  
const GAP = 12; // Slightly larger gap for bigger board
const TILE_SIZE = (BOARD_SIZE - GAP * 5) / 4; // Board padding + 3 gaps between 4 tiles

const GameBoard: React.FC<GameBoardProps> = ({ grid }) => {
  return (
    <View style={[styles.board, { width: BOARD_SIZE, height: BOARD_SIZE }]}>
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={[styles.row, rowIndex === 3 && styles.lastRow]}>
          {row.map((value, colIndex) => (
            <View 
              key={`${rowIndex}-${colIndex}`} 
              style={[styles.tileContainer, colIndex === 3 && styles.lastTile]}
            >
              <Tile
                value={value}
                size={TILE_SIZE}
              />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    backgroundColor: '#BBADA0',
    borderRadius: 12,
    padding: GAP,
  },
  row: {
    flexDirection: 'row',
    marginBottom: GAP,
  },
  lastRow: {
    marginBottom: 0,
  },
  tileContainer: {
    marginRight: GAP,
  },
  lastTile: {
    marginRight: 0,
  },
});

export default GameBoard; 