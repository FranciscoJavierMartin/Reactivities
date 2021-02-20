import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { LayoutNavbarComponent } from './layout-navbar/layout-navbar.component';
import { CoreRoutingModule } from './core-routing.module';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  declarations: [NavBarComponent, LayoutNavbarComponent, LoadingComponent],
  imports: [CommonModule, CoreRoutingModule],
  exports: [LayoutNavbarComponent, LoadingComponent, NavBarComponent],
})
export class CoreModule {}
