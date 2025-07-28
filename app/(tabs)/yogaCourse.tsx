import { router } from 'expo-router';
import { Plus, ShoppingCart, Star, Clock, Calendar, User, DollarSign, Activity, FileText, ShoppingBasket } from 'lucide-react-native';
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FilterChip } from '@/components/ui/filter-chip';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { IYogaClass, IYogaCourse } from '@/modules/yoga/interface/yogaInterface';
import { yogaService } from '@/modules/yoga/services/yoga-service';
import { useCartStore } from '@/modules/yoga/store/cart-store';


// Types
type DayFilterValue = 'All Days' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
type TimeFilterValue = 'All Times' | 'Morning' | 'Afternoon' | 'Evening';
type DayFilter = DayFilterValue | null;
type TimeFilter = TimeFilterValue | null;

// Filter data
const dayFilters: DayFilterValue[] = ['All Days', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeFilters: TimeFilterValue[] = ['All Times', 'Morning', 'Afternoon', 'Evening'];

// Skeleton colors
const skeletonColors = {
  highlight: '#FFF9F5',
  backgroundColor: '#F5E6DE',
};

function YogaCoursesScreen() {
  const [selectedDay, setSelectedDay] = useState<DayFilter>(null);
  const [selectedTime, setSelectedTime] = useState<TimeFilter>(null);
  const [courses, setCourses] = useState<IYogaCourse[]>([]);
  const [classes, setClasses] = useState<IYogaClass[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cart functionality
  const { addToCart, isClassInCart, getCartItem, getTotalItems } = useCartStore();

  const handleAddToCart = (classData: IYogaClass) => {
    if (!classData.coursePrice) {
      Alert.alert('Error', 'Price information is not available for this class.');
      return;
    }

    addToCart(classData);
    
    Alert.alert(
      'Added to Cart!',
      `${classData.title || classData.courseType} has been added to your cart.`,
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

  // Fetch courses on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Re-fetch data when day/time filters change
  useEffect(() => {
    fetchData();
  }, [selectedDay, selectedTime]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if any filters are active
      const hasActiveFilters = (selectedDay !== null && selectedDay !== 'All Days') || 
                               (selectedTime !== null && selectedTime !== 'All Times');
      setIsFiltering(hasActiveFilters);
      
      if (hasActiveFilters) {
        // Fetch classes when filtering
        const fetchedClasses = await yogaService.searchClassesByDayAndTime({
          day: selectedDay || undefined,
          timeCategory: selectedTime || undefined
        });
        console.log('Fetched classes:', fetchedClasses);
        console.log('Setting isFiltering to:', hasActiveFilters);
        setClasses(fetchedClasses);
        setCourses([]); // Clear courses when showing classes
      } else {
        // Fetch all courses when no filters
        const fetchedCourses = await yogaService.getYogaCourse();
        console.log('Fetched courses:', fetchedCourses);
        setCourses(fetchedCourses);
        setClasses([]); // Clear classes when showing courses
      }
    } catch (err) {
      setError('Failed to fetch yoga data. Please try again.');
      console.error('Error fetching data:', err);
      Alert.alert('Error', 'Failed to fetch yoga data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={12} className="text-yellow-400" fill="#facc15" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" size={12} className="text-yellow-400" fill="#facc15" />
      );
    }

    return stars;
  };
  const renderClassCard = ({ item }: { item: IYogaClass }) => (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400 }}
    >
      <Pressable
        onPress={() => router.push({
          pathname: "/yogaClasses",
          params: { id: item.courseId }
        })}
        android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
      >
        <Card className="mb-4 mx-6 shadow-sm border-0 bg-white">
          <CardContent className="p-4">
            <View>
              {/* Course Type Badge - Top Right */}
              {item.courseType && (
                <View className="absolute top-0 right-0 z-10">
                  <Badge 
                    className="px-3 py-1.5"
                    style={{
                      backgroundColor: '#00796B',
                      borderColor: '#00796B',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.15,
                      shadowRadius: 3,
                      elevation: 4,
                    }}
                  >
                    <Text className="text-xs font-semibold text-white">
                      {item.courseType}
                    </Text>
                  </Badge>
                </View>
              )}

              {/* Class Header */}
              <View className="flex-row items-center mb-3">
                {/* Class Image */}
                <View 
                  className="w-16 h-16 rounded-xl mr-4 items-center justify-center"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <View className="w-12 h-12 bg-black/20 rounded-lg" />
                </View>

                {/* Class Title and Course Info */}
                <View className="flex-1 pr-20">
                  <Text className="text-lg font-semibold text-gray-900 mb-1">
                    {item.title || item.courseType}
                  </Text>
                  <View className="flex-row items-center space-x-4">
                    <View className="flex-row items-center">
                      <Clock size={14} className="text-gray-500 mr-1" />
                      <Text className="text-sm text-gray-600">
                        {item.courseDuration} minutes
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Activity size={14} className="text-gray-500 mr-1" />
                      <Text className="text-sm text-gray-600">
                        {item.courseIntensity}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Class Details Section */}
              <View className="space-y-2">

                {/* Date and Time */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Calendar size={14} className="text-gray-500 mr-1" />
                    <Text className="text-sm font-medium text-gray-700">Date & Time:</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Clock size={14} className="text-gray-500 mr-1" />
                    <Text className="text-sm text-gray-900">
                      {item.date} at {item.courseTime}
                    </Text>
                  </View>
                </View>

                {/* Instructor */}
                {item.teacher && (
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <User size={14} className="text-gray-500 mr-1" />
                      <Text className="text-sm font-medium text-gray-700">Instructor:</Text>
                    </View>
                    <Text className="text-sm text-gray-900">{item.teacher}</Text>
                  </View>
                )}

                {/* Description */}
                {item.description && (
                  <View className="mt-2">
                    <View className="flex-row items-center mb-1">
                      <FileText size={14} className="text-gray-500 mr-1" />
                      <Text className="text-sm font-medium text-gray-700">Description:</Text>
                    </View>
                    <Text className="text-sm text-gray-600 leading-relaxed">
                      {item.description}
                    </Text>
                  </View>
                )}

                {/* Price, Rating, and Add to Cart */}
                <View className="mt-3 pt-2 border-t border-gray-100">
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center">
                      {renderStars(4.5)}
                      <Text className="text-xs text-gray-600 ml-1">4.5</Text>
                    </View>
                    <View className="flex-row items-center">
                      <DollarSign size={14} className="text-gray-500 mr-1" />
                      <Text className="text-sm font-semibold text-gray-900">
                        {item.coursePrice}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Add to Cart Button */}
                  <Button
                    onPress={() => handleAddToCart(item)}
                    className="bg-orange-600 py-2 px-4 w-full"
                    size="sm"
                  >
                    <View className="flex-row items-center justify-center">
                      {isClassInCart(item.id) ? (
                        <>
                          <ShoppingCart size={16} className="text-white mr-2" />
                          <Text className="text-white font-medium text-sm">
                            Add More ({getCartItem(item.id)?.quantity})
                          </Text>
                        </>
                      ) : (
                        <>
                          <ShoppingBasket size={20} className="text-white mr-3" />
                          <Text className="text-white font-medium text-sm">
                            Add to Cart
                          </Text>
                        </>
                      )}
                    </View>
                  </Button>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>
      </Pressable>
    </MotiView>
  );

  const renderCourseCard = ({ item }: { item: IYogaCourse }) => (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400 }}
    >
      <Pressable
        onPress={() => router.push({
          pathname: "/yogaClasses",
          params: { id: item.id }
        })}
        android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
      >
        <Card className="mb-4 mx-6 shadow-sm border-0 bg-white">
          <CardContent className="p-4">
            <View className="flex-row items-center">
              {/* Course Image */}
              <View 
                className="w-16 h-16 rounded-xl mr-4 items-center justify-center"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                {/* Replace with your actual yoga pose images */}
                <View className="w-12 h-12 bg-black/20 rounded-lg" />
              </View>

              {/* Course Details */}
              <View className="flex-1">
                {/* Course Title */}
                <Text className="text-lg font-semibold text-gray-900 mb-1">
                  {item.type}
                </Text>
                
                {/* Lessons Count */}
                <Text className="text-sm text-gray-600 mb-2">
                  {item.duration} minutes • {item.intensity}
                </Text>
                
                {/* Rating and Details Row */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    {/* Star Rating */}
                    <View className="flex-row items-center mr-3">
                      {renderStars(4.5)}
                      <Text className="text-xs text-gray-600 ml-1">
                        4.5
                      </Text>
                    </View>
                  </View>
                </View>
                
                {/* Instructor and Level */}
                <View className="flex-row items-center justify-between mt-1">
                  <Text className="text-xs text-gray-500">
                    {item.day} at {item.time}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    ${item.price}
                  </Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>
      </Pressable>
    </MotiView>
  );

  const renderSkeletonCard = () => (
    <Card className="mb-4 mx-6 shadow-sm border-0 bg-white">
      <CardContent className="p-4">
        <View className="flex-row items-center">
          {/* Course Image Skeleton */}
          <View className="mr-4">
            <Skeleton
              width={64}
              height={64}
              radius={12}
              colorMode="light"
              colors={[skeletonColors.backgroundColor, skeletonColors.highlight]}
            />
          </View>

          {/* Course Details Skeleton */}
          <View className="flex-1">
            {/* Title Skeleton */}
            <View className="mb-2">
              <Skeleton
                width="80%"
                height={20}
                radius={4}
                colorMode="light"
                colors={[skeletonColors.backgroundColor, skeletonColors.highlight]}
              />
            </View>
            
            {/* Duration Skeleton */}
            <View className="mb-3">
              <Skeleton
                width="60%"
                height={16}
                radius={4}
                colorMode="light"
                colors={[skeletonColors.backgroundColor, skeletonColors.highlight]}
              />
            </View>
            
            {/* Rating Skeleton */}
            <View className="mb-2">
              <Skeleton
                width="40%"
                height={14}
                radius={4}
                colorMode="light"
                colors={[skeletonColors.backgroundColor, skeletonColors.highlight]}
              />
            </View>
            
            {/* Info Skeleton */}
            <View className="flex-row justify-between">
              <Skeleton
                width="30%"
                height={12}
                radius={4}
                colorMode="light"
                colors={[skeletonColors.backgroundColor, skeletonColors.highlight]}
              />
              <Skeleton
                width="20%"
                height={12}
                radius={4}
                colorMode="light"
                colors={[skeletonColors.backgroundColor, skeletonColors.highlight]}
              />
            </View>
          </View>
        </View>
      </CardContent>
    </Card>
  );

  return (
    <SafeAreaView className="flex-1" style={{backgroundColor: '#FFF3ED'}}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
          className="px-6 pt-6 pb-4"
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'serif' }}>
              Your Practice
            </Text>
            
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
        </MotiView>


        {/* Day Filter Section */}
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 150 }}
          className="mb-4"
        >
          <View className="px-6 mb-3">
            <Text className="text-sm font-semibold text-gray-700">
              Filter by Day
            </Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          >
            <View className="flex-row">
              {dayFilters.map((day) => (
                <FilterChip
                  key={day}
                  label={day}
                  isSelected={selectedDay === day}
                  onPress={() => setSelectedDay(day)}
                />
              ))}
            </View>
          </ScrollView>
        </MotiView>

        {/* Time Filter Section */}
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 175 }}
          className="mb-6"
        >
          <View className="px-6 mb-3">
            <Text className="text-sm font-semibold text-gray-700">
              Filter by Time
            </Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          >
            <View className="flex-row">
              {timeFilters.map((time) => (
                <FilterChip
                  key={time}
                  label={time}
                  isSelected={selectedTime === time}
                  onPress={() => setSelectedTime(time)}
                />
              ))}
            </View>
          </ScrollView>
        </MotiView>

        {/* Recommended Courses/Classes Section */}
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 300 }}
          className="mb-6"
        >
          <View className="px-6 mb-4">
            <Text className="text-lg font-semibold text-gray-900">
              {isFiltering ? 'Available Classes' : 'Recommended Courses'}
            </Text>
          </View>
          
          {loading ? (
            <>
              {[1, 2, 3, 4].map((_, index) => (
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
                onPress={fetchData}
                className="bg-orange-500 py-2 px-4 rounded-lg mt-4 self-center"
              >
                <Text className="text-white font-medium">Try Again</Text>
              </Pressable>
            </MotiView>
          ) : (isFiltering ? classes.length === 0 : courses.length === 0) ? (
            // Show empty state
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-6 items-center py-8"
            >
              <Text className="text-gray-500 text-center mb-2">
                {isFiltering ? 'No classes found' : 'No courses found'}
              </Text>
              <Text className="text-gray-400 text-center text-sm">
                {isFiltering ? 'Try changing your day or time filter' : 'No courses available at the moment'}
              </Text>
            </MotiView>
          ) : isFiltering ? (
            // Show classes list
            <FlatList
              data={classes}
              renderItem={renderClassCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            // Show courses list
            <FlatList
              data={courses}
              renderItem={renderCourseCard}
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

YogaCoursesScreen.displayName = 'YogaCoursesScreen';
export default YogaCoursesScreen;