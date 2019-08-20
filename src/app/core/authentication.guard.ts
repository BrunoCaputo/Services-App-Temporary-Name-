import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';

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