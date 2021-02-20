import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutNavbarComponent } from './core/layout-navbar/layout-navbar.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    component: LayoutNavbarComponent,
    children: [
      {
        path: 'activities',
        loadChildren: () =>
          import('./activity/activity.module').then(
            (mod) => mod.ActivityModule
          ),
      },
      {
        path: 'errors',
        loadChildren: () =>
          import('./errors/errors.module').then((mod) => mod.ErrorsModule),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
