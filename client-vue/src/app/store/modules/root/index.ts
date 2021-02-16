import { Module, ModuleTree } from "vuex";
import { IRootState } from "../../interfaces";
import { getters } from "./getters";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { state } from "./state";
import activityModule from "../activity";

// Modules
const modules: ModuleTree<IRootState> = {
  activityModule,
};

const root: Module<IRootState, IRootState> = {
  state,
  getters,
  mutations,
  actions,
  modules
};

export default root;