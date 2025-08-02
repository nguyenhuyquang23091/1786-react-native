import { db } from '@/service/firebaseConfig';
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    where
} from 'firebase/firestore';
import { IMessage } from 'react-native-gifted-chat';
import { FirestoreMessage } from '../interface/chatMessageInterface';

export class ChatMessageService {

    private conversationCollectionName = 'conversations';
    private messageCollectionName = 'messages';
    private userCollectionName = 'users';
    
    async getAvailableAdmins() : Promise<{id: string, email: string}[]> {
        try {
            const admins = query (
                collection(db, this.userCollectionName), where('role', '==', 'admin')
            )
            const adminDocs = await getDocs(admins);
            return adminDocs.docs.map(doc => ({
            id : doc.id,
            email : doc.data().email 
       }))
        } catch (error) {
            console.error('Error getting available admins:', error);
            return [];
        }
    }

  

    async findExistingConversation(adminId: string, customerId: string): Promise<string | null> {
        try {
            const conversationRef = collection(db, this.conversationCollectionName);
            const q = query(conversationRef, where('users', 'array-contains', customerId));
            console.log('Finding existing conversation for adminId:', adminId, 'customerId:', customerId);
            
            const querySnapshot = await getDocs(q);
            const existingConversation = querySnapshot.docs.find(doc => {
                return doc.data().users.includes(adminId)
            })
            return existingConversation ? existingConversation.id : null;

        } catch (error) {
            console.error("Error finding existing conversation:", error);
            return null;
        }
    }

    async createConversation(adminId: string, customerId: string): Promise<{conversationId: string, adminEmail: string} | null> {
        try {
            // Check if conversation already exists
            const existingConversationId = await this.findExistingConversation(adminId, customerId);
            if(existingConversationId){
                // Get admin email for existing conversation
                const adminDoc = await getDoc(doc(db, this.userCollectionName, adminId));
                const adminEmail = adminDoc.exists() ? adminDoc.data().email : null;
                if (!adminEmail) {
                    console.error('Admin email not found');
                    return null;
                }
                return { conversationId: existingConversationId, adminEmail };
            }

            const adminDoc = await getDoc(doc(db, this.userCollectionName, adminId));
            if (!adminDoc.exists()) {
                console.error('Admin not found');
                return null;
            }
            const adminEmail = adminDoc.data().email;
            if (!adminEmail) {
                console.error('Admin email not found');
                return null;
            }
            // Create new conversation
            const newConversation =  await addDoc(collection(db, this.conversationCollectionName), {
                users: [adminId, customerId],
                createdAt: serverTimestamp(),
            });
            
            return { conversationId: newConversation.id, adminEmail };

        } catch (error) {
            console.error("Error creating conversation:", error);
            throw error;
        }
    }

    // Send message
    async sendMessage(conversationId: string, message: IMessage): Promise<void> {
        if (!conversationId){
            return;
        }
    
        try {
            const createdAtDate = message.createdAt instanceof Date ? message.createdAt : new Date(message.createdAt);
            
            const firestoreMessage: FirestoreMessage = {
                message: message.text,
                platform: 'iOS', 
                senderId: String(message.user._id),
                senderName: message.user.name || 'User',
                senderRole: 'user', 
                timestamp: createdAtDate.getTime(),
            };

            await addDoc(
                collection(db, this.conversationCollectionName, conversationId, this.messageCollectionName),
                firestoreMessage
            );
                
        } catch (error) {
            console.error('Error sending gifted chat message:', error);
            throw new Error('Failed to send message');
        }
    }

        subscribeToMessages(
            conversationId: string, 
            callback: (messages: IMessage[]) => void,
            errorCallback?: (error: Error) => void
        ): () => void {
            const messagesQuery = query(
                collection(db, this.conversationCollectionName, conversationId, this.messageCollectionName),
                orderBy('timestamp', 'desc')
            );

            return onSnapshot(messagesQuery, (snapshot) => {
                const messages: IMessage[] = snapshot.docs.map((doc) => {
                    const data = doc.data() as FirestoreMessage;
                    return this.transformToGiftedChat(doc.id, data);
                });
                callback(messages);
        }, (error) => {
            console.error('Error listening to messages:', error);
            if (errorCallback) {
                errorCallback(error);
            }
        });
    }

    private transformToGiftedChat(messageId: string, firestoreMessage: FirestoreMessage): IMessage {
        return {
            _id: messageId,
            text: firestoreMessage.message,
            createdAt: new Date(firestoreMessage.timestamp),
            user: {
                _id: firestoreMessage.senderId,
                name: firestoreMessage.senderName,
            },
        };
    }

    
    
}
