import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Platform,
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

export default function App() {
  const { gameState, tiles, lastTileMoves, newTile, gameKey, move, restart, continueAfterWin } = useGame();

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
    // Prevent gestures during game over
    if (gameState.gameOver || gameState.won) return;

    if (event.nativeEvent.state === State.END) {
      const { translationX, translationY, velocityX, velocityY } = event.nativeEvent;
      
      // Adjusted minimum distances for better mobile responsiveness
      const minSwipeDistance = 30; // Reduced from 50 for easier mobile gestures
      const minVelocity = 100; // Add velocity check for more responsive gestures

      console.log('Gesture:', { translationX, translationY, velocityX, velocityY });

      // Check if gesture meets minimum requirements (distance OR velocity)
      const hasMinDistance = Math.max(Math.abs(translationX), Math.abs(translationY)) > minSwipeDistance;
      const hasMinVelocity = Math.max(Math.abs(velocityX), Math.abs(velocityY)) > minVelocity;
      
      if (!hasMinDistance && !hasMinVelocity) {
        console.log('Gesture too small/slow, ignoring');
        return;
      }

      // Determine swipe direction based on the larger movement
      if (Math.abs(translationX) > Math.abs(translationY)) {
        // Horizontal swipe
        const direction: Direction = translationX > 0 ? 'right' : 'left';
        console.log(`Horizontal swipe: ${direction}`);
        move(direction);
      } else {
        // Vertical swipe
        const direction: Direction = translationY > 0 ? 'down' : 'up';
        console.log(`Vertical swipe: ${direction}`);
        move(direction);
      }
    }
  };

  // Dynamic instruction text based on platform
  const getInstructionText = () => {
    if (Platform.OS === 'web') {
      return 'Use arrow keys, WASD keys, or swipe gestures to move tiles. When two tiles with the same number touch, they merge into one!';
    } else {
      return 'Swipe in any direction to move tiles! When two tiles with the same image touch, they merge into one. Use the arrow buttons if you prefer tapping.';
    }
  };

  const getHintText = () => {
    if (Platform.OS === 'web') {
      return '💡 Use arrow keys, WASD keys, or swipe to play!';
    } else {
      return '📱 Swipe in any direction to move the tiles!';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8EF" />
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
          Swipe to combine cars and reach the ultimate ride!
        </Text>
      </View>

      <ScoreBoard score={gameState.score} bestScore={gameState.bestScore} />

      <View style={styles.gameContainer}>
        <PanGestureHandler 
          onGestureEvent={handleGesture}
          activeOffsetX={[-10, 10]}
          activeOffsetY={[-10, 10]}
          failOffsetX={[-5, 5]}
          failOffsetY={[-5, 5]}
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

      <GameControls 
        onMove={move} 
        disabled={gameState.gameOver || gameState.won} 
      />

      <View style={styles.controls}>
        <TouchableOpacity style={styles.newGameButton} onPress={restart}>
          <Text style={styles.newGameButtonText}>New Game</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          {getInstructionText()}
        </Text>
      </View>

      <GameOverModal
        visible={gameState.gameOver || gameState.won}
        gameWon={gameState.won}
        score={gameState.score}
        onRestart={restart}
        onContinue={gameState.won ? continueAfterWin : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8EF',
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
  gestureContainer: {
    // This wrapper is needed for PanGestureHandler
  },
  touchArea: {
    // Ensure adequate touch area for gestures
    minWidth: 300,
    minHeight: 300,
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