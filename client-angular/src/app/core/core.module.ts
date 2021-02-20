import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { LayoutNavbarComponent } from './layout-navbar/layout-navbar.component';
import { CoreRoutingModule } from './core-routing.module';

@NgModule({
  declarations: [NavBarComponent, LayoutNavbarComponent],
  imports: [
    CommonModule,
    CoreRoutingModule
  ]
})
export class CoreModule { }
