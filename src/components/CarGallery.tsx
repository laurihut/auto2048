import React from 'react';
import { View, Image, StyleSheet, Platform, Dimensions } from 'react-native';

const CarGallery: React.FC = () => {
  // Define all available car images
  const carImages = [
    require('../../assets/1.png'),
    require('../../assets/2.png'),
    require('../../assets/3.png'),
    require('../../assets/4.png'),
    require('../../assets/5.png'),
    require('../../assets/6.png'),
    require('../../assets/7.png'),
    require('../../assets/8.png'),
    require('../../assets/9.png'),
    require('../../assets/10.png'),
    require('../../assets/11.png'),
  ];

  // Get screen dimensions and platform
  const screenWidth = Dimensions.get('window').width;
  const isWeb = Platform.OS === 'web';
  
  // Calculate responsive sizes
  const getResponsiveSizes = () => {
    if (isWeb && screenWidth > 1200) {
      // Large web screens - make cars massive
      return {
        sideWidth: 350,
        carWidth: 330,
        carHeight: 950,
        padding: 10,
      };
    } else if (isWeb && screenWidth > 800) {
      // Medium web screens - make cars bigger
      return {
        sideWidth: 280,
        carWidth: 260,
        carHeight: 750,
        padding: 10,
      };
    } else {
      // Mobile and small screens
      return {
        sideWidth: 120,
        carWidth: 100,
        carHeight: 300,
        padding: 10,
      };
    }
  };

  const sizes = getResponsiveSizes();

  return (
    <View style={styles.container}>
      {/* Left side - one large car */}
      <View style={[styles.leftSide, { width: sizes.sideWidth, paddingRight: sizes.padding }]}>
        <Image 
          source={carImages[9]} 
          style={[styles.carImage, { width: sizes.carWidth, height: sizes.carHeight }]} 
          resizeMode="contain" 
        />
      </View>

      {/* Right side - one large car */}
      <View style={[styles.rightSide, { width: sizes.sideWidth, paddingLeft: sizes.padding }]}>
        <Image 
          source={carImages[10]} 
          style={[styles.carImage, { width: sizes.carWidth, height: sizes.carHeight }]} 
          resizeMode="contain" 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    pointerEvents: 'none', // Allow touches to pass through
    zIndex: 1, // In front of the game board
  },
  leftSide: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  rightSide: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  carImage: {
    opacity: 1, // No transparency - full visibility
  },
});

export default CarGallery; 