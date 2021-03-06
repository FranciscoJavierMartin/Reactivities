import { GetterTree } from 'vuex';
import { format } from 'date-fns';
import { Activity } from '../../../models/activity';
import {
  ActivityGettersTypes,
  ActivityStateTypes,
  IRootState,
} from '../../interfaces';

export const getters: GetterTree<ActivityStateTypes, IRootState> &
  ActivityGettersTypes = {
  getActivitiesByDate: (state: ActivityStateTypes): Activity[] => {
    return getActivitiesOrderedByDate(state.activityRegistry.values());
  },
  getIsLoadingInitial: (state: ActivityStateTypes): boolean => {
    return state.isLoadingInitial;
  },
  getIsLoading: (state: ActivityStateTypes): boolean => {
    return state.isLoading;
  },
  getSelectedActivity: (state: ActivityStateTypes): Activity | undefined => {
    return state.selectedActivity;
  },
  getGroupedActivities: (state: ActivityStateTypes): [string, Activity[]][] => {
    return Object.entries(
      getActivitiesOrderedByDate(state.activityRegistry.values()).reduce(
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
  },
};

function getActivitiesOrderedByDate(
  activities: IterableIterator<Activity>
): Activity[] {
  return Array.from(activities).sort(
    (a: Activity, b: Activity) => a.date!.getTime() - b.date!.getTime()
  );
}
