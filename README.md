# NextSkill - Education Application

A comprehensive React Native education application designed for students to learn, track progress, and engage with educational content.

## 🚀 Features

- **User Authentication**: Secure login, registration, and password recovery
- **Course Management**: Browse, search, and filter courses by category and level
- **Learning Progress**: Track completion status and time spent on lessons
- **Quiz System**: Interactive quizzes with multiple question types
- **Achievement System**: Gamification with badges and milestones
- **Offline Support**: Download content for offline learning
- **Progress Analytics**: Visual progress tracking and statistics
- **Responsive Design**: Optimized for both iOS and Android

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Common components (buttons, inputs, etc.)
│   ├── course/          # Course-specific components
│   ├── quiz/            # Quiz-related components
│   ├── auth/            # Authentication components
│   └── profile/         # Profile-related components
├── screens/             # Screen components
│   ├── auth/            # Authentication screens
│   ├── course/          # Course-related screens
│   ├── quiz/            # Quiz screens
│   ├── profile/         # Profile screens
│   ├── home/            # Home screen
│   └── settings/        # Settings screens
├── navigation/          # Navigation configuration
├── services/            # API and business logic
│   ├── api/            # API service layer
│   ├── auth/           # Authentication services
│   ├── storage/        # Local storage services
│   └── offline/        # Offline data management
├── contexts/           # React contexts for state management
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── constants/          # App constants and configuration
├── utils/              # Utility functions
├── store/              # State management (Redux/Zustand)
└── assets/             # Static assets
    ├── images/         # Image assets
    ├── icons/          # Icon assets
    └── fonts/          # Font files
```

## 🛠️ Technology Stack

- **React Native**: Cross-platform mobile development
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Navigation library
- **AsyncStorage**: Local data persistence
- **Axios**: HTTP client for API calls
- **React Context**: State management
- **React Hooks**: Functional components and state

## 📱 Key Screens

### Authentication
- **Login Screen**: User authentication with email/password
- **Register Screen**: New user registration
- **Forgot Password**: Password recovery flow

### Main Application
- **Home Screen**: Dashboard with progress overview and featured content
- **Courses Screen**: Browse and search courses with filtering
- **Progress Screen**: Learning analytics and achievements
- **Profile Screen**: User profile and settings

### Learning Experience
- **Course Detail**: Course information and enrollment
- **Lesson Detail**: Video player and lesson content
- **Quiz Detail**: Interactive quiz interface

## 🎨 Design System

### Colors
- **Primary**: #6200EE (Purple)
- **Secondary**: #03DAC6 (Teal)
- **Success**: #4CAF50 (Green)
- **Warning**: #FF9800 (Orange)
- **Error**: #F44336 (Red)

### Typography
- **H1**: 32px, Bold
- **H2**: 24px, Bold
- **H3**: 20px, Semi-bold
- **Body**: 16px, Regular
- **Caption**: 14px, Regular

## 🔧 Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **iOS Setup**
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Run the Application**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## 📦 Key Dependencies

- `@react-navigation/native`: Navigation
- `@react-navigation/stack`: Stack navigation
- `@react-navigation/bottom-tabs`: Tab navigation
- `@react-native-async-storage/async-storage`: Local storage
- `react-native-paper`: Material Design components
- `react-native-vector-icons`: Icon library
- `react-native-video`: Video player
- `react-native-chart-kit`: Progress charts

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. For iOS: `cd ios && pod install && cd ..`
4. Run the app: `npm run ios` or `npm run android`

## 📋 TODO

- [ ] Implement video player for lessons
- [ ] Add quiz functionality with timer
- [ ] Implement offline content download
- [ ] Add push notifications
- [ ] Create achievement system
- [ ] Add social features (discussions, comments)
- [ ] Implement payment integration
- [ ] Add accessibility features
- [ ] Create admin dashboard
- [ ] Add analytics and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.