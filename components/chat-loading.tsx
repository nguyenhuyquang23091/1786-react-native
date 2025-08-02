import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

type ChatLoadingProps = {
  message?: string;
};

export function ChatLoading({ message = "Loading messages..." }: ChatLoadingProps) {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <ActivityIndicator size="large" color="#16A34A" />
      <Text className="text-gray-600 mt-2 text-center">{message}</Text>
    </View>
  );
}