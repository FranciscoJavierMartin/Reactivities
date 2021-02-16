import { MutationTree } from 'vuex';
import { MutationTypes } from './mutation-types';
import { RootMutationsTypes, IRootState } from '../../interfaces';

export const mutations: MutationTree<IRootState> & RootMutationsTypes = {};
