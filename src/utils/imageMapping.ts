// Mapping from 2048 game values to image numbers
// 2 -> 1.png, 4 -> 2.png, 8 -> 3.png, etc.

export const getImageNumberFromValue = (value: number): string | null => {
  const valueToImageMap: { [key: number]: string } = {
    2: '1',
    4: '2', 
    8: '3',
    16: '4',
    32: '5',
    64: '6',
    128: '7',
    256: '8',
    512: '9',
    1024: '10',
    2048: '11',
  };

  return valueToImageMap[value] || null;
};

export const getImageSource = (value: number) => {
  const imageNumber = getImageNumberFromValue(value);
  if (!imageNumber) return null;

  // Dynamic require based on image number
  switch (imageNumber) {
    case '1': return require('../../assets/1.png');
    case '2': return require('../../assets/2.png');
    case '3': return require('../../assets/3.png');
    case '4': return require('../../assets/4.png');
    case '5': return require('../../assets/5.png');
    case '6': return require('../../assets/6.png');
    case '7': return require('../../assets/7.png');
    case '8': return require('../../assets/8.png');
    case '9': return require('../../assets/9.png');
    case '10': return require('../../assets/10.png');
    case '11': return require('../../assets/11.png');
    default: return null;
  }
}; 