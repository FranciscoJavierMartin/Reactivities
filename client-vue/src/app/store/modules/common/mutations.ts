import { MutationTree } from 'vuex';
import { ServerError } from '../../../models/serverError';
import { CommonMutationsTypes, CommonStateTypes } from '../../interfaces';
import { MutationTypes } from './mutation-types';

export const mutations: MutationTree<CommonStateTypes> &
  CommonMutationsTypes = {
  [MutationTypes.SET_ERROR](
    state: CommonStateTypes,
    payload: ServerError | null
  ): void {
    state.error = payload;
  },
};
