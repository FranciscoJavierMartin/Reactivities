import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutNavbarComponent } from './layout-navbar/layout-navbar.component';

const routes: Routes = [
  {
    path: 'main',
    component: LayoutNavbarComponent
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
