import { Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { getErrorMessage } from '@/lib/auth/errorMessages';
import { Alert } from 'react-native';

export default function AnimatedSignUpScreen() {
  const router = useRouter();
  const { signUp, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleCreateAccount = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    clearError();
    
    try {
      await signUp({ email, password });
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.push('/signIn') }
      ]);
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code, error.message || 'Failed to create account');
      Alert.alert('Sign Up Failed', errorMessage);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center px-8">
        
        {/* Icon with entrance animation */}
        <MotiView 
          className="items-center mb-12"
          from={{
            scale: 0,
            opacity: 0,
            rotate: '-180deg',
          }}
          animate={{
            scale: 1,
            opacity: 1,
            rotate: '0deg',
          }}
          transition={{
            type: 'spring',
            damping: 15,
            stiffness: 150,
          }}
        >
          <MotiView 
            className="w-16 h-16 bg-[#A7A666] rounded-lg items-center justify-center mb-8"
            from={{
              shadowOpacity: 0,
              shadowRadius: 0,
            }}
            animate={{
              shadowOpacity: 0.2,
              shadowRadius: 10,
            }}
            transition={{
              type: 'timing',
              duration: 800,
              delay: 500,
            }}
            style={{
              shadowColor: '#A7A666',
              shadowOffset: { width: 0, height: 4 },
              elevation: 8,
            }}
          >
            {/* Document/Note Icon with inner animation */}
            <MotiView 
              className="w-8 h-10 border-2 border-white rounded-sm"
              from={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                delay: 700,
                damping: 12,
              }}
            >
              <View className="flex-1">
                <MotiView 
                  className="h-0.5 bg-white mx-1 mt-2"
                  from={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ type: 'timing', duration: 300, delay: 900 }}
                />
                <MotiView 
                  className="h-0.5 bg-white mx-1 mt-1"
                  from={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ type: 'timing', duration: 300, delay: 1000 }}
                />
                <MotiView 
                  className="h-0.5 bg-white mx-1 mt-1"
                  from={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ type: 'timing', duration: 300, delay: 1100 }}
                />
                <MotiView 
                  className="h-0.5 bg-white mx-1 mt-1"
                  from={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ type: 'timing', duration: 300, delay: 1200 }}
                />
              </View>
            </MotiView>
          </MotiView>
        </MotiView>

        {/* Header Text with staggered animation */}
        <MotiView 
          className="items-center mb-12"
          from={{
            opacity: 0,
            translateY: 30,
          }}
          animate={{
            opacity: 1,
            translateY: 0,
          }}
          transition={{
            type: 'timing',
            duration: 600,
            delay: 400,
          }}
        >
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              delay: 600,
              damping: 15,
            }}
          >
            <Text className="text-3xl font-bold text-gray-900 mb-3">
              Join Our Community
            </Text>
          </MotiView>
          
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              type: 'timing',
              duration: 500,
              delay: 800,
            }}
          >
            <Text className="text-gray-500 text-center">
              Begin your path to inner peace and wellness
            </Text>
          </MotiView>
        </MotiView>

        {/* Email Input with slide animation */}
        <MotiView 
          className="mb-6"
          from={{
            opacity: 0,
            translateX: -50,
          }}
          animate={{
            opacity: 1,
            translateX: 0,
          }}
          transition={{
            type: 'spring',
            delay: 900,
            damping: 15,
            stiffness: 100,
          }}
        >
          <Text className="text-gray-700 font-medium mb-3">
            Email Address
          </Text>
          <View className="relative">
            <Input
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              className="pl-12 h-14 bg-gray-50 border-gray-200 rounded-2xl text-gray-900"
              placeholderTextColor="#9CA3AF"
            />
            <MotiView 
              className="absolute left-4 top-4"
              from={{ scale: 0, rotate: '-90deg' }}
              animate={{ scale: 1, rotate: '0deg' }}
              transition={{
                type: 'spring',
                delay: 1100,
                damping: 12,
              }}
            >
              <Mail size={20} color="#9CA3AF" />
            </MotiView>
          </View>
        </MotiView>

        {/* Password Input with slide animation */}
        <MotiView 
          className="mb-6"
          from={{
            opacity: 0,
            translateX: 50,
          }}
          animate={{
            opacity: 1,
            translateX: 0,
          }}
          transition={{
            type: 'spring',
            delay: 1000,
            damping: 15,
            stiffness: 100,
          }}
        >
          <Text className="text-gray-700 font-medium mb-3">
            Password
          </Text>
          <View className="relative">
            <Input
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              className="pl-12 pr-12 h-14 bg-gray-50 border-gray-200 rounded-2xl text-gray-900"
              placeholderTextColor="#9CA3AF"
            />
            <MotiView 
              className="absolute left-4 top-4"
              from={{ scale: 0, rotate: '90deg' }}
              animate={{ scale: 1, rotate: '0deg' }}
              transition={{
                type: 'spring',
                delay: 1200,
                damping: 12,
              }}
            >
              <Lock size={20} color="#9CA3AF" />
            </MotiView>
            <Pressable 
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4"
            >
              <MotiView
                animate={{
                  scale: showPassword ? 1.1 : 1,
                }}
                transition={{
                  type: 'spring',
                  damping: 15,
                }}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#9CA3AF" />
                ) : (
                  <Eye size={20} color="#9CA3AF" />
                )}
              </MotiView>
            </Pressable>
          </View>
        </MotiView>

        {/* Confirm Password Input with slide animation */}
        <MotiView 
          className="mb-8"
          from={{
            opacity: 0,
            translateX: -50,
          }}
          animate={{
            opacity: 1,
            translateX: 0,
          }}
          transition={{
            type: 'spring',
            delay: 1100,
            damping: 15,
            stiffness: 100,
          }}
        >
          <Text className="text-gray-700 font-medium mb-3">
            Confirm Password
          </Text>
          <View className="relative">
            <Input
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              className="pl-12 pr-12 h-14 bg-gray-50 border-gray-200 rounded-2xl text-gray-900"
              placeholderTextColor="#9CA3AF"
            />
            <MotiView 
              className="absolute left-4 top-4"
              from={{ scale: 0, rotate: '-90deg' }}
              animate={{ scale: 1, rotate: '0deg' }}
              transition={{
                type: 'spring',
                delay: 1300,
                damping: 12,
              }}
            >
              <Lock size={20} color="#9CA3AF" />
            </MotiView>
            <Pressable 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-4"
            >
              <MotiView
                animate={{
                  scale: showConfirmPassword ? 1.1 : 1,
                }}
                transition={{
                  type: 'spring',
                  damping: 15,
                }}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color="#9CA3AF" />
                ) : (
                  <Eye size={20} color="#9CA3AF" />
                )}
              </MotiView>
            </Pressable>
          </View>
        </MotiView>

        {/* Create Account Button with bounce animation */}
        <MotiView 
          className="mb-12"
          from={{
            opacity: 0,
            scale: 0.8,
            translateY: 20,
          }}
          animate={{
            opacity: 1,
            scale: isLoading ? 0.95 : 1,
            translateY: 0,
          }}
          transition={{
            type: 'spring',
            delay: 1200,
            damping: 15,
            stiffness: 200,
          }}
        >
          <MotiView
            animate={{
              scale: isLoading ? 0.98 : 1,
            }}
            transition={{
              type: 'spring',
              damping: 15,
            }}
          >
            <Button 
              className="h-14 bg-[#A7A666] rounded-2xl"
              onPress={handleCreateAccount}
              disabled={isLoading}
            >
              <MotiView
                animate={{
                  opacity: isLoading ? 0.7 : 1,
                }}
                transition={{
                  type: 'timing',
                  duration: 200,
                }}
              >
                <Text className="text-white font-semibold text-lg">
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </MotiView>
            </Button>
          </MotiView>
        </MotiView>

        {/* Footer with fade-in animation */}
        <MotiView 
          className="items-center"
          from={{
            opacity: 0,
            translateY: 20,
          }}
          animate={{
            opacity: 1,
            translateY: 0,
          }}
          transition={{
            type: 'timing',
            duration: 600,
            delay: 1400,
          }}
        >
          <Text className="text-gray-500 mb-2">
            Already have an account?
          </Text>
          <Pressable onPress={() => {
            router.push('/signIn');
          }}>
            <MotiView
              from={{ scale: 1 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                damping: 15,
              }}
            >
              <Text className="text-[#A7A666] font-medium">
                Sign In
              </Text>
            </MotiView>
          </Pressable>
        </MotiView>

      </View>
    </SafeAreaView>
  );
}