import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivityDashboardComponent } from './activity-dashboard/activity-dashboard.component';
import { ActivityDetailsComponent } from './activity-details/activity-details.component';
import { ActivityFormComponent } from './activity-form/activity-form.component';

const routes: Routes = [
  { path: '', component: ActivityDashboardComponent },
  { path: ':id', component: ActivityDetailsComponent },
  { path: 'createActivity', component: ActivityFormComponent },
  { path: 'manage/:id', component: ActivityFormComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityRoutingModule {}
