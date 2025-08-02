import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

type ChatHeaderProps = {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  onMenuPress?: () => void;
};

export function ChatHeader({ 
  title, 
  subtitle, 
  onBackPress = () => router.back(),
  onMenuPress 
}: ChatHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
      <View className="flex-row items-center flex-1">
        <TouchableOpacity onPress={onBackPress} className="mr-3">
          <Feather name="arrow-left" size={24} color="#374151" />
        </TouchableOpacity>
        
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900" numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text className="text-sm text-gray-500" numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      
      {onMenuPress && (
        <TouchableOpacity onPress={onMenuPress}>
          <Feather name="more-vertical" size={24} color="#6B7280" />
        </TouchableOpacity>
      )}
    </View>
  );
}