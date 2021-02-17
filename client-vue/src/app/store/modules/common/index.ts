import { Module } from 'vuex';
import { CommonStateTypes, IRootState } from '../../interfaces';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import { state } from './state';

const common: Module<CommonStateTypes, IRootState> = {
  state,
  getters,
  mutations,
  actions,
};

export default common;
