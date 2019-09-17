import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';

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
      private angularFunctions: AngularFireFunctions,
      private dialog: MatDialog) {
    this.loading = of(false);

    this.user = this.angularAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.angularDatabase.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
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
    } catch (exception) {
      this.dialog.open(ErrorAlertComponent, {
        role: 'alertdialog',
        data: {
          title: 'Erro de autenticação',
          message: 'Ocorreu uma falha durante a tentativa de entrar na sua conta.'
        }
      });
    } finally {
      this.loading = of(false);
    }
  }

  async signOutAccount() {
    this.loading = of(true);

    try {
      await this.angularAuth.auth.signOut();

      const googleAuth = gapi.auth2.getAuthInstance();
      googleAuth.disconnect();
    } catch (exception) {
      this.dialog.open(ErrorAlertComponent, {
        role: 'alertdialog',
        data: {
          title: 'Erro de autenticação',
          message: 'Ocorreu uma falha durante a tentativa de sair da sua conta.'
        }
      });
    } finally {
      this.loading = of(false);
    }
  }

  async deleteAccount() {
    this.loading = of(true);

    try {
      const googleAuth = gapi.auth2.getAuthInstance();
      const googleUser = await googleAuth.currentUser.get();
      const googleToken = googleUser.getAuthResponse().id_token;
      const googleCredential = auth.GoogleAuthProvider.credential(googleToken);

      const user = this.angularAuth.auth.currentUser;
      
      const currentId = user.uid;
      const currentUser = user;

      await user.reauthenticateWithCredential(googleCredential);

      await this.signOutAccount();

      this.removeUserData(currentId);

      await currentUser.delete();

      googleAuth.disconnect();
    } catch (exception) {
      this.dialog.open(ErrorAlertComponent, {
        role: 'alertdialog',
        data: {
          title: 'Erro de autenticação',
          message: 'Ocorreu uma falha durante a tentativa de apagar a sua conta.'
        }
      });
    } finally {
      this.loading = of(false);
    }
  }

  private setUserData(user) {
    const data = new User(user.uid, user.displayName, user.email, user.photoURL);

    const document: AngularFirestoreDocument<any>
      = this.angularDatabase.doc(`users/${user.uid}`);

    return document.set(data.getData(), { merge: true });
  }

  private removeUserData(id) {
    const recursiveDelete = this.angularFunctions.httpsCallable('recursiveDelete');
    recursiveDelete({ path: `users/${id}` });
  }
}
