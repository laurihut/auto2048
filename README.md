# React Native Web Template

A simple, modern React Native template that works across iOS, Android, and Web platforms using Expo.

## Features

- ✅ **Cross-platform**: Runs on iOS, Android, and Web
- ✅ **TypeScript**: Full TypeScript support for better development experience
- ✅ **Modern UI**: Clean, responsive design with modern styling
- ✅ **Expo Managed**: Easy development and deployment with Expo
- ✅ **Web Optimized**: Configured for optimal web performance
- ✅ **Ready to Deploy**: Pre-configured for web deployment

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm or yarn
- Expo CLI (install globally: `npm install -g expo-cli`)

### Installation

1. Clone or download this template
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

#### For Web Development:
```bash
npm run web
```
This will start the development server and open your app in the browser.

#### For Mobile Development:
```bash
npm start
```
This will start the Expo development server. You can then:
- Press `w` to open in web browser
- Press `i` to open iOS simulator (macOS only)
- Press `a` to open Android emulator
- Scan the QR code with Expo Go app on your phone

### Building for Production

#### Web Build:
```bash
npm run build
```
This creates a production build in the `web-build` folder.

## Project Structure

```
├── App.tsx              # Main app component
├── index.js             # Entry point
├── package.json         # Dependencies and scripts
├── app.json            # Expo configuration
├── babel.config.js     # Babel configuration
├── tsconfig.json       # TypeScript configuration
├── webpack.config.js   # Webpack configuration for web
├── assets/             # Images and other assets
└── README.md           # This file
```

## Customization

### Styling
The app uses React Native's StyleSheet for styling. All styles are defined in `App.tsx`. The design is responsive and works well on both mobile and web.

### Colors
The app uses a modern color palette:
- Primary: `#3498db` (blue)
- Background: `#f8f9fa` (light gray)
- Text: `#2c3e50` (dark gray)
- Secondary: `#7f8c8d` (medium gray)

### Adding New Screens
To add new screens:
1. Create new component files
2. Import and use them in `App.tsx`
3. Consider adding navigation (React Navigation) for multi-screen apps

## Deployment

### Web Deployment
After building with `npm run build`, you can deploy the `web-build` folder to any static hosting service like:
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting

### Mobile Deployment
Use Expo's build service:
```bash
expo build:android  # For Android
expo build:ios      # For iOS
```

## Technologies Used

- **React Native**: Cross-platform mobile development
- **React Native Web**: Web support for React Native
- **Expo**: Development and deployment platform
- **TypeScript**: Type-safe JavaScript
- **Webpack**: Web bundling and optimization

## Contributing

Feel free to customize this template for your needs. Some suggestions:
- Add navigation with React Navigation
- Implement state management (Redux, Zustand, etc.)
- Add more UI components
- Integrate with backend APIs
- Add testing setup

## License

This template is free to use and modify for your projects.

---

Happy coding! 🚀 