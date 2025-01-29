import axios from "axios";

export default {
  state: {
    accessToken: null,
    refreshToken: null,
    user: null
  },
  mutations: {
    setTokens(state, { accessToken, refreshToken }) {
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },
    clearTokens(state) {
      state.accessToken = null;
      state.refreshToken = null;
    },
    setUser(state, user) {
      state.user = user;
    }
  },
  actions: {
    async login({ commit }, userInfo) {
      const { access_token, refresh_token } = userInfo;
      commit("setTokens", { accessToken: access_token, refreshToken: refresh_token });
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
    },

    async logout({ commit }) {
      commit("clearTokens");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },

    async refreshAccessToken({ commit, state }) {
      try {
        const response = await axios.post("https://api.vk.com/auth/refresh", {
          refresh_token: state.refreshToken
        });

        const { access_token } = response.data;
        commit("setTokens", { accessToken: access_token, refreshToken: state.refreshToken });
        localStorage.setItem("access_token", access_token);
        return access_token;
      } catch (error) {
        console.error("Ошибка обновления токена:", error);
        commit("clearTokens");
        return null;
      }
    }
  }
};
