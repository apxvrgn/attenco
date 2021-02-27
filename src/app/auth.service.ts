import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { Globals } from './Globals';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user!: Observable<firebase.default.User | null>;

  constructor(private auth: AngularFireAuth) {
    this.auth.authState.subscribe((user) => {
      Globals.user = user;
      console.log(user);
    });
  }
}
