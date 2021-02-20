import { makeAutoObservable, runInAction } from 'mobx';
import { v4 as uuid } from 'uuid';
import { Activity } from '../models/activity';
import agent from '../api/agent';
import { format } from 'date-fns';

export default class ActivityStore {
  activityRegistry: Map<string, Activity> = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode: boolean = false;
  isLoading: boolean = false;
  isLoadingInitial: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate(): Activity[] {
    return Array.from(this.activityRegistry.values()).sort(
      (a: Activity, b: Activity) => a.date!.getTime() - b.date!.getTime()
    );
  }

  get groupedActivities(): [string, Activity[]][] {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = format(activity.date!, 'dd MMM yyyy');
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: Activity[] })
    );
  }

  loadActivities = async (): Promise<void> => {
    this.isLoadingInitial = true;
    try {
      const activitiesFromServer = await agent.Activities.list();

      activitiesFromServer.forEach((activity: Activity) => {
        this.setActivity(activity);
      });
    } catch (error) {
      console.log(error);
    } finally {
      this.setIsLoadingInitial(false);
    }
  };

  loadActivity = async (id: string): Promise<Activity | undefined> => {
    let activity = this.getActivity(id);
    if (activity) {
      this.selectedActivity = activity;
    } else {
      try {
        this.isLoadingInitial = true;
        activity = await agent.Activities.details(id);
        this.setActivity(activity);
        runInAction(() => {
          this.selectedActivity = activity;
        });
      } catch (error) {
        console.log(error);
      } finally {
        this.setIsLoadingInitial(false);
      }
    }

    return this.selectedActivity;
  };

  setIsLoadingInitial = (state: boolean): void => {
    this.isLoadingInitial = state;
  };

  createActivity = async (activity: Activity): Promise<void> => {
    this.isLoading = true;
    activity.id = uuid();
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        runInAction(() => {
          this.selectedActivity = activity;
        });
        this.editMode = false;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  updateActivity = async (activity: Activity): Promise<void> => {
    this.isLoading = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        runInAction(() => {
          this.selectedActivity = activity;
        });
        this.editMode = false;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  deleteActivity = async (id: string): Promise<void> => {
    this.isLoading = true;

    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  private getActivity = (id: string): Activity | undefined => {
    return this.activityRegistry.get(id);
  };

  private setActivity = (activity: Activity) => {
    activity.date = new Date(activity.date!);
    this.activityRegistry.set(activity.id, activity);
  };
}
