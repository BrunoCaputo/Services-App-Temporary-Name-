import { Injectable } from '@angular/core';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { User } from '../utils/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  user: Observable<User>;
  
  constructor(
      private angularAuth: AngularFireAuth,
      private angularDatabase: AngularFirestore) {
    this.user = this.angularAuth.authState.pipe(
      switchMap(user => {
        if (user)
          return this.angularDatabase.doc<User>(`users/${user.uid}`).valueChanges();
        else
          return of(null);
      })
    );
  }

  signInAccount() {
    const provider = new auth.GoogleAuthProvider();

    return this.angularAuth.auth.signInWithRedirect(provider).then(() => {
      return this.angularAuth.auth.getRedirectResult().then((result) => {
        this.setUserData(result.user);
      });
    });
  }
  
  signOutAccount() {
    return this.angularAuth.auth.signOut();
  }

  deleteAccount() {
    var user = this.angularAuth.auth.currentUser;
    
    this.removeUserData(user);

    return user.delete();
  }
  
  private setUserData(user) {
    const documentReference: AngularFirestoreDocument<any>
      = this.angularDatabase.doc(`users/${user.uid}`);
    
    const data: User = {
      id: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL
    };
    
    return documentReference.set(data, { merge: true });
  }

  private removeUserData(user) {
    return this.angularDatabase.doc(`users/${user.uid}`).delete();
  }
}