import { Component, OnInit } from '@angular/core';
import { Activity } from 'src/app/shared/models/activity';
import { ActivityService } from '../activity.service';

@Component({
  selector: 'app-activity-dashboard',
  templateUrl: './activity-dashboard.component.html',
  styleUrls: ['./activity-dashboard.component.css'],
})
export class ActivityDashboardComponent implements OnInit {
  activities: Activity[];
  constructor(private activityService: ActivityService) {}

  ngOnInit(): void {
    this.getActivities();
  }

  private getActivities(): void {
    this.activityService.getActvities().subscribe((response) => {
      this.activities = response;
    });
  }
}
