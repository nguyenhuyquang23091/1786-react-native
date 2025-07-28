import { router } from 'expo-router';
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react-native';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useCartStore } from '@/modules/yoga/store/cart-store';
import { yogaService } from '@/modules/yoga/services/yoga-service';

function CartScreen() {
  const {
    items,
    userEmail,
    getTotalPrice,
    getTotalItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    setUserEmail,
    addBooking,
  } = useCartStore();
  
  const [email, setEmail] = useState(userEmail);
  const [isBooking, setIsBooking] = useState(false);

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  const handleQuantityChange = (classId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      Alert.alert(
        'Remove Item',
        'Are you sure you want to remove this class from your cart?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(classId) },
        ]
      );
    } else {
      updateQuantity(classId, newQuantity);
    }
  };

  const handleBooking = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address to proceed with booking.');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Please add some classes to your cart before booking.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsBooking(true);

    try {
      // Save email to store
      setUserEmail(email);

      // Create booking request
      const bookingRequest = {
        email,
        items: items.map(item => ({
          id: item.id,
          classData: item.classData,
          quantity: item.quantity,
          addedAt: item.addedAt,
        })),
        totalPrice,
        bookingDate: new Date().toISOString(),
      };

      // Submit to Firebase
      const booking = await yogaService.createBooking(bookingRequest);

      // Add to local store
      addBooking(booking);

      // Clear cart
      clearCart();

      Alert.alert(
        'Booking Confirmed!',
        `Your booking has been confirmed. You will receive a confirmation email at ${email}.`,
        [
          {
            text: 'View My Bookings',
            onPress: () => router.push('/(tabs)/myBookings'),
          },
          { text: 'OK' },
        ]
      );
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert(
        'Booking Failed',
        'There was an error processing your booking. Please try again.'
      );
    } finally {
      setIsBooking(false);
    }
  };

  const renderCartItem = ({ item }: { item: typeof items[0] }) => (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400 }}
    >
      <Card className="mb-4 mx-6 shadow-sm border-0 bg-white">
        <CardContent className="p-4">
          <View className="flex-row items-center">
            {/* Class Image */}
            <View 
              className="w-16 h-16 rounded-xl mr-4 items-center justify-center"
              style={{ backgroundColor: '#F5F5F5' }}
            >
              <View className="w-12 h-12 bg-orange-200 rounded-lg" />
            </View>

            {/* Class Details */}
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900 mb-1">
                {item.classData.title || item.classData.courseType}
              </Text>
              
              <Text className="text-sm text-gray-600 mb-2">
                {item.classData.date} at {item.classData.courseTime}
              </Text>
              
              <Text className="text-sm text-gray-600 mb-2">
                Instructor: {item.classData.teacher}
              </Text>

              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-gray-900">
                  ${item.classData.coursePrice}
                </Text>
                
                {/* Quantity Controls */}
                <View className="flex-row items-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="w-8 h-8 p-0"
                  >
                    <Minus size={16} className="text-gray-600" />
                  </Button>
                  
                  <Text className="mx-3 text-lg font-medium min-w-[30px] text-center">
                    {item.quantity}
                  </Text>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="w-8 h-8 p-0"
                  >
                    <Plus size={16} className="text-gray-600" />
                  </Button>
                </View>
              </View>
            </View>

            {/* Remove Button */}
            <Button
              size="sm"
              variant="ghost"
              onPress={() => removeFromCart(item.id)}
              className="ml-2 p-2"
            >
              <Trash2 size={20} className="text-red-500" />
            </Button>
          </View>
        </CardContent>
      </Card>
    </MotiView>
  );

  const renderEmptyCart = () => (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 items-center justify-center px-6 py-8"
    >
      <ShoppingCart size={64} className="text-gray-400 mb-4" />
      <Text className="text-xl font-semibold text-gray-600 mb-2">
        Your cart is empty
      </Text>
      <Text className="text-gray-500 text-center mb-6">
        Browse our yoga classes and add them to your cart to get started.
      </Text>
      <Button onPress={() => router.push('/(tabs)/yogaCourse')}>
        <Text className="text-white font-medium">Browse Classes</Text>
      </Button>
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
              Shopping Cart
            </Text>
            {totalItems > 0 && (
              <Text className="text-gray-600 mt-1">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
              </Text>
            )}
          </MotiView>
        </View>

        {/* Cart Items */}
        {items.length === 0 ? (
          renderEmptyCart()
        ) : (
          <>
            <FlatList
              data={items}
              renderItem={renderCartItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />

            {/* Email Input & Checkout Section */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 500, delay: 300 }}
              className="px-6 mt-4"
            >
              <Card className="shadow-sm border-0 bg-white">
                <CardContent className="p-6">
                  <Text className="text-lg font-semibold text-gray-900 mb-4">
                    Booking Details
                  </Text>
                  
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </Text>
                    <Input
                      placeholder="Enter your email"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      className="bg-gray-50"
                    />
                  </View>

                  {/* Total */}
                  <View className="flex-row items-center justify-between mb-6 pt-4 border-t border-gray-100">
                    <Text className="text-xl font-semibold text-gray-900">
                      Total
                    </Text>
                    <Text className="text-2xl font-bold text-gray-900">
                      ${totalPrice.toFixed(2)}
                    </Text>
                  </View>

                  {/* Checkout Button */}
                  <Button
                    onPress={handleBooking}
                    disabled={isBooking}
                    className="bg-orange-600 py-4"
                  >
                    <Text className="text-white font-semibold text-lg">
                      {isBooking ? 'Processing...' : 'Book Classes'}
                    </Text>
                  </Button>
                </CardContent>
              </Card>
            </MotiView>
          </>
        )}

        {/* Bottom padding for tab bar */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}

CartScreen.displayName = 'CartScreen';
export default CartScreen;