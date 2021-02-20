import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityDashboardComponent } from './activity-dashboard/activity-dashboard.component';
import { ActivityDetailsComponent } from './activity-details/activity-details.component';
import { ActivityFormComponent } from './activity-form/activity-form.component';
import { ActivityRoutingModule } from './activity-routing.module';

@NgModule({
  declarations: [
    ActivityDashboardComponent,
    ActivityDetailsComponent,
    ActivityFormComponent,
  ],
  imports: [CommonModule, ActivityRoutingModule],
})
export class ActivityModule {}
