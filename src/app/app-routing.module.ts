import { SignInComponent } from './sign-in/sign-in.component';
import { HomeComponent } from './home/home.component';
import { ExploreComponent } from './explore/explore.component';
import { ServicesComponent } from './services/services.component';
import { ServiceFormComponent } from './service-form/service-form.component';

import { AuthenticationGuard } from './core/authentication.guard';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'sign-in',
    component: SignInComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'explore',
        component: ExploreComponent
      },
      {
        path: 'services',
        component: ServicesComponent,
        children: [
          {
            path: 'service-form',
            component: ServiceFormComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}