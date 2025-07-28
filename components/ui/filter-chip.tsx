import { MotiView } from 'moti';
import * as React from 'react';
import { Pressable } from 'react-native';

import { Text } from './text';

type FilterChipProps = {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  className?: string;
};

export function FilterChip({ label, isSelected, onPress, className }: FilterChipProps) {
  return (
    <MotiView
      from={{ scale: 0.95, opacity: 0.8 }}
      animate={{ scale: isSelected ? 1.05 : 1, opacity: 1 }}
      transition={{ type: 'timing', duration: 200 }}
      className={className}
    >
      <Pressable
        onPress={onPress}
        className={`px-3 py-2 rounded-full mr-2 mb-2 ${
          isSelected 
            ? 'bg-orange-100 border-2 border-orange-300' 
            : 'bg-gray-100 border border-gray-200'
        }`}
      >
        <Text className={`text-sm font-medium ${
          isSelected ? 'text-orange-800' : 'text-gray-600'
        }`}>
          {label}
        </Text>
      </Pressable>
    </MotiView>
  );
}