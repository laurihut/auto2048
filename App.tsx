import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
// Gesture handler imports - may not work on web without additional setup
let PanGestureHandler: any, State: any;
try {
  const gestureHandler = require('react-native-gesture-handler');
  PanGestureHandler = gestureHandler.PanGestureHandler;
  State = gestureHandler.State;
} catch (e) {
  // Fallback for web or when gesture handler is not available
  PanGestureHandler = ({ children, onGestureEvent }: any) => children;
  State = { END: 5 };
}
import { useGame } from './src/hooks/useGame';
import { Direction } from './src/types/Game';
import AnimatedGameBoard from './src/components/AnimatedGameBoard';
import ScoreBoard from './src/components/ScoreBoard';
import GameOverModal from './src/components/GameOverModal';
import GameControls from './src/components/GameControls';
import CarGallery from './src/components/CarGallery';

export default function App() {
  const { gameState, tiles, lastTileMoves, newTile, gameKey, attempts, highestTileValue, hasContinuedAfterWin, move, restart, continueAfterWin, resetAttempts } = useGame();

  // Add keyboard event listener for arrow keys
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState.gameOver || gameState.won) return;
      
      console.log('Key pressed:', event.key);
      
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          event.preventDefault();
          move('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          event.preventDefault();
          move('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          event.preventDefault();
          move('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          event.preventDefault();
          move('right');
          break;
        default:
          break;
      }
    };

    // Add event listener (only works on web)
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyPress);
      
      // Cleanup
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [move, gameState.gameOver, gameState.won]);

  const handleGesture = (event: any) => {
    console.log('=== GESTURE EVENT ===');
    console.log('Event type:', event.nativeEvent);
    console.log('Game state - over:', gameState.gameOver, 'won:', gameState.won);
    
    // Prevent gestures during game over
    if (gameState.gameOver || gameState.won) {
      console.log('Game over/won, ignoring gesture');
      return;
    }

    // Get the state - this should work for both onGestureEvent and onHandlerStateChange
    const state = event.nativeEvent.state;
    console.log('Gesture state:', state, 'Expected END state:', State.END);
    
    // Only process when gesture ends
    if (state === State.END) {
      const { translationX, translationY, velocityX = 0, velocityY = 0 } = event.nativeEvent;
      
      console.log('Gesture data:', { 
        translationX, 
        translationY, 
        velocityX, 
        velocityY,
        absTranslationX: Math.abs(translationX),
        absTranslationY: Math.abs(translationY)
      });

      // More lenient thresholds for better responsiveness
      const minSwipeDistance = 20; // Even lower threshold
      const minVelocity = 100; // Lower velocity threshold

      // Check if gesture meets minimum requirements
      const maxTranslation = Math.max(Math.abs(translationX), Math.abs(translationY));
      const maxVelocity = Math.max(Math.abs(velocityX), Math.abs(velocityY));
      
      console.log('Thresholds:', { 
        maxTranslation, 
        minSwipeDistance, 
        maxVelocity, 
        minVelocity,
        hasMinDistance: maxTranslation > minSwipeDistance,
        hasMinVelocity: maxVelocity > minVelocity
      });
      
      if (maxTranslation <= minSwipeDistance && maxVelocity <= minVelocity) {
        console.log('❌ Gesture too small/slow, ignoring');
        return;
      }

      // Determine swipe direction based on the larger movement
      let direction: Direction;
      if (Math.abs(translationX) > Math.abs(translationY)) {
        // Horizontal swipe
        direction = translationX > 0 ? 'right' : 'left';
        console.log(`✅ Horizontal swipe detected: ${direction} (translation: ${translationX})`);
      } else {
        // Vertical swipe
        direction = translationY > 0 ? 'down' : 'up';
        console.log(`✅ Vertical swipe detected: ${direction} (translation: ${translationY})`);
      }
      
      console.log('🎮 Calling move with direction:', direction);
      move(direction);
    } else {
      console.log('Gesture state not END, ignoring:', state);
    }
  };

  // Dynamic instruction text based on platform
  const getInstructionText = () => {
    if (Platform.OS === 'web') {
      return 'Käytä nuolinäppäimiä, WASD-näppäimiä tai pyyhkäisy-eleitä liikuttaaksesi laattoja. Kun kaksi samanlaista laattaa koskettaa toisiaan, ne yhdistyvät yhdeksi!';
    } else {
      return 'Pyyhkäise mihin tahansa suuntaan liikuttaaksesi laattoja! Kun kaksi samanlaista kuvaa koskettaa toisiaan, ne yhdistyvät yhdeksi. Käytä nuolipainikkeita jos haluat napauttaa.';
    }
  };

  const getHintText = () => {
    if (Platform.OS === 'web') {
      return '💡 Käytä nuolinäppäimiä, WASD-näppäimiä tai pyyhkäisyä pelataksesi!';
    } else {
      return '📱 Pyyhkäise mihin tahansa suuntaan liikuttaaksesi laattoja!';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8EF" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={false}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={false}
      >
        <View 
          style={styles.keyboardHint}
          // Make the container focusable for keyboard events on web
          // @ts-ignore - These props are web-specific
          tabIndex={Platform.OS === 'web' ? 0 : undefined}
        >
          <Text style={styles.keyboardHintText}>
            {getHintText()}
          </Text>
        </View>
        
        <View style={styles.header}>
          <Text style={styles.title}>Auto2048</Text>
          <Text style={styles.subtitle}>
            Yhdistä autoja pyyhkäisemällä ja saavuta lopullinen ajopeli!
          </Text>
        </View>

        <ScoreBoard score={gameState.score} bestScore={gameState.bestScore} attempts={attempts} />

        <View style={styles.gameContainer}>
          <View style={styles.gameAreaContainer}>
            <CarGallery />
            <PanGestureHandler 
              onHandlerStateChange={handleGesture}
              activeOffsetX={[-20, 20]}
              activeOffsetY={[-20, 20]}
              failOffsetX={[-5, 5]}
              failOffsetY={[-5, 5]}
              enableTrackpadTwoFingerGesture={false}
            >
              <View style={[styles.gestureContainer, styles.touchArea]}>
                <AnimatedGameBoard 
                  key={gameKey}
                  tiles={tiles}
                  tileMoves={lastTileMoves}
                  newTile={newTile}
                />
              </View>
            </PanGestureHandler>
          </View>
        </View>

        <GameControls 
          onMove={move} 
          disabled={gameState.gameOver || gameState.won} 
        />

        <View style={styles.controls}>
          <TouchableOpacity style={styles.newGameButton} onPress={restart}>
            <Text style={styles.newGameButtonText}>Uusi Peli</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionsText}>
            {getInstructionText()}
          </Text>
        </View>
      </ScrollView>

      <GameOverModal
        visible={gameState.gameOver || gameState.won}
        gameWon={gameState.won}
        score={gameState.score}
        highestTileValue={highestTileValue}
        hasContinuedAfterWin={hasContinuedAfterWin}
        onRestart={restart}
        onContinue={gameState.won ? continueAfterWin : undefined}
        onResetAttempts={gameState.won && !hasContinuedAfterWin ? resetAttempts : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8EF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#776E65',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#8F7A66',
    textAlign: 'center',
  },
  gameContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  gameAreaContainer: {
    position: 'relative',
    alignItems: 'center',
    paddingHorizontal: Platform.OS === 'web' && Dimensions.get('window').width > 1200 ? 370 : 
                      Platform.OS === 'web' && Dimensions.get('window').width > 800 ? 300 : 130,
    minHeight: Platform.OS === 'web' && Dimensions.get('window').width > 1200 ? 1000 : 
               Platform.OS === 'web' && Dimensions.get('window').width > 800 ? 800 : 400,
  },
  gestureContainer: {
    // This wrapper is needed for PanGestureHandler
  },
  touchArea: {
    // Responsive touch area based on screen size
    minWidth: Math.min(Math.max(Dimensions.get('window').width * 0.9, 350), 600) + 50,
    minHeight: Math.min(Math.max(Dimensions.get('window').width * 0.9, 350), 600) + 50,
  },
  controls: {
    alignItems: 'center',
    marginBottom: 20,
  },
  newGameButton: {
    backgroundColor: '#8F7A66',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  newGameButtonText: {
    color: '#F9F6F2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructions: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  instructionsText: {
    color: '#8F7A66',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  keyboardHint: {
    backgroundColor: '#EDCF72',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  keyboardHintText: {
    color: '#776E65',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 