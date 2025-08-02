import { ChatMessageService } from '@/modules/chat/service/chatMessageService';
import { auth as firebaseAuth } from '@/service/firebaseConfig';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Admin = {
  id: string;
  email: string;
};

const MessagesScreen = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [creatingConversation, setCreatingConversation] = useState(false);
  const chatService = new ChatMessageService();
  const currentUser = firebaseAuth.currentUser;

  useEffect(() => {
    loadAvailableAdmins();
  }, []);

  const loadAvailableAdmins = async () => {
    setLoading(true);
    try {
      const adminData = await chatService.getAvailableAdmins();
      const adminList: Admin[] = adminData.map((admin) => ({
        id: admin.id,
        email: admin.email,
      }));
      setAdmins(adminList);
    } catch (error) {
      console.error('Error loading admins:', error);
      Alert.alert('Error', 'Failed to load available admins');
    } finally {
      setLoading(false);
    }
  };

  const createConversationWithAdmin = async (adminId: string) => {
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to start a conversation');
      return;
    }

    setCreatingConversation(true);
    try {
      const result = await chatService.createConversation(adminId, currentUser.uid);
      
      if (result) {
        // Navigate to chat screen with conversation ID and admin email
        router.push({ 
          pathname: '/chat', 
          params: { 
            conversationId: result.conversationId,
            adminEmail: result.adminEmail
          } 
        });
      } else {
        Alert.alert('Error', 'Failed to create conversation - no result returned');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      Alert.alert('Error', `Failed to create conversation: ${error}`);
    } finally {
      setCreatingConversation(false);
    }
  };

  const Avatar = ({ isRequest = false, hasInitial = false, initial = '' }) => (
    <View className={`w-12 h-12 rounded-full ${isRequest ? 'bg-purple-100' : 'bg-gray-200'} items-center justify-center`}>
      {isRequest ? (
        <Feather name="plus" size={20} color="#8B5CF6" />
      ) : hasInitial ? (
        <Text className="text-gray-600 font-medium">{initial}</Text>
      ) : null}
    </View>
  );

  const AdminItem = ({ admin }: { admin: Admin }) => (
    <TouchableOpacity 
      className="flex-row items-center px-4 py-3 bg-white mx-4 mb-2 rounded-lg shadow-sm"
      onPress={() => createConversationWithAdmin(admin.id)}
      disabled={creatingConversation}
    >
      <Avatar 
        hasInitial={true} 
        initial={admin.email.charAt(0).toUpperCase()}
      />
      
      <View className="flex-1 ml-3">
        <Text className="text-gray-900 font-medium text-base mb-1">
          Admin Support
        </Text>
        <Text className="text-gray-600 text-sm">
          {admin.email}
        </Text>
      </View>
      
      <View className="items-center">
        <Feather name="message-circle" size={20} color="#6B7280" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1" style={{backgroundColor: '#FFF3ED'}}>
      {/* Header */}
      <View className="flex-row items-center px-6 pt-6 pb-4">
        <Pressable 
          onPress={() => router.back()}
          className="mr-3 p-2 rounded-full bg-white"
        >
          <ArrowLeft size={20} className="text-gray-800" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'serif' }}>
            Conversation
          </Text>
        </View>
      </View>

      {/* Available Admins List */}
      <ScrollView className="flex-1 pt-4">
        {loading ? (
          <View className="flex-1 items-center justify-center py-8">
            <ActivityIndicator size="large" color="#EA580C" />
            <Text className="text-gray-600 mt-2">Loading available admins...</Text>
          </View>
        ) : admins.length > 0 ? (
          admins.map((admin) => (
            <AdminItem key={admin.id} admin={admin} />
          ))
        ) : (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-gray-600">No admins available at the moment</Text>
            <TouchableOpacity 
              onPress={loadAvailableAdmins}
              className="mt-4 px-4 py-2 bg-orange-600 rounded-lg"
            >
              <Text className="text-white font-medium">Refresh</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Loading Overlay */}
      {creatingConversation && (
        <View className="absolute inset-0 bg-black/50 items-center justify-center">
          <View className="bg-white p-6 rounded-lg items-center">
            <ActivityIndicator size="large" color="#EA580C" />
            <Text className="text-gray-700 mt-2">Creating conversation...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default MessagesScreen;