import { GetterTree } from 'vuex';
import { IRootGettersTypes, IRootState } from '../../interfaces';

export const getters: GetterTree<IRootState, IRootState> &
  IRootGettersTypes = {};
