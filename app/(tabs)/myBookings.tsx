import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Clock, Mail, User } from 'lucide-react-native';
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { IBooking } from '@/modules/yoga/interface/yogaInterface';
import { yogaService } from '@/modules/yoga/services/yoga-service';
import { useCartStore } from '@/modules/yoga/store/cart-store';

const skeletonColors = {
  highlight: '#FFF9F5',
  backgroundColor: '#F5E6DE',
};

function MyBookingsScreen() {
  const router = useRouter();
  const { userEmail, setUserEmail } = useCartStore();
  const [email, setEmail] = useState(userEmail);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async (emailAddress: string) => {
    if (!emailAddress.trim()) {
      setBookings([]);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userBookings = await yogaService.getBookingsForUser(emailAddress);
      setBookings(userBookings);
      setUserEmail(emailAddress); // Save to store
    } catch (err) {
      setError('Failed to fetch bookings. Please try again.');
      console.error('Error fetching bookings:', err);
      Alert.alert('Error', 'Failed to fetch your bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchBookings(userEmail);
    }
  }, [userEmail]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const renderBookingItem = ({ item }: { item: IBooking }) => (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400 }}
    >
      <Card className="mb-4 mx-6 shadow-sm border-0 bg-white">
        <CardContent className="p-4">
          {/* Booking Header */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Calendar size={16} className="text-gray-600 mr-2" />
              <Text className="text-sm text-gray-600">
                Booked on {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <Badge 
              className={`px-3 py-1 ${getStatusColor(item.status)}`}
            >
              <Text className="text-xs font-semibold text-white capitalize">
                {item.status}
              </Text>
            </Badge>
          </View>

          {/* Booking ID */}
          <Text className="text-xs text-gray-500 mb-3">
            Booking ID: {item.id}
          </Text>

          {/* Classes List */}
          <View className="mb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Classes Booked:
            </Text>
            {item.items.map((classItem, index) => (
              <View key={index} className="mb-3 p-3 bg-gray-50 rounded-lg">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-base font-medium text-gray-900">
                    {classItem.classData.title || classItem.classData.courseType}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Qty: {classItem.quantity}
                  </Text>
                </View>
                
                <View className="flex-row items-center mb-1">
                  <Calendar size={14} className="text-gray-500 mr-1" />
                  <Text className="text-sm text-gray-600">
                    {classItem.classData.date}
                  </Text>
                  <Clock size={14} className="text-gray-500 ml-3 mr-1" />
                  <Text className="text-sm text-gray-600">
                    {classItem.classData.courseTime}
                  </Text>
                </View>
                
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <User size={14} className="text-gray-500 mr-1" />
                    <Text className="text-sm text-gray-600">
                      {classItem.classData.teacher}
                    </Text>
                  </View>
                  <Text className="text-sm font-medium text-gray-900">
                    ${classItem.classData.coursePrice}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Total */}
          <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
            <Text className="text-lg font-semibold text-gray-900">
              Total Paid
            </Text>
            <Text className="text-xl font-bold text-gray-900">
              ${item.totalPrice.toFixed(2)}
            </Text>
          </View>
        </CardContent>
      </Card>
    </MotiView>
  );

  const renderSkeletonBooking = () => (
    <Card className="mb-4 mx-6 shadow-sm border-0 bg-white">
      <CardContent className="p-4">
        <View className="flex-row justify-between items-center mb-3">
          <Skeleton
            width="40%"
            height={16}
            radius={4}
            colorMode="light"
            colors={[skeletonColors.backgroundColor, skeletonColors.highlight]}
          />
          <Skeleton
            width="25%"
            height={20}
            radius={10}
            colorMode="light"
            colors={[skeletonColors.backgroundColor, skeletonColors.highlight]}
          />
        </View>
        
        <Skeleton
          width="60%"
          height={12}
          radius={4}
          colorMode="light"
          colors={[skeletonColors.backgroundColor, skeletonColors.highlight]}
        />
        
        <Skeleton
          width="100%"
          height={80}
          radius={8}
          colorMode="light"
          colors={[skeletonColors.backgroundColor, skeletonColors.highlight]}
        />
        
        <View className="flex-row justify-between items-center">
          <Skeleton
            width="30%"
            height={18}
            radius={4}
            colorMode="light"
            colors={[skeletonColors.backgroundColor, skeletonColors.highlight]}
          />
          <Skeleton
            width="25%"
            height={20}
            radius={4}
            colorMode="light"
            colors={[skeletonColors.backgroundColor, skeletonColors.highlight]}
          />
        </View>
      </CardContent>
    </Card>
  );

  const renderEmptyState = () => (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 items-center justify-center px-6 py-8"
    >
      <Mail size={64} className="text-gray-400 mb-4" />
      <Text className="text-xl font-semibold text-gray-600 mb-2">
        {email ? 'No bookings found' : 'Enter your email'}
      </Text>
      <Text className="text-gray-500 text-center mb-6">
        {email 
          ? 'You haven\'t made any bookings yet. Start by adding classes to your cart!'
          : 'Enter your email address to view your booking history.'
        }
      </Text>
    </MotiView>
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#FFF3ED' }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center px-6 pt-6 pb-4">
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
            className="flex-1"
          >
            <Text className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'serif' }}>
              My Bookings
            </Text>
          </MotiView>
        </View>

        {/* Email Input */}
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 150 }}
          className="px-6 mb-6"
        >
          <Card className="shadow-sm border-0 bg-white">
            <CardContent className="p-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Email Address
              </Text>
              <View className="flex-row">
                <Input
                  placeholder="Enter your email to view bookings"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 bg-gray-50 mr-3"
                />
                <Button
                  onPress={() => fetchBookings(email)}
                  disabled={loading || !email.trim()}
                  className="px-6"
                >
                  <Text className="text-white font-medium">
                    {loading ? 'Loading...' : 'View'}
                  </Text>
                </Button>
              </View>
            </CardContent>
          </Card>
        </MotiView>

        {/* Bookings List */}
        {loading ? (
          <>
            {[1, 2, 3].map((_, index) => (
              <MotiView
                key={index}
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 300, delay: 150 * index }}
              >
                {renderSkeletonBooking()}
              </MotiView>
            ))}
          </>
        ) : error ? (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6"
          >
            <Text className="text-red-500 text-center">{error}</Text>
            <Button
              onPress={() => fetchBookings(email)}
              className="bg-orange-500 py-2 px-4 rounded-lg mt-4 self-center"
            >
              <Text className="text-white font-medium">Try Again</Text>
            </Button>
          </MotiView>
        ) : bookings.length === 0 ? (
          renderEmptyState()
        ) : (
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 300 }}
          >
            <View className="px-6 mb-4">
              <Text className="text-lg font-semibold text-gray-900">
                {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'} Found
              </Text>
            </View>
            
            <FlatList
              data={bookings}
              renderItem={renderBookingItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </MotiView>
        )}

        {/* Bottom padding for tab bar */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}

MyBookingsScreen.displayName = 'MyBookingsScreen';
export default MyBookingsScreen;