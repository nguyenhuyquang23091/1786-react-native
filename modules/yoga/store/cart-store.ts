import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { IBooking, ICartItem, IYogaClass } from '@/modules/yoga/interface/yogaInterface';

export type CartItem = ICartItem;
export type Booking = IBooking;

interface CartState {
  // Cart state
  items: CartItem[];
  userEmail: string;
  
  // Booking history
  bookings: Booking[];
  
  // Cart actions
  addToCart: (classData: IYogaClass) => void;
  removeFromCart: (classId: string) => void;
  updateQuantity: (classId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  
  // User actions
  setUserEmail: (email: string) => void;
  
  // Booking actions
  addBooking: (booking: Booking) => void;
  getBookingsForUser: (email: string) => Booking[];
  
  // Utility actions
  isClassInCart: (classId: string) => boolean;
  getCartItem: (classId: string) => CartItem | undefined;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      userEmail: '',
      bookings: [],

      // Cart actions
      addToCart: (classData: IYogaClass) => {
        const existingItem = get().getCartItem(classData.id);
        
        if (existingItem) {
          // If item exists, increase quantity
          set((state) => ({
            items: state.items.map((item) =>
              item.id === classData.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          }));
        } else {
          // Add new item to cart
          const newItem: CartItem = {
            id: classData.id,
            classData,
            quantity: 1,
            addedAt: new Date().toISOString(),
          };
          
          set((state) => ({
            items: [...state.items, newItem],
          }));
        }
      },

      removeFromCart: (classId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== classId),
        }));
      },

      updateQuantity: (classId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(classId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === classId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.classData.coursePrice || 0;
          return total + price * item.quantity;
        }, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // User actions
      setUserEmail: (email: string) => {
        set({ userEmail: email });
      },

      // Booking actions
      addBooking: (booking: Booking) => {
        set((state) => ({
          bookings: [booking, ...state.bookings],
        }));
      },

      getBookingsForUser: (email: string) => {
        return get().bookings.filter((booking) => booking.email === email);
      },

      // Utility actions
      isClassInCart: (classId: string) => {
        return get().items.some((item) => item.id === classId);
      },

      getCartItem: (classId: string) => {
        return get().items.find((item) => item.id === classId);
      },
    }),
    {
      name: 'yoga-cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);