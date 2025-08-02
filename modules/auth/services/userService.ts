
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../service/firebaseConfig';
import { CurrentUser, UserCredentials } from '../interface/UserInterface';




export class UserService {
    async signUp(user: UserCredentials): Promise<void> {
        try { 
    
           const userCredentials =  await createUserWithEmailAndPassword(auth, user.email, user.password);
            await setDoc(doc(db, 'users', userCredentials.user.uid), {
                uid : userCredentials.user.uid,
                email: userCredentials.user.email,
                role: 'customer'
               
            });
        }  catch ( error){
            console.error("Error during sign up:", error);
            throw error; 
        }
    }

    async signIn(user: UserCredentials): Promise<void> {
        try { 
            await signInWithEmailAndPassword(auth, user.email, user.password);
        } catch (error) {
            console.error("Error during sign in:", error);
            throw error;
        }
    }

    async getCurrentUser() : Promise<CurrentUser | null> {
        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe();
                if(user){
                    resolve({
                        uid : user.uid, 
                        email: user.email,
                        displayName: user.displayName,
                        emailVerified: user.emailVerified
                    })
                    //When user Log out, unsubscribe will be called
                } else{
                    resolve(null);
                }
            })
        })


        
    }


}





