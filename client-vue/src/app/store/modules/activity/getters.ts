import { GetterTree } from 'vuex';
import { Activity } from '../../../models/activity';
import {
  ActivityGettersTypes,
  ActivityStateTypes,
  IRootState,
} from '../../interfaces';

export const getters: GetterTree<ActivityStateTypes, IRootState> &
  ActivityGettersTypes = {
  getActivitiesByDate: (state: ActivityStateTypes): Activity[] => {
    return Array.from(state.activityRegistry.values()).sort(
      (a: Activity, b: Activity) => Date.parse(a.date) - Date.parse(b.date)
    );
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
};
