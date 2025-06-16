import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { getTileColor, getTileTextColor } from '../utils/gameLogic';
import { getImageSource } from '../utils/imageMapping';

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

  const imageSource = value ? getImageSource(value) : null;

  return (
    <View style={[styles.tile, tileStyle]}>
      {value && imageSource && (
        <Image 
          source={imageSource}
          style={[styles.tileImage, { width: size * 0.8, height: size * 0.8 }]}
          resizeMode="contain"
        />
      )}
      {value && !imageSource && (
        <Text style={[styles.tileText, { 
          color: getTileTextColor(value),
          fontSize: value >= 1000 ? size * 0.25 : size * 0.35
        }]} numberOfLines={1}>
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
  tileImage: {
    borderRadius: 4,
  },
  tileText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Tile; 