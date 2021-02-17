import {
  CommonActionsTypes,
  CommonGettersTypes,
  CommonMutationsTypes,
  CommonStateTypes,
} from '../../interfaces';
import {
  CommitOptions,
  DispatchOptions,
  Store as VuexStore,
} from 'vuex';

export type CommonStoreModuleTypes<S = CommonStateTypes> = Omit<
  VuexStore<S>,
  'commit' | 'getters' | 'dispatch'
> & {
  commit<
    K extends keyof CommonMutationsTypes,
    P extends Parameters<CommonMutationsTypes[K]>[1]
  >(
    key: K,
    payload?: P,
    options?: CommitOptions
  ): ReturnType<CommonMutationsTypes[K]>;
} & {
  getters: {
    [K in keyof CommonGettersTypes]: ReturnType<CommonGettersTypes[K]>;
  };
} & {
  dispatch<K extends keyof CommonActionsTypes>(
    key: K,
    payload?: Parameters<CommonActionsTypes[K]>[1],
    options?: DispatchOptions
  ): ReturnType<CommonActionsTypes[K]>;
};
