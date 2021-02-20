import { Component, OnInit } from '@angular/core';
import { Activity } from 'src/app/shared/models/activity';
import { ActivityService } from '../../activity.service';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css'],
})
export class ActivityListComponent implements OnInit {
  groupedActivities: [string, Activity[]][] = [];
  constructor(private activityService: ActivityService) {}

  ngOnInit(): void {
    this.activityService.getActvities().subscribe(() => {
      this.groupedActivities = this.activityService.getGroupedActivities;
    });
  }
}
