import { makeAutoObservable, runInAction } from 'mobx';
import { v4 as uuid } from 'uuid';
import { Activity } from '../models/activity';
import agent from '../api/agent';

export default class ActivityStore {
  activityRegistry: Map<string, Activity> = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode: boolean = false;
  isLoading: boolean = false;
  isLoadingInitial: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a: Activity, b: Activity) => Date.parse(a.date) - Date.parse(b.date)
    );
  }

  async loadActivities(): Promise<void> {
    try {
      const activitiesFromServer = await agent.Activities.list();

      activitiesFromServer.forEach((activity: Activity) => {
        activity.date = activity.date.split('T')[0];
        this.activityRegistry.set(activity.id, activity);
      });
    } catch (error) {
      console.log(error);
    } finally {
      this.setLoadingInitial(false);
    }
  }

  setLoadingInitial = (state: boolean): void => {
    this.isLoadingInitial = state;
  };

  selectActivity = (id: string): void => {
    this.selectedActivity = this.activityRegistry.get(id);
  };

  cancelSelectedActivity = (): void => {
    this.selectedActivity = undefined;
  };

  openForm = (id?: string): void => {
    if (id) {
      this.selectActivity(id);
    } else {
      this.cancelSelectedActivity();
    }

    this.editMode = true;
  };

  closeForm = (): void => {
    this.editMode = false;
  };

  createActivity = async (activity: Activity): Promise<void> => {
    this.isLoading = true;
    activity.id = uuid();
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
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
        this.selectedActivity = activity;
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
        if (this.selectedActivity?.id === id) {
          this.cancelSelectedActivity();
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };
}
