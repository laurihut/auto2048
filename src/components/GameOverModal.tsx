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
import { getCarNameFromValue, getImageSource } from '../utils/imageMapping';

interface GameOverModalProps {
  visible: boolean;
  gameWon: boolean;
  score: number;
  highestTileValue: number;
  hasContinuedAfterWin: boolean;
  onRestart: () => void;
  onContinue?: () => void;
  onResetAttempts?: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  visible,
  gameWon,
  score,
  highestTileValue,
  hasContinuedAfterWin,
  onRestart,
  onContinue,
  onResetAttempts,
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
              {gameWon ? '🎉 Voitit!' : '😅 Hupsis, mitä sattui käymään?'}
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
                  🏆 Lopullinen Auto Saavutettu! 🏆
                </Text>
                <Text style={styles.winCarName}>
                  {getCarNameFromValue(2048)}
                </Text>
              </View>
            )}
            
            <Text style={styles.message}>
              {gameWon 
                ? 'Onnittelut! Saavutit 2048 ja ansaitsit lopullisen auton!' 
                : 'Ei enää siirtoja käytettävissä!'}
            </Text>
            
            <Text style={styles.score}>
              Lopullinen Tulos: {score}
            </Text>
            
            {!gameWon && (
              <View style={styles.bestCarContainer}>
                <Text style={styles.bestCarLabel}>Paras auto tällä yrityksellä:</Text>
                <View style={styles.bestCarInfo}>
                  {getImageSource(highestTileValue) && (
                    <Image 
                      source={getImageSource(highestTileValue)!} 
                      style={styles.bestCarImage}
                      resizeMode="contain"
                    />
                  )}
                  <Text style={styles.bestCarName}>
                    {getCarNameFromValue(highestTileValue)}
                  </Text>
                </View>
              </View>
            )}
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.button} 
                onPress={onRestart}
              >
                <Text style={styles.buttonText}>Uusi Peli</Text>
              </TouchableOpacity>
              
              {gameWon && onContinue && (
                <TouchableOpacity 
                  style={[styles.button, styles.continueButton]} 
                  onPress={onContinue}
                >
                  <Text style={styles.buttonText}>Jatka</Text>
                </TouchableOpacity>
              )}
              
              {gameWon && !hasContinuedAfterWin && onResetAttempts && (
                <TouchableOpacity 
                  style={[styles.button, styles.resetAttemptsButton]} 
                  onPress={onResetAttempts}
                >
                  <Text style={styles.buttonText}>Nollaa yritykset</Text>
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
    gap: 10,
    flexWrap: 'wrap',
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
  resetAttemptsButton: {
    backgroundColor: '#ED7272',
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
  winCarName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#776E65',
    textAlign: 'center',
    marginTop: 8,
  },
  bestCarContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  bestCarLabel: {
    fontSize: 16,
    color: '#8F7A66',
    marginBottom: 8,
    fontWeight: '600',
  },
  bestCarInfo: {
    alignItems: 'center',
  },
  bestCarImage: {
    width: 60,
    height: 60,
    marginBottom: 5,
  },
  bestCarName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#776E65',
  },
});

export default GameOverModal; 