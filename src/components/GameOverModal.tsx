import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';

interface GameOverModalProps {
  visible: boolean;
  gameWon: boolean;
  score: number;
  onRestart: () => void;
  onContinue?: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  visible,
  gameWon,
  score,
  onRestart,
  onContinue,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onRestart}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>
              {gameWon ? '🎉 You Won!' : '😢 Game Over'}
            </Text>
            
            {/* Show Lamborghini image when player wins */}
            {gameWon && (
              <View style={styles.winImageContainer}>
                <Image 
                  source={require('../../assets/11.png')} 
                  style={styles.winImage}
                  resizeMode="contain"
                />
                <Text style={styles.winImageCaption}>
                  🏆 Ultimate Ride Achieved! 🏆
                </Text>
              </View>
            )}
            
            <Text style={styles.message}>
              {gameWon 
                ? 'Congratulations! You reached 2048 and earned the ultimate car!' 
                : 'No more moves available!'}
            </Text>
            
            <Text style={styles.score}>
              Final Score: {score}
            </Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.button} 
                onPress={onRestart}
              >
                <Text style={styles.buttonText}>New Game</Text>
              </TouchableOpacity>
              
              {gameWon && onContinue && (
                <TouchableOpacity 
                  style={[styles.button, styles.continueButton]} 
                  onPress={onContinue}
                >
                  <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FAF8EF',
    borderRadius: 12,
    padding: 30,
    margin: 20,
    maxWidth: 350,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#776E65',
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: '#8F7A66',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 24,
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#776E65',
    marginBottom: 25,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  button: {
    backgroundColor: '#8F7A66',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#EDCF72',
  },
  buttonText: {
    color: '#F9F6F2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  winImageContainer: {
    marginBottom: 15,
  },
  winImage: {
    width: 200,
    height: 200,
  },
  winImageCaption: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#776E65',
    textAlign: 'center',
  },
});

export default GameOverModal; 