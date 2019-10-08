import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';

/**
 * Has the purpose of redirecting users to the authentication page if the user
 * has not logged in and is trying to access a route that requires
 * authentication.
 */
@Injectable({ providedIn: 'root' })
export class AuthenticationGuard implements CanActivate {
  constructor(private auth: AuthenticationService) {}

  canActivate(next, state): Observable<boolean> {
    return this.auth.user.pipe(take(1), map(user => !!user));
  }

  canActivateChild(next, state): Observable<boolean> {
    return this.canActivate(next, state);
  }
}
