import { ActionTree } from 'vuex';
import { ActionTypes } from './action-types';
import { MutationTypes } from './mutation-types';
import { RootActionsTypes, IRootState } from '../../interfaces';

export const actions: ActionTree<IRootState, IRootState> &
  RootActionsTypes = {};
