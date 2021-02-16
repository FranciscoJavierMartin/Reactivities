import { MutationTree } from 'vuex';
import { MutationTypes } from './mutation-types';
import { ActivityMutationsTypes, ActivityStateTypes } from '../../interfaces';
import { Activity } from '../../../models/activity';

export const mutations: MutationTree<ActivityStateTypes> &
  ActivityMutationsTypes = {
  [MutationTypes.SET_ACTIVITIES](
    state: ActivityStateTypes,
    payload: Activity[]
  ): void {
    payload.forEach((activity: Activity) => {
      state.activityRegistry.set(activity.id, activity);
    });
  },
  [MutationTypes.SET_ACTIVITY](
    state: ActivityStateTypes,
    payload: Activity
  ): void {
    state.activityRegistry.set(payload.id, payload);
  },
  [MutationTypes.SET_SELECTED_ACTIVITY](
    state: ActivityStateTypes,
    payload: Activity
  ): void {
    state.selectedActivity = payload;
  },
  [MutationTypes.SET_EDIT_MODE](
    state: ActivityStateTypes,
    payload: boolean
  ): void {
    state.editMode = payload;
  },
  [MutationTypes.SET_IS_LOADING](
    state: ActivityStateTypes,
    payload: boolean
  ): void {
    state.isLoading = payload;
  },
  [MutationTypes.SET_IS_LOADING_INITIAL](
    state: ActivityStateTypes,
    payload: boolean
  ): void {
    state.isLoadingInitial = payload;
  },
  [MutationTypes.REMOVE_ACTIVITY](state: ActivityStateTypes, payload: string) {
    state.activityRegistry.delete(payload);
  },
};
