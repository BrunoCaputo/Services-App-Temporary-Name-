import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { User } from '../utils/user';
import { ErrorAlertComponent } from '../error-alert/error-alert.component';

declare var gapi;

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  user: Observable<User>;
  loading: Observable<Boolean>;
  
  constructor(
      private angularAuth: AngularFireAuth,
      private angularDatabase: AngularFirestore,
      private dialog: MatDialog) {
    this.loading = of(false);

    this.user = this.angularAuth.authState.pipe(
      switchMap(user => {
        if (user)
          return this.angularDatabase.doc<User>(`users/${user.uid}`).valueChanges();
        else
          return of(null);
      })
    );
  }

  async signInAccount() {
    this.loading = of(true);

    try {
      const googleAuth = gapi.auth2.getAuthInstance();
      const googleUser = await googleAuth.signIn();

      const googleToken = googleUser.getAuthResponse().id_token;
      const googleCredential = auth.GoogleAuthProvider.credential(googleToken);

      await this.angularAuth.auth.signInWithCredential(googleCredential).then((credential) => {
        return this.setUserData(credential.user);
      });
    }
    catch(exception) {
      this.dialog.open(ErrorAlertComponent, {
        role: "alertdialog",
        data: {
          title: "Erro de autenticação",
          message: "Ocorreu uma falha durante a tentativa de entrar na sua conta."
        }
      });
    }
    finally {
      this.loading = of(false);
    }
  }
  
  async signOutAccount() {
    this.loading = of(true);

    try {
      await this.angularAuth.auth.signOut();

      const googleAuth = gapi.auth2.getAuthInstance();
      await googleAuth.disconnect();
    }
    catch(exception) {
      this.dialog.open(ErrorAlertComponent, {
        role: "alertdialog",
        data: {
          title: "Erro de autenticação",
          message: "Ocorreu uma falha durante a tentativa de sair da sua conta."
        }
      });
    }
    finally {
      this.loading = of(false);
    }
  }

  async deleteAccount() {
    this.loading = of(true);

    try {
      const user = this.angularAuth.auth.currentUser;
      
      await this.removeUserData(user);
      await user.delete();

      const googleAuth = gapi.auth2.getAuthInstance();
      await googleAuth.disconnect();
    }
    catch(exception) {
      this.dialog.open(ErrorAlertComponent, {
        role: "alertdialog",
        data: {
          title: "Erro de autenticação",
          message: "Ocorreu uma falha durante a tentativa de apagar a sua conta."
        }
      });
    }
    finally {
      this.loading = of(false);
    }
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