import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AttemptsCounter from './AttemptsCounter';

interface ScoreBoardProps {
  score: number;
  bestScore: number;
  attempts: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, bestScore, attempts }) => {
  return (
    <View style={styles.container}>
      <View style={styles.scoreBox}>
        <Text style={styles.scoreLabel}>PISTEET</Text>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>
      <View style={styles.scoreBox}>
        <Text style={styles.scoreLabel}>PARAS</Text>
        <Text style={styles.scoreValue}>{bestScore}</Text>
      </View>
      <AttemptsCounter attempts={attempts} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  scoreBox: {
    backgroundColor: '#BBADA0',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    minWidth: 80,
    flex: 1,
    marginHorizontal: 4,
  },
  scoreLabel: {
    color: '#EEE4DA',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scoreValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ScoreBoard; 