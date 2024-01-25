import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, user } from '@angular/fire/auth';
import { User } from '@angular/fire/auth';
import { GoogleAuthProvider } from "firebase/auth";
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth,private UserService:UserService) {}

  async register({ email, password }: { email: string; password: string }) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      await this.UserService.updateUser({
        uid: user.uid,
        name: '',
        email: user.email || ''
      });
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    }
  }

  async login({ email, password }: { email: string; password: string }) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  async loginWithGoogle() {
    try {
      const userCredential = await signInWithPopup(this.auth, new GoogleAuthProvider());
      const user = userCredential.user;
      this.UserService.updateUser({
        uid: user.uid,
        name: user.displayName || '',
        email: user.email || ''
      });
      return user;
    } catch (error) {
      console.error('Google login error:', error);
      return null;
    }
  }



  getUser(): Promise<User | null> {
    return new Promise((resolve) => {
      this.auth.onAuthStateChanged((user) => {
        resolve(user);
      });
    });
  }

  async logout() {
    try {
      await signOut(this.auth);

      console.log('User logged out');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}
