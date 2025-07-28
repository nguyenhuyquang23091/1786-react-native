import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Clock, Plus, ShoppingCart, User, DollarSign, Activity, FileText, ShoppingBasket } from 'lucide-react-native';
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { IYogaClass, IYogaCourse } from '@/modules/yoga/interface/yogaInterface';
import { yogaService } from '@/modules/yoga/services/yoga-service';
import { useCartStore } from '@/modules/yoga/store/cart-store';

// Skeleton colors
const skeletonColors = {
  highlight: '#FFF9F5',
  backgroundColor: '#F5E6DE',
};

function YogaClassScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [course, setCourse] = useState<IYogaCourse | null>(null);
  const [classes, setClasses] = useState<IYogaClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cart functionality
  const { addToCart, isClassInCart, getCartItem, getTotalItems } = useCartStore();

  const handleAddToCart = (classData: IYogaClass) => {
    // Ensure class has course price information
    const enrichedClassData: IYogaClass = {
      ...classData,
      coursePrice: course?.price || 0,
      courseDuration: course?.duration || 0,
      courseIntensity: course?.intensity || '',
      courseDay: course?.day || '',
      courseTime: course?.time || '',
    };

    if (!enrichedClassData.coursePrice) {
      Alert.alert('Error', 'Price information is not available for this class.');
      return;
    }

    addToCart(enrichedClassData);
    
    Alert.alert(
      'Added to Cart!',
      `${classData.title} has been added to your cart.`,
      [
        { text: 'Continue Shopping', style: 'default' },
        { 
          text: 'View Cart', 
          style: 'default',
          onPress: () => router.push('/(tabs)/cart')
        },
      ]
    );
  };

  useEffect(() => {
    if (id) {
      fetchCourseAndClasses(id as string);
    }
  }, [id]);

  const fetchCourseAndClasses = async (courseId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch the course details
      const courses = await yogaService.getYogaCourse();
      const selectedCourse = courses.find(c => c.id === courseId);
      
      if (!selectedCourse) {
        throw new Error('Course not found');
      }
      
      setCourse(selectedCourse);
      
      // Fetch the classes for this course
      const classesData = await yogaService.getClassesForCourse(courseId);
      console.log('Classes for course:', classesData);
      setClasses(classesData);
    } catch (err) {
      setError('Failed to fetch yoga classes. Please try again.');
      console.error('Error fetching course or classes:', err);
      Alert.alert('Error', 'Failed to fetch yoga classes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderClassCard = ({ item }: { item: IYogaClass }) => (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400 }}
    >
      <Card className="mb-4 mx-6 shadow-sm border-0 bg-white">
        <CardContent className="p-4">
          <Text className="text-lg font-semibold text-gray-900 mb-1">
            {item.title}
          </Text>
          
          <View className="flex-row items-center mb-2">
            <Calendar size={14} className="text-gray-500 mr-1" />
            <Text className="text-sm text-gray-600 mr-3">
              {item.date}
            </Text>
            <Clock size={14} className="text-gray-500 mr-1" />
            <Text className="text-sm text-gray-600">
              {course?.time}
            </Text>
          </View>
          
          <View className="flex-row items-center mb-2">
            <User size={14} className="text-gray-500 mr-1" />
            <Text className="text-sm text-gray-600">
              Instructor: {item.teacher}
            </Text>
          </View>
          
          <View className="flex-row items-start mb-3">
            <FileText size={14} className="text-gray-500 mr-1 mt-0.5" />
            <Text className="text-sm text-gray-600 flex-1">
              {item.description}
            </Text>
          </View>

          {/* Price and Add to Cart */}
          <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
            <View className="flex-row items-center">
              <DollarSign size={16} className="text-gray-500 mr-1" />
              <Text className="text-lg font-semibold text-gray-900">
                {course?.price || 0}
              </Text>
            </View>
            
            <Button
              onPress={() => handleAddToCart(item)}
              className="bg-orange-600 py-2 px-4"
              size="sm"
            >
              <View className="flex-row items-center">
                {isClassInCart(item.id) ? (
                  <>
                    <ShoppingCart size={14} className="text-white mr-2" />
                    <Text className="text-white font-medium text-sm">
                      Add More ({getCartItem(item.id)?.quantity})
                    </Text>
                  </>
                ) : (
                  <>
                    <ShoppingBasket size={18} className="text-white mr-3" />
                    <Text className="text-white font-medium text-sm">
                      Add to Cart
                    </Text>
                  </>
                )}
              </View>
            </Button>
          </View>
        </CardContent>
      </Card>
    </MotiView>
  );

  const renderSkeletonCard = () => (
    <Card className="mb-4 mx-6 shadow-sm border-0 bg-white">
      <CardContent className="p-4">
        <View className="mb-2">
          <Skeleton
            width="80%"
            height={20}
            radius={4}
            colorMode="light"
            colors={[skeletonColors.backgroundColor, skeletonColors.highlight]}
          />
        </View>
        
        <View className="flex-row mb-3">
          <View className="mr-3">
            <Skeleton
              width={80}
              height={16}
              radius={4}
              colorMode="light"
              colors={[skeletonColors.backgroundColor, skeletonColors.highlight]}
            />
          </View>
          <Skeleton
            width={80}
            height={16}
            radius={4}
            colorMode="light"
            colors={[skeletonColors.backgroundColor, skeletonColors.highlight]}
          />
        </View>
        
        <View className="mb-2">
          <Skeleton
            width="50%"
            height={16}
            radius={4}
            colorMode="light"
            colors={[skeletonColors.backgroundColor, skeletonColors.highlight]}
          />
        </View>
        
        <View>
          <Skeleton
            width="100%"
            height={40}
            radius={4}
            colorMode="light"
            colors={[skeletonColors.backgroundColor, skeletonColors.highlight]}
          />
        </View>
      </CardContent>
    </Card>
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#FFF3ED' }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-6 pb-4">
          <View className="flex-row items-center">
            <Pressable 
              onPress={() => router.back()}
              className="mr-3 p-2 rounded-full bg-white"
            >
              <ArrowLeft size={20} className="text-gray-800" />
            </Pressable>
            <MotiView
              from={{ opacity: 0, translateY: -10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 500 }}
            >
              <Text className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'serif' }}>
                {loading ? 'Loading...' : course?.type || 'Yoga Class'}
              </Text>
            </MotiView>
          </View>

          {/* Cart Icon with Badge */}
          {getTotalItems() > 0 && (
            <Pressable
              onPress={() => router.push('/(tabs)/cart')}
              className="relative"
            >
              <View className="p-2 bg-orange-100 rounded-full">
                <ShoppingCart size={24} className="text-orange-600" />
              </View>
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[20px] h-5 items-center justify-center">
                <Text className="text-white text-xs font-bold">
                  {getTotalItems()}
                </Text>
              </View>
            </Pressable>
          )}
        </View>

        {/* Course Details */}
        {!loading && course && (
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 100 }}
            className="px-6 mb-6"
          >
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-4">
                <View className="flex-row items-center mb-2">
                  <Clock size={14} className="text-gray-500 mr-2" />
                  <Text className="text-sm text-gray-600">
                    Duration: {course.duration} minutes
                  </Text>
                </View>
                <View className="flex-row items-center mb-2">
                  <Activity size={14} className="text-gray-500 mr-2" />
                  <Text className="text-sm text-gray-600">
                    Intensity: {course.intensity}
                  </Text>
                </View>
                <View className="flex-row items-center mb-2">
                  <Calendar size={14} className="text-gray-500 mr-2" />
                  <Text className="text-sm text-gray-600">
                    Day: {course.day} at {course.time}
                  </Text>
                </View>
                <View className="flex-row items-center mb-2">
                  <DollarSign size={14} className="text-gray-500 mr-2" />
                  <Text className="text-sm text-gray-600">
                    Price: ${course.price}
                  </Text>
                </View>
                <View className="flex-row items-start">
                  <FileText size={14} className="text-gray-500 mr-2 mt-0.5" />
                  <Text className="text-sm text-gray-600 flex-1">
                    {course.description}
                  </Text>
                </View>
              </CardContent>
            </Card>
          </MotiView>
        )}


        {/* Classes Section */}
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 200 }}
          className="mb-6"
        >
          <View className="px-6 mb-4">
            <Text className="text-lg font-semibold text-gray-900">
              Available Classes
            </Text>
          </View>
          
          {loading ? (
            // Show skeleton loading UI
            <>
              {[1, 2, 3].map((_, index) => (
                <MotiView
                  key={index}
                  from={{ opacity: 0, translateY: 10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'timing', duration: 300, delay: 150 * index }}
                >
                  {renderSkeletonCard()}
                </MotiView>
              ))}
            </>
          ) : error ? (
            // Show error state
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-6"
            >
              <Text className="text-red-500 text-center">{error}</Text>
              <Pressable
                onPress={() => id && fetchCourseAndClasses(id as string)}
                className="bg-orange-500 py-2 px-4 rounded-lg mt-4 self-center"
              >
                <Text className="text-white font-medium">Try Again</Text>
              </Pressable>
            </MotiView>
          ) : classes.length === 0 ? (
            // Show empty state
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-6 items-center py-8"
            >
              <Text className="text-gray-500 text-center mb-2">No classes available</Text>
              <Text className="text-gray-400 text-center text-sm">
                There are currently no scheduled classes for this course
              </Text>
            </MotiView>
          ) : (
            // Show classes list
            <FlatList
              data={classes}
              renderItem={renderClassCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </MotiView>

        {/* Bottom padding for tab bar */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}

YogaClassScreen.displayName = 'YogaClassScreen';
export default YogaClassScreen; 