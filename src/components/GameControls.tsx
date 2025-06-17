import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Direction } from '../types/Game';

interface GameControlsProps {
  onMove: (direction: Direction) => void;
  disabled?: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ onMove, disabled = false }) => {
  const handleMove = (direction: Direction) => {
    console.log('Move button pressed:', direction);
    onMove(direction);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ohjaimet:</Text>
      <View style={styles.controls}>
        <View style={styles.topRow}>
          <TouchableOpacity
            style={[styles.button, disabled && styles.buttonDisabled]}
            onPress={() => handleMove('up')}
            disabled={disabled}
          >
            <Text style={styles.buttonText}>↑</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.middleRow}>
          <TouchableOpacity
            style={[styles.button, disabled && styles.buttonDisabled]}
            onPress={() => handleMove('left')}
            disabled={disabled}
          >
            <Text style={styles.buttonText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, disabled && styles.buttonDisabled]}
            onPress={() => handleMove('down')}
            disabled={disabled}
          >
            <Text style={styles.buttonText}>↓</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, disabled && styles.buttonDisabled]}
            onPress={() => handleMove('right')}
            disabled={disabled}
          >
            <Text style={styles.buttonText}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  label: {
    fontSize: 14,
    color: '#8F7A66',
    marginBottom: 8,
    fontWeight: '600',
  },
  controls: {
    alignItems: 'center',
  },
  topRow: {
    marginBottom: 8,
  },
  middleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    backgroundColor: '#8F7A66',
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#CDC1B4',
  },
  buttonText: {
    color: '#F9F6F2',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default GameControls; 