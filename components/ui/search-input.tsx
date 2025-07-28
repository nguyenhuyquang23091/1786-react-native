import { Search, X } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, type TextInputProps } from 'react-native';

import { Input } from './input';
import { View } from './view';

type SearchInputProps = TextInputProps & {
  className?: string;
  onClear?: () => void;
  showClearButton?: boolean;
};

export function SearchInput({ 
  className, 
  onClear,
  showClearButton = true,
  value,
  ...props 
}: SearchInputProps) {
  const hasValue = value && value.length > 0;

  return (
    <View className={`relative ${className || ''}`}>
      <View className="absolute left-3 top-1/2 -translate-y-2 z-10">
        <Search size={20} className="text-gray-400" />
      </View>
      
      <Input
        className="pl-12 pr-12"
        value={value}
        {...props}
      />
      
      {hasValue && showClearButton && onClear && (
        <Pressable
          onPress={onClear}
          className="absolute right-3 top-1/2 -translate-y-2 z-10"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={20} className="text-gray-400" />
        </Pressable>
      )}
    </View>
  );
}