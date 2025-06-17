import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AttemptsCounterProps {
  attempts: number;
}

const AttemptsCounter: React.FC<AttemptsCounterProps> = ({ attempts }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>YRITYKSET</Text>
      <Text style={styles.value}>{attempts}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#BBADA0',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    minWidth: 80,
    flex: 1,
    marginHorizontal: 4,
  },
  label: {
    color: '#EEE4DA',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AttemptsCounter; 