import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Activity } from '../shared/models/activity';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  // activities: Activity[] = [];
  activityRegistry: Map<string, Activity> = new Map<string, Activity>();
  private baseUrlActivities = `${environment.apiUrl}activities`;

  constructor(private http: HttpClient) {}

  getActvities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.baseUrlActivities}`).pipe(
      map((response) => {
        response.forEach((res) => {
          this.activityRegistry.set(res.id, {
            ...res,
            date: new Date(res.date),
          });
        });
        return response;
      })
    );
  }

  get getGroupedActivities(): [string, Activity[]][] {
    return Object.entries(
      this.getActivitiesOrderedByDate(this.activityRegistry.values()).reduce(
        (activities, activity) => {
          const date = format(activity.date!, 'dd MMM yyyy');
          activities[date] = activities[date]
            ? [...activities[date], activity]
            : [activity];
          return activities;
        },
        {} as { [key: string]: Activity[] }
      )
    );
  }

  private getActivitiesOrderedByDate(
    activities: IterableIterator<Activity>
  ): Activity[] {
    return Array.from(activities).sort(
      (a: Activity, b: Activity) => a.date!.getTime() - b.date!.getTime()
    );
  }
}
