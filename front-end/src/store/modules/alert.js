import {
  ALERT,
  SET_ALERT,
  REMOVE_ALERT,
  ALERT_STATE
} from '../actions/alert';

const defaultData = { message: '', type: 'info', canClose: true, duration: 2500 };

export default {
  state: {
    alerts: []
  },
  getters: {
    [ALERT_STATE]: ({ alerts }) => alerts
  },
  mutations: {
    [SET_ALERT]: ({ alerts }, data) => alerts.push(data),
    [REMOVE_ALERT]: ({ alerts }, data) => alerts.splice(alerts.indexOf(data), 1)
  },
  actions: {
    [ALERT]: async ({ commit }, data) => {
      const alert = { ...defaultData, ...data };
      commit(SET_ALERT, alert);
      if (alert.duration) {
        setTimeout(() => commit(REMOVE_ALERT, alert), alert.duration);
      }
    }
  }
};
