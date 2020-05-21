import Vue from "vue";
import Vuex from "vuex";
import _ from "lodash";

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    addQuestionDialogVisible: false,
    form: {
      type: "",
      index: "",
      content: "",
      optionList: [""],
      typeList: [["", "", ""]],
    },
  },

  mutations: {
    switchVisibility(state) {
      state.addQuestionDialogVisible = !state.addQuestionDialogVisible;
    },

    changeFormType(state, payload) {
      state.form.type = payload.type;
    },

    changeForm(state, payload) {
      state.form = _.cloneDeep(payload.form);
    },

    clearForm(state) {
      state.form = {
        type: "",
        index: "",
        content: "",
        optionList: [""],
        typeList: [["", "", ""]],
      };
    },
  },
});

export default store;
