import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
  MatListModule,
  MatTooltipModule,
  MatMenuModule,
  MatToolbarModule
} from '@angular/material';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestoreModule,
  AngularFirestore
} from '@angular/fire/firestore';
import {
  AngularFireFunctionsModule,
  AngularFireFunctions
} from '@angular/fire/functions';

import { TextMaskModule } from 'angular2-text-mask';

import { ClipboardModule } from 'ngx-clipboard';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { NgMatSearchBarModule } from 'ng-mat-search-bar';

import { environment } from './../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthenticationService } from './core/authentication.service';
import { AuthenticationGuard } from './core/authentication.guard';

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
import { ServiceCardComponent } from './service-card/service-card.component';
import { FilterPipe } from './pipes/filter.pipe';

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
    ServiceListComponent,
    ServiceCardComponent,
    FilterPipe
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
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
    AngularFireModule.initializeApp(environment.firebase, 'opps'),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireFunctionsModule,
    TextMaskModule,
    ClipboardModule,
    DeviceDetectorModule.forRoot(),
    NgMatSearchBarModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule,
    MatMenuModule,
    MatToolbarModule
  ],
  providers: [
    AngularFireAuth,
    AngularFirestore,
    AngularFireFunctions,
    AuthenticationService,
    AuthenticationGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
