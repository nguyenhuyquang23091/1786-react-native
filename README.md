# 1786 React Native App

A React Native mobile application built with Expo, featuring Google authentication and Firebase integration.

## Features

- 🔐 Google OAuth Authentication
- 🔥 Firebase Integration
- 📱 Cross-platform (iOS, Android, Web)
- 🎨 Dark/Light Theme Support
- 🧭 Tab Navigation with Expo Router

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Routing**: Expo Router (file-based routing)
- **Authentication**: Google OAuth + Firebase Auth
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: Zustand
- **Backend**: Firebase

## Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd 1786-react-native
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Add your Firebase and Google OAuth configurations
   ```

4. Configure Firebase:
   - Add `google-services.json` for Android
   - Add `GoogleService-Info.plist` for iOS

## Development Commands

### Start Development Server
```bash
npm start          # Start Expo development server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run web version
```

### Code Quality
```bash
npm run lint       # Run ESLint
```

### Project Management
```bash
npm run reset-project  # Reset to blank state
```

## Project Structure

```
app/
├── (tabs)/           # Tab navigation screens
│   ├── cart.tsx
│   ├── myBookings.tsx
│   └── yogaCourse.tsx
├── _layout.tsx       # Root layout
├── index.tsx         # Home screen
├── googleLogin.tsx   # Google authentication
└── yogaClasses.tsx   # Yoga classes screen

components/
├── ui/               # Core UI components (buttons, inputs, etc.)
└── DestinationCard.tsx

service/
└── firebaseConfig.ts # Firebase configuration

assets/
└── images/           # Static images and assets
```

## Authentication Flow

1. User taps "Sign in with Google"
2. Google OAuth flow opens in browser
3. User authenticates with Google
4. Access token is exchanged for Firebase auth
5. User is signed in to the app

## Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add redirect URIs:
   - `https://auth.expo.io/@nguyenhuyquang230904/1786-react-native`
   - `exp://127.0.0.1:19000` (for development)

### Firebase Setup

1. Create a Firebase project
2. Enable Authentication with Google provider
3. Download configuration files:
   - `google-services.json` for Android
   - `GoogleService-Info.plist` for iOS

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/new-feature`
3. Commit changes: `git commit -m 'feat: add new feature'`
4. Push to branch: `git push origin feat/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License.
