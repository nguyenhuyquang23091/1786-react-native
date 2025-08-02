import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type ChatErrorProps = {
  message: string;
  onRetry?: () => void;
};

export function ChatError({ message, onRetry }: ChatErrorProps) {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50 px-6">
      <View className="items-center">
        <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
          <Feather name="alert-circle" size={24} color="#EF4444" />
        </View>
        
        <Text className="text-gray-800 text-lg font-medium text-center mb-2">
          Something went wrong
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          {message}
        </Text>      
        {onRetry && (
          <TouchableOpacity 
            onPress={onRetry}
            className="bg-green-700 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-medium">Try Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}