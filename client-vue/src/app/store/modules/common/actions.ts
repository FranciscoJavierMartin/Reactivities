import { ActionTree } from 'vuex';
import { ServerError } from '../../../models/serverError';
import {
  CommonActionsTypes,
  CommonStateTypes,
  IRootState,
} from '../../interfaces';
import { ActionTypes } from './action-types';
import { MutationTypes } from './mutation-types';

export const actions: ActionTree<CommonStateTypes, IRootState> &
  CommonActionsTypes = {
  [ActionTypes.SET_ERROR]({ commit }, payload: ServerError): void {
    commit(MutationTypes.SET_ERROR, payload);
  },
};
