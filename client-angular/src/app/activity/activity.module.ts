import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityDashboardComponent } from './activity-dashboard/activity-dashboard.component';
import { ActivityDetailsComponent } from './activity-details/activity-details.component';
import { ActivityFormComponent } from './activity-form/activity-form.component';
import { ActivityRoutingModule } from './activity-routing.module';
import { CoreModule } from '../core/core.module';
import { ActivityListComponent } from './activity-dashboard/activity-list/activity-list.component';
import { ActivityListItemComponent } from './activity-dashboard/activity-list-item/activity-list-item.component';
import { ActivityFiltersComponent } from './activity-dashboard/activity-filters/activity-filters.component';

@NgModule({
  declarations: [
    ActivityDashboardComponent,
    ActivityDetailsComponent,
    ActivityFormComponent,
    ActivityListComponent,
    ActivityListItemComponent,
    ActivityFiltersComponent,
  ],
  imports: [CommonModule, ActivityRoutingModule, CoreModule],
})
export class ActivityModule {}
