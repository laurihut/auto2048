import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getTileColor, getTileTextColor } from '../utils/gameLogic';

interface TileProps {
  value: number | null;
  size: number;
}

const Tile: React.FC<TileProps> = ({ value, size }) => {
  const tileStyle = {
    width: size,
    height: size,
    backgroundColor: getTileColor(value),
  };

  const textStyle = {
    color: getTileTextColor(value),
    fontSize: value && value >= 1000 ? size * 0.25 : size * 0.35,
  };

  return (
    <View style={[styles.tile, tileStyle]}>
      {value && (
        <Text style={[styles.tileText, textStyle]} numberOfLines={1}>
          {value}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tile: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  tileText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Tile; 