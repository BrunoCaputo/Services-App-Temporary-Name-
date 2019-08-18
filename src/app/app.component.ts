import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { AngularFirestore } from '@angular/fire/firestore';

import { AuthenticationService } from './core/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private signInSubscription: Subscription;

  constructor(
    public auth: AuthenticationService,
    public database: AngularFirestore,
    public router: Router) {}
  
  ngOnInit() {
    this.signInSubscription = this.auth.user.subscribe((user) => {
      if (user)
        this.router.navigate(['/home']);
      else
        this.router.navigate(['/sign-in']);
    });
  }

  ngOnDestroy() {
    this.signInSubscription.unsubscribe();
  }
}