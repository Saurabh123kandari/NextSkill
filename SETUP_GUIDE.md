# NextSkill Education App - Complete Setup Guide

## 🚀 Tech Stack Overview

This React Native education application is built with:

- **React Native 0.81.4** - Cross-platform mobile development
- **TypeScript** - Type-safe JavaScript
- **Yarn** - Fast, reliable package manager
- **SQLite** - Local database storage
- **React Navigation 6** - Navigation library
- **Redux Toolkit + RTK Query** - State management and API calls
- **ESLint + Prettier** - Code quality and formatting

## 📋 Prerequisites

Before setting up the project, ensure you have:

1. **Node.js** (v18 or higher)
2. **Yarn** (v1.22 or higher)
3. **React Native CLI**
4. **Android Studio** (for Android development)
5. **Xcode** (for iOS development, macOS only)
6. **JDK 11** or higher

## 🛠️ Installation Steps

### 1. Clone and Install Dependencies

```bash
# Install dependencies with Yarn
yarn install

# For iOS (macOS only)
cd ios && pod install && cd ..
```

### 2. Environment Setup

The project is already configured with:
- TypeScript with path aliases (`@/` imports)
- Babel module resolver for path mapping
- ESLint and Prettier configuration
- SQLite database setup
- Redux store configuration

### 3. Database Initialization

The SQLite database is automatically initialized when the app starts. It includes:

- **Users table** - User authentication and profiles
- **Courses table** - Course information and enrollment
- **Lessons table** - Course lessons and content
- **Quizzes table** - Quiz data and questions
- **Progress table** - User learning progress
- **Achievements table** - User achievements and badges

### 4. State Management

The app uses Redux Toolkit with the following structure:

```typescript
// Store slices
- authSlice: User authentication state
- courseSlice: Course and lesson data
- uiSlice: UI state (theme, modals, loading)

// RTK Query APIs
- authApi: Authentication endpoints
- courseApi: Course and lesson endpoints  
- quizApi: Quiz and assessment endpoints
```

### 5. Navigation Structure

```typescript
// Navigation hierarchy
AppNavigator
├── AuthNavigator (Login/Signup)
└── MainStack
    ├── DrawerNavigator
    │   ├── MainTabNavigator
    │   │   ├── Home
    │   │   ├── Courses
    │   │   ├── Progress
    │   │   └── Profile
    │   └── Settings
    ├── CourseDetail
    ├── LessonDetail
    └── QuizDetail
```

## 🏃‍♂️ Running the Application

### Android Development

```bash
# Start Metro bundler
yarn start

# Run on Android (in another terminal)
yarn android
```

### iOS Development (macOS only)

```bash
# Start Metro bundler
yarn start

# Run on iOS (in another terminal)
yarn ios
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components
│   └── navigation/     # Navigation components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── navigation/         # Navigation configuration
├── screens/            # Screen components
│   ├── auth/          # Authentication screens
│   ├── course/        # Course-related screens
│   ├── home/          # Home screen
│   ├── profile/       # Profile screens
│   └── settings/      # Settings screens
├── services/           # API and database services
│   ├── api/           # API service layer
│   └── database/      # SQLite database layer
├── store/              # Redux store
│   ├── api/           # RTK Query APIs
│   └── slices/        # Redux slices
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── constants/          # App constants
```

## 🔧 Development Scripts

```bash
# Development
yarn start              # Start Metro bundler
yarn android           # Run on Android
yarn ios               # Run on iOS

# Code Quality
yarn lint              # Run ESLint
yarn lint:fix          # Fix ESLint issues
yarn format            # Format code with Prettier
yarn type-check        # Check TypeScript types

# Testing
yarn test              # Run tests
yarn test:watch        # Run tests in watch mode

# Cleanup
yarn clean             # Clean React Native cache
yarn clean:android     # Clean Android build
yarn clean:ios         # Clean iOS build
```

## 🗄️ Database Schema

### Users Table
- `id` (Primary Key)
- `email` (Unique)
- `name`
- `password_hash`
- `avatar_url`
- `role` (student/teacher/admin)
- `created_at`, `updated_at`

### Courses Table
- `id` (Primary Key)
- `title`
- `description`
- `instructor`
- `thumbnail_url`
- `duration`
- `level` (beginner/intermediate/advanced)
- `category`
- `rating`
- `students_count`
- `is_enrolled`
- `progress`
- `created_at`, `updated_at`

### Lessons Table
- `id` (Primary Key)
- `course_id` (Foreign Key)
- `title`
- `description`
- `type` (video/text/quiz/assignment)
- `content_url`
- `duration`
- `order_index`
- `is_completed`
- `is_locked`
- `created_at`

### Quizzes Table
- `id` (Primary Key)
- `course_id` (Foreign Key)
- `lesson_id` (Foreign Key)
- `title`
- `description`
- `time_limit`
- `passing_score`
- `max_attempts`
- `created_at`

### Progress Table
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `course_id` (Foreign Key)
- `lesson_id` (Foreign Key)
- `quiz_id` (Foreign Key)
- `type` (course/lesson/quiz/assignment)
- `status` (not-started/in-progress/completed/failed)
- `progress_percentage`
- `time_spent`
- `last_accessed`
- `completed_at`

### Achievements Table
- `id` (Primary Key)
- `title`
- `description`
- `icon`
- `type` (course/quiz/streak/milestone)
- `criteria`
- `points`
- `is_unlocked`
- `unlocked_at`
- `created_at`

## 🔐 Authentication Flow

1. **Login/Signup** - User authentication with email/password
2. **Token Storage** - JWT tokens stored securely using Keychain
3. **Auto-login** - Automatic login on app restart
4. **Logout** - Clear tokens and reset state

## 📱 Key Features

- **User Authentication** - Secure login/signup with validation
- **Course Management** - Browse, enroll, and track courses
- **Progress Tracking** - Monitor learning progress and achievements
- **Quiz System** - Interactive quizzes with scoring
- **Offline Support** - SQLite for offline data storage
- **Modern UI** - Clean, responsive design with Material Design
- **Type Safety** - Full TypeScript support throughout

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler port conflict**
   ```bash
   # Kill existing Metro processes
   pkill -f "react-native start"
   yarn start
   ```

2. **Android build failures**
   ```bash
   # Clean and rebuild
   yarn clean:android
   yarn android
   ```

3. **iOS CocoaPods issues**
   ```bash
   cd ios
   pod deintegrate
   pod install
   cd ..
   ```

4. **ESLint configuration issues**
   - The project uses a simplified ESLint config
   - Run `yarn lint:fix` to auto-fix issues

### Performance Tips

1. **Use React.memo()** for expensive components
2. **Implement lazy loading** for large lists
3. **Optimize images** and use appropriate formats
4. **Use FlatList** instead of ScrollView for large datasets
5. **Implement proper error boundaries**

## 📚 Learning Resources

- [React Native Documentation](https://reactnative.dev/)
- [Redux Toolkit Guide](https://redux-toolkit.js.org/)
- [React Navigation Docs](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)

## 🤝 Contributing

1. Follow the established code style (ESLint + Prettier)
2. Write TypeScript for all new code
3. Add proper error handling
4. Include tests for new features
5. Update documentation as needed

## 📄 License

This project is licensed under the MIT License.

---

**Happy Coding! 🎓📱**
