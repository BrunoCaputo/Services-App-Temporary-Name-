import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatCardModule,
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatIconModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatListModule } from '@angular/material';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';

import { environment } from './../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthenticationService } from './core/authentication.service';
import { AuthenticationGuard} from './core/authentication.guard';

import { SignInComponent } from './sign-in/sign-in.component';
import { AboutComponent } from './about/about.component';
import { LicenseComponent } from './license/license.component';
import { LoadingComponent } from './loading/loading.component';
import { MessageComponent } from './message/message.component';
import { HomeComponent } from './home/home.component';
import { ServiceFormComponent } from './service-form/service-form.component';
import { ExploreComponent } from './explore/explore.component';
import { ServiceContainerComponent } from './service-container/service-container.component';
import { ErrorAlertComponent } from './error-alert/error-alert.component';
import { ConfirmAlertComponent } from './confirm-alert/confirm-alert.component';
import { ServiceListComponent } from './service-list/service-list.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    LicenseComponent,
    AboutComponent,
    LoadingComponent,
    MessageComponent,
    HomeComponent,
    ServiceFormComponent,
    ExploreComponent,
    ServiceContainerComponent,
    ErrorAlertComponent,
    ConfirmAlertComponent,
    ServiceListComponent
  ],
  entryComponents: [
    AboutComponent,
    LicenseComponent,
    ErrorAlertComponent,
    ConfirmAlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    AngularFireModule.initializeApp(environment.firebase, 'opps'),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatListModule
  ],
  providers: [
    AngularFireAuth,
    AngularFirestore,
    AuthenticationService,
    AuthenticationGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}