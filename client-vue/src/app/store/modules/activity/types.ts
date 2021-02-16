import {
  ActivityStateTypes,
  ActivityMutationsTypes,
  ActivityGettersTypes,
  ActivityActionsTypes,
} from '../../interfaces';
import { Store as VuexStore, CommitOptions, DispatchOptions } from 'vuex';

export type ActivityStoreModuleTypes<S = ActivityStateTypes> = Omit<
  VuexStore<S>,
  'commit' | 'getters' | 'dispatch'
> & {
  commit<
    K extends keyof ActivityMutationsTypes,
    P extends Parameters<ActivityMutationsTypes[K]>[1]
  >(
    key: K,
    payload?: P,
    options?: CommitOptions
  ): ReturnType<ActivityMutationsTypes[K]>;
} & {
  getters: {
    [K in keyof ActivityGettersTypes]: ReturnType<ActivityGettersTypes[K]>;
  };
} & {
  dispatch<K extends keyof ActivityActionsTypes>(
    key: K,
    payload?: Parameters<ActivityActionsTypes[K]>[1],
    options?: DispatchOptions
  ): ReturnType<ActivityActionsTypes[K]>;
};
