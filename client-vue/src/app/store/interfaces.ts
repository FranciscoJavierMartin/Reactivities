import { ActionContext } from 'vuex';
import { MutationTypes as ActivityMTypes } from './modules/activity/mutation-types';
import { ActionTypes as ActivityATypes } from './modules/activity/action-types';
import { MutationTypes as CommonMTypes } from './modules/common/mutation-types';
import { ActionTypes as CommonATypes } from './modules/common/action-types';
import { MutationTypes as RootMTypes } from './modules/root/mutation-types';
import { ActionTypes as RootATypes } from './modules/root/action-types';
import { Activity } from '../models/activity';
import { ServerError } from '../models/serverError';

export interface IRootState {}

export interface IMergedState extends IRootState {
  activityModule: ActivityStateTypes;
  commonModule: CommonStateTypes;
}

export interface IRootGettersTypes {}

export type RootMutationsTypes<S = IRootState> = {};

type AugmentedActionContextRoot = {
  commit<K extends keyof RootMutationsTypes>(
    key: K,
    payload: Parameters<RootMutationsTypes[K]>[1]
  ): ReturnType<RootMutationsTypes[K]>;
} & Omit<ActionContext<IRootState, IRootState>, 'commit'>;

export interface RootActionsTypes {}

/*********************** ACTIVITY MODULE TYPES  ***********************/
export interface ActivityStateTypes {
  activityRegistry: Map<string, Activity>;
  selectedActivity: Activity | undefined;
  editMode: boolean;
  isLoading: boolean;
  isLoadingInitial: boolean;
}

export interface ActivityGettersTypes {
  getActivitiesByDate(state: ActivityStateTypes): Activity[];
  getGroupedActivities(state: ActivityStateTypes): [string, Activity[]][];
  getIsLoadingInitial(state: ActivityStateTypes): boolean;
  getIsLoading(state: ActivityStateTypes): boolean;
  getSelectedActivity(state: ActivityStateTypes): Activity | undefined;
}

export type ActivityMutationsTypes<S = ActivityStateTypes> = {
  [ActivityMTypes.SET_ACTIVITIES](state: S, payload: Activity[]): void;
  [ActivityMTypes.SET_ACTIVITY](state: S, payload: Activity): void;
  [ActivityMTypes.SET_SELECTED_ACTIVITY](state: S, payload: Activity): void;
  [ActivityMTypes.SET_EDIT_MODE](state: S, payload: boolean): void;
  [ActivityMTypes.SET_IS_LOADING](state: S, payload: boolean): void;
  [ActivityMTypes.SET_IS_LOADING_INITIAL](state: S, payload: boolean): void;
  [ActivityMTypes.REMOVE_ACTIVITY](state: S, payload: string): void;
};

export type AugmentedActionContextActivity = {
  commit<K extends keyof ActivityMutationsTypes>(
    key: K,
    payload: Parameters<ActivityMutationsTypes[K]>[1]
  ): ReturnType<ActivityMutationsTypes[K]>;
} & Omit<ActionContext<ActivityStateTypes, IRootState>, 'commit'>;

export interface ActivityActionsTypes {
  [ActivityATypes.LOAD_ACTIVITIES]({
    commit,
  }: AugmentedActionContextActivity): void;
  [ActivityATypes.LOAD_ACTIVITY](
    { commit }: AugmentedActionContextActivity,
    payload: string
  ): Promise<Activity | undefined>;
  [ActivityATypes.CREATE_ACTIVITY](
    { commit }: AugmentedActionContextActivity,
    payload: Activity
  ): Promise<void>;
  [ActivityATypes.UPDATE_ACTIVITY](
    { commit }: AugmentedActionContextActivity,
    payload: Activity
  ): Promise<void>;
  [ActivityATypes.DELETE_ACTIVITY](
    { commit }: AugmentedActionContextActivity,
    payload: string
  ): Promise<void>;
}

/*********************** COMMON MODULE TYPES  ***********************/
export interface CommonStateTypes {
  error: ServerError | null;
}

export interface CommonGettersTypes {
  getError(state: CommonStateTypes): ServerError | null;
}

export type CommonMutationsTypes<S = ActivityStateTypes> = {
  [CommonMTypes.SET_ERROR](state: S, payload: ServerError): void;
};

export type AugmentedActionContextCommon = {
  commit<K extends keyof CommonMutationsTypes>(
    key: K,
    payload: Parameters<CommonMutationsTypes[K]>[1]
  ): ReturnType<CommonMutationsTypes[K]>;
} & Omit<ActionContext<CommonStateTypes, IRootState>, 'commit'>;

export interface CommonActionsTypes {
  [CommonATypes.SET_ERROR](
    { commit }: AugmentedActionContextCommon,
    payload: ServerError
  ): void;
}

export interface StoreActions
  extends RootActionsTypes,
    ActivityActionsTypes,
    CommonActionsTypes {}

export interface StoreGetters
  extends IRootGettersTypes,
    ActivityGettersTypes,
    CommonGettersTypes {}
