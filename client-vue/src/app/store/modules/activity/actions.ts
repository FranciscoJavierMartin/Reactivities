import { ActionTree } from 'vuex';
import { v4 as uuid } from 'uuid';
import { ActionTypes } from './action-types';
import { MutationTypes } from './mutation-types';
import {
  ActivityActionsTypes,
  ActivityStateTypes,
  IRootState,
} from '../../interfaces';
import agent from '../../../api/agent';
import { Activity } from '../../../models/activity';

export const actions: ActionTree<ActivityStateTypes, IRootState> &
  ActivityActionsTypes = {
  async [ActionTypes.LOAD_ACTIVITIES]({ commit }): Promise<void> {
    try {
      const activitiesFromServer = (await agent.Activities.list()).map(
        (activity: Activity) => ({
          ...activity,
          date: new Date(activity.date!),
        })
      );
      commit(MutationTypes.SET_ACTIVITIES, activitiesFromServer);
    } catch (error) {
      console.log(error);
    } finally {
      commit(MutationTypes.SET_IS_LOADING_INITIAL, false);
    }
  },
  async [ActionTypes.LOAD_ACTIVITY](
    { commit, state },
    payload: string
  ): Promise<Activity | undefined> {
    let activity = state.activityRegistry.get(payload);

    if (activity) {
      commit(MutationTypes.SET_SELECTED_ACTIVITY, activity);
    } else {
      commit(MutationTypes.SET_IS_LOADING_INITIAL, true);

      try {
        activity = await agent.Activities.details(payload);
        activity.date = new Date(activity.date!);
        commit(MutationTypes.SET_ACTIVITY, activity);
        commit(MutationTypes.SET_SELECTED_ACTIVITY, activity);
      } catch (error) {
        console.log(error);
      } finally {
        commit(MutationTypes.SET_IS_LOADING_INITIAL, false);
      }
    }
    return state.selectedActivity;
  },
  async [ActionTypes.CREATE_ACTIVITY](
    { commit },
    payload: Activity
  ): Promise<void> {
    commit(MutationTypes.SET_IS_LOADING, true);
    payload.id = uuid();

    try {
      await agent.Activities.create(payload);
      commit(MutationTypes.SET_ACTIVITY, payload);
      commit(MutationTypes.SET_SELECTED_ACTIVITY, payload);
      commit(MutationTypes.SET_EDIT_MODE, false);
    } catch (error) {
      console.log(error);
    } finally {
      commit(MutationTypes.SET_IS_LOADING, false);
    }
  },
  async [ActionTypes.UPDATE_ACTIVITY](
    { commit },
    payload: Activity
  ): Promise<void> {
    commit(MutationTypes.SET_IS_LOADING, true);
    try {
      await agent.Activities.update(payload);
      commit(MutationTypes.SET_ACTIVITY, payload);
      commit(MutationTypes.SET_SELECTED_ACTIVITY, payload);
      commit(MutationTypes.SET_EDIT_MODE, false);
    } catch (error) {
      console.log(error);
    } finally {
      commit(MutationTypes.SET_IS_LOADING, false);
    }
  },
  async [ActionTypes.DELETE_ACTIVITY](
    { commit },
    payload: string
  ): Promise<void> {
    commit(MutationTypes.SET_IS_LOADING, true);
    try {
      await agent.Activities.delete(payload);
      commit(MutationTypes.REMOVE_ACTIVITY, payload);
    } catch (error) {
      console.log(error);
    } finally {
      commit(MutationTypes.SET_IS_LOADING, false);
    }
  },
};
