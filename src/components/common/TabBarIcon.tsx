import React from 'react';
import { Text } from 'react-native';

interface TabBarIconProps {
  routeName: string;
  focused: boolean;
  color: string;
  size: number;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ routeName, focused, color, size }) => {
  const getIcon = () => {
    switch (routeName) {
      case 'Home':
        return focused ? '🏠' : '🏡';
      case 'Courses':
        return focused ? '📚' : '📖';
      case 'Progress':
        return focused ? '📊' : '📈';
      case 'Profile':
        return focused ? '👤' : '👥';
      default:
        return '❓';
    }
  };

  return (
    <Text style={{ fontSize: size, color }}>
      {getIcon()}
    </Text>
  );
};

export default TabBarIcon;
