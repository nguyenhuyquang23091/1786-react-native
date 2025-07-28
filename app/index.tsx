import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import * as React from 'react';
import { Dimensions, Platform, StatusBar } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function HomeScreen() {
  const [isAnimating, setIsAnimating] = React.useState(false);

  const bottomPadding = Platform.select({
    ios: 32,
    android: 24,
    default: 24,
  });

  const handleAnimationStart = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    setTimeout(() => {
      router.push('./googleLogin');
      setIsAnimating(false);
    },800 );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <MotiView
        className="flex-1 relative"
        animate={{
          opacity: isAnimating ? 0 : 1,
          translateX: isAnimating ? -screenWidth : 0,
          scale: isAnimating ? 0.9 : 1,
        }}
        transition={{
          type: 'timing',
          duration: 800,
          opacity: { duration: 600 },
          translateX: { duration: 800 },
          scale: { duration: 800 },
        }}
      >
        {/* Background Image - Top Half */}
        <Image
          source={require('@/assets/images/yoga/homescreen.png')}
          className="absolute w-full"
          contentFit="cover"
          style={{
            width: screenWidth,
            height: screenHeight / 2,
            top: 0,
          }}
        />
        
        {/* Overlay Card - Bottom Half */}
        <View className="absolute bottom-0 left-0 right-0 h-1/2 bg-white rounded-t-3xl px-6 pt-8 pb-6">
          {/* Title & Duration */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'serif' }}>
              Welcome to your Yoga Journey
            </Text>
            <Text className="text-lg text-gray-500">
              15 min
            </Text>
          </View>
          
          {/* Description Section */}
          <View className="mb-8">
            <Text className="text-base text-gray-700 leading-6">
              Do you love yoga? Discover the perfect balance of meditation, stretching, and relaxation with our gentle, soothing experience. Enjoy free access to high-quality yoga videos from around the world, designed to help you find your inner peace and flexibility.
            </Text>
          </View>
        </View>
        
        <View 
          className="absolute bottom-0 left-0 right-0 px-6 justify-end"
          style={{ paddingBottom: bottomPadding + 100 }}
        >
          <Button 
            variant="default" 
            size="lg"
            className="w-full rounded-2xl shadow-lg"
            style={{ 
              backgroundColor: '#A7A666',
              paddingVertical: 10,
              paddingHorizontal: 32
            }}
            onPress={handleAnimationStart}
          >
            Yoga Course
          </Button>
        </View>
      </MotiView>
    </SafeAreaView>
  );
}