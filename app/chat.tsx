import { ChatError } from '@/components/chat-error';
import { ChatLoading } from '@/components/chat-loading';
import { ConnectionStatus } from '@/components/connection-status';
import { useChatMessages } from '@/modules/chat/hooks/useChatMessages';
import { auth } from '@/service/firebaseConfig';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Bubble, GiftedChat, IMessage } from 'react-native-gifted-chat';
export default function ChatScreen() {
  const { conversationId, adminEmail: passedAdminEmail } = useLocalSearchParams<{ 
    conversationId: string; 
    adminEmail?: string;
  }>();
  const router = useRouter();
  const { 
    messages, 
    loading, 
    error, 
    isConnected, 
    isReconnecting, 
    sendMessage, 
    retryConnection,
    adminEmail 
  } = useChatMessages(conversationId, passedAdminEmail);
  
  const [isSending, setIsSending] = useState(false);
  const [inputText, setInputText] = useState('');
  const currentUser = auth.currentUser;

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    if (newMessages.length > 0 && !isSending) {
      setIsSending(true);
      try {
        const message = newMessages[0];
        const giftedChatMessage = {
          _id: String(message._id),
          text: message.text,
          createdAt: message.createdAt instanceof Date ? message.createdAt : new Date(message.createdAt),
          user: {
            _id: String(message.user._id),
            name: message.user.name || 'User',
          },
        };
        await sendMessage(giftedChatMessage);
      } catch (error) {
        Alert.alert(
          'Failed to send message',
          'Please check your connection and try again.',
          [{ text: 'OK' }]
        );
      } finally {
        setIsSending(false);
      }
    }
  }, [sendMessage, isSending]);

  // Custom header component matching the design
  const renderCustomHeader = () => (
    <View style={{
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            marginRight: 12,
            padding: 4,
          }}
        >
          <Feather name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: '#F3F4F6',
          marginRight: 12,
        }} />
        <View>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#111827',
            marginBottom: 2,
          }}>
            {adminEmail || 'Loading...'}
          </Text>
          <Text style={{
            fontSize: 13,
            color: '#9CA3AF',
          }}>
            Online • Sharing peaceful moments
          </Text>
        </View>
      </View>
    </View>
  );

  // Custom bubble renderer
  const renderBubble = (props :any ) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#A3A380',
          marginRight: 8,
          marginBottom: 4,
        },
        left: {
          backgroundColor: '#FFFFFF',
          marginLeft: 8,
          marginBottom: 4,
          borderWidth: 1,
          borderColor: '#E5E7EB',
        },
      }}
      textStyle={{
        right: {
          color: '#000000',
          fontSize: 15,
          lineHeight: 20,
        },
        left: {
          color: '#000000',
          fontSize: 15,
          lineHeight: 20,
        },
      }}
    />
  );

  // Custom time renderer - positioned below bubble
  const renderTime = (props: any) => (
    <View style={{
      marginTop: 4,
      alignItems: props.position === 'right' ? 'flex-end' : 'flex-start',
      marginHorizontal: 8,
    }}>
      <Text style={{
        color: '#6B7280',
        fontSize: 10,
        fontWeight: '400',
      }}>
        {props.currentMessage?.createdAt 
          ? new Date(props.currentMessage.createdAt).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })
          : ''
        }
      </Text>
    </View>
  );

  // Show debug info if no conversationId
  if (!conversationId) {
    return (
      <SafeAreaView className="flex-1" style={{backgroundColor: '#F9FAFB'}}>
        {renderCustomHeader()}
        <ChatError 
          message="No conversation ID provided. Please go back and try again."
        />
      </SafeAreaView>
    );
  }

  // Show login prompt if user not authenticated
  if (!currentUser) {
    return (
      <SafeAreaView className="flex-1" style={{backgroundColor: '#F9FAFB'}}>
        {renderCustomHeader()}
        <ChatError 
          message="Please log in to start chatting with support"
        />
      </SafeAreaView>
    );
  }
  // Show loading screen while initially loading
  if (loading && messages.length === 0) {
    return (
      <SafeAreaView className="flex-1" style={{backgroundColor: '#F9FAFB'}}>
        {renderCustomHeader()}
        <ChatLoading message="Loading conversation..." />
      </SafeAreaView>
    );
  }

  // Show error screen if there's a persistent error
  if (error && !isReconnecting && messages.length === 0) {
    return (
      <SafeAreaView className="flex-1" style={{backgroundColor: '#F9FAFB'}}>
        {renderCustomHeader()}
        <ChatError 
          message={error} 
          onRetry={retryConnection}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{backgroundColor: '#F9FAFB'}}>
      {renderCustomHeader()}
      
      <ConnectionStatus 
        isConnected={isConnected} 
        isReconnecting={isReconnecting} 
      />

      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: currentUser.uid,
          name: currentUser.displayName || currentUser.email || 'User',
        }}
        renderAvatar={null}
        showUserAvatar={false}
        isLoadingEarlier={loading}
        placeholder="Share your thoughts mindfully..."
        alwaysShowSend
        renderBubble={renderBubble}
        renderTime={renderTime}
        bottomOffset={0}
        minInputToolbarHeight={70}
        scrollToBottomStyle={{
          backgroundColor: '#A3A380',
        }}
        renderInputToolbar={() => (
          <View style={{
            backgroundColor: '#FFFFFF',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            flexDirection: 'row',
            alignItems: 'flex-end',
            minHeight: 70,
          }}>
            <TextInput
              style={{
                backgroundColor: '#F9FAFB',
                borderRadius: 25,
                borderWidth: 1,
                borderColor: '#D1D5DB',
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 15,
                lineHeight: 20,
                color: '#374151',
                minHeight: 44,
                maxHeight: 100,
                flex: 1,
                textAlignVertical: 'center',
                marginRight: 8,
              }}
              placeholder="Share your thoughts mindfully..."
              placeholderTextColor="#9CA3AF"
              multiline
              value={inputText}
              onChangeText={setInputText}
              editable={!isSending && isConnected}
            />
            <TouchableOpacity
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: '#A3A380',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 0,
              }}
              onPress={() => {
                if (inputText && inputText.trim().length > 0) {
                  const messageToSend: IMessage = {
                    _id: Math.round(Math.random() * 1000000).toString(),
                    text: inputText.trim(),
                    createdAt: new Date(),
                    user: {
                      _id: currentUser?.uid || '',
                      name: currentUser?.displayName || currentUser?.email || 'User',
                    },
                  };
                  onSend([messageToSend]);
                  setInputText('');
                }
              }}
              disabled={isSending || !isConnected || !inputText?.trim()}
            >
              <Feather name="send" size={18} color="white" />
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}