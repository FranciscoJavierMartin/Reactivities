import { Module } from 'vuex';
import { ActivityStateTypes, IRootState } from '../../interfaces';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import { state } from './state';

// Module
const activity: Module<ActivityStateTypes, IRootState> = {
  state,
  getters,
  mutations,
  actions,
};

export default activity;
