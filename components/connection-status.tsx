import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

type ConnectionStatusProps = {
  isConnected: boolean;
  isReconnecting?: boolean;
};

export function ConnectionStatus({ isConnected, isReconnecting }: ConnectionStatusProps) {
  if (isConnected && !isReconnecting) return null;

  return (
    <View className={`px-4 py-2 ${isReconnecting ? 'bg-yellow-100' : 'bg-red-100'}`}>
      <View className="flex-row items-center justify-center">
        <Feather 
          name={isReconnecting ? "refresh-cw" : "wifi-off"} 
          size={16} 
          color={isReconnecting ? "#F59E0B" : "#EF4444"} 
        />
        <Text className={`ml-2 text-sm font-medium ${
          isReconnecting ? 'text-yellow-800' : 'text-red-800'
        }`}>
          {isReconnecting ? 'Reconnecting...' : 'Connection lost'}
        </Text>
      </View>
    </View>
  );
}