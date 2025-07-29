
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../service/firebaseConfig';
import { CurrentUser, UserCredentials } from '../interface/UserInterface';

export class UserService {
    async signUp(user: UserCredentials): Promise<void> {
        try { 
            await createUserWithEmailAndPassword(auth, user.email, user.password);
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





