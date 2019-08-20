import { ServiceListComponent } from './service-list/service-list.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { HomeComponent } from './home/home.component';
import { ExploreComponent } from './explore/explore.component';
import { ServiceContainerComponent } from './service-container/service-container.component';
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
    canActivateChild: [AuthenticationGuard],
    children: [
      {
        path: '',
        redirectTo: 'explore',
        pathMatch: 'full'
      },
      {
        path: 'explore',
        component: ExploreComponent
      },
      {
        path: 'services',
        component: ServiceContainerComponent,
        children: [
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'prefix'
          },
          {
            path: 'list',
            component: ServiceListComponent
          },
          {
            path: 'new',
            component: ServiceFormComponent,
            data: {
              title: "Novo Serviço",
              subtitle: "Adicione um novo serviço prestado por você",
            }
          },
          {
            path: 'edit/:id',
            component: ServiceFormComponent,
            data: {
              title: "Editar Serviço",
              subtitle: "Edite o serviço prestado por você",
            }
          }
        ]
      }
    ]
  },
  {
    path: "**",
    redirectTo: "home"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}