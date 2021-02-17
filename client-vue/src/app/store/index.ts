import { createStore, useStore as VuexStore } from 'vuex';
import { IRootState } from './interfaces';
import { ActivityStoreModuleTypes } from './modules/activity/types';
import { CommonStoreModuleTypes } from './modules/common/types';
import { RootStoreModuleTypes } from './modules/root/types';

import root from './modules/root';

export const store = createStore<IRootState>(root);

type StoreModules = {
  activity: ActivityStoreModuleTypes;
  common: CommonStoreModuleTypes;
  root: RootStoreModuleTypes;
};

export type Store = ActivityStoreModuleTypes<Pick<StoreModules, 'activity'>> &
  CommonStoreModuleTypes<Pick<StoreModules, 'common'>> &
  RootStoreModuleTypes<Pick<StoreModules, 'root'>>;

export function useStore(): Store {
  return VuexStore() as Store;
}
