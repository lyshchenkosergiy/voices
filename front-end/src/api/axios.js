import axios from 'axios';
import { Auth } from 'aws-amplify';

const { VUE_APP_API_URL } = process.env;
const http = axios.create({
  baseURL: VUE_APP_API_URL,
  headers: {}
});

http.interceptors.request.use(async (config) => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    const jwt = user.signInUserSession.accessToken.jwtToken;
    jwt && (config.headers = { ...config.headers, Authorization: jwt });
    return config;
  } catch (error) {
    console.log(error);
  }
});

const methodsKeys = ['get', 'post', 'put', 'delete'];

export const {
  get: authGet,
  post: authPost,
  put: authPut,
  delete: authDelete
} = methodsKeys.reduce((acc, method) => ({
  ...acc,
  [method]: (url, { headers = {}, data, params } = {}) => http({ method, url, headers, data, params })
}), {});