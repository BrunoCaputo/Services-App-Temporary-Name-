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

/**
 * Google authentication API.
 */
declare var gapi;

/**
 * Authentication auxiliary service.
 */
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  user: Observable<User>;
  loading: Observable<Boolean>;

  /**
   * Default constructor.
   * @param angularAuth - Instance of AngularFireAuth.
   * @param angularDatabase - Instance of AngularFirestore.
   * @param angularFunctions - Instance of AngularFireFunctions.
   * @param dialog - Instance of MatDialog.
   */
  constructor(
      private angularAuth: AngularFireAuth,
      private angularDatabase: AngularFirestore,
      private angularFunctions: AngularFireFunctions,
      private dialog: MatDialog) {
    this.loading = of(false);

    // Gets the user from the database.
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

  /**
   * Async method for sign-in.
   */
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

  /**
   * Async method to log out of the application.
   */
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

  /**
   * Async method to delete the user's account.
   */
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

  /**
   * Saves the user data to the database.
   */
  private setUserData(user) {
    const data = new User(user.uid, user.displayName, user.email, user.photoURL);

    const document: AngularFirestoreDocument<any>
      = this.angularDatabase.doc(`users/${user.uid}`);

    return document.set(data.getData(), { merge: true });
  }

  /**
   * Removes the user data from the database.
   */
  private removeUserData(id) {
    const recursiveDelete = this.angularFunctions.httpsCallable('recursiveDelete');
    recursiveDelete({ path: `users/${id}` });
  }
}
