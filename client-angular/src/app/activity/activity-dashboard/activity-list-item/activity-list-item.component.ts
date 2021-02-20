import { Component, Input, OnInit } from '@angular/core';
import { Activity } from 'src/app/shared/models/activity';

@Component({
  selector: 'app-activity-list-item',
  templateUrl: './activity-list-item.component.html',
  styleUrls: ['./activity-list-item.component.css']
})
export class ActivityListItemComponent implements OnInit {

  @Input() activity: Activity;
  
  constructor() { }

  ngOnInit(): void {
  }

}
