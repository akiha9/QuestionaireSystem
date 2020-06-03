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
      relative: [],
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

    initRelative(state) {
      if (state.form.relative.length === 0) {
        state.form.optionList.forEach((option) => {
          state.form.relative.push([]);
        });
      }
    },

    clearForm(state) {
      state.form = {
        type: "",
        index: "",
        content: "",
        optionList: [""],
        relative: [],
        typeList: [["", "", ""]],
      };
    },
  },
});

export default store;
