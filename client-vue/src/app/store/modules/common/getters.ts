import { GetterTree } from 'vuex';
import { ServerError } from '../../../models/serverError';
import {
  CommonGettersTypes,
  CommonStateTypes,
  IRootState,
} from '../../interfaces';

export const getters: GetterTree<CommonStateTypes, IRootState> &
  CommonGettersTypes = {
  getError: (state: CommonStateTypes): ServerError | null => {
    return state.error;
  },
};
