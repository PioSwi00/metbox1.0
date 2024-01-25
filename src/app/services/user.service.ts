import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth: Auth,private db:AngularFireDatabase) { }

  updateUser(user: User): void {
    this.db.object('/users/' + user.uid).update({
      uid: user.uid,
      name: user.name,
      email: user.email,
    });
  }

}
