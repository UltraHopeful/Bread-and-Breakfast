import axios from 'axios';

const AXIOS_CLIENT = axios.create({
  baseURL: 'https://pfqnboa6zi.execute-api.us-east-1.amazonaws.com/dev/',
});

// AXIOS_CLIENT.interceptors.request.use(function (config) {
//   const authKey = localStorage.getItem(AUTH_TOKEN_KEY);
//   if (authKey) {
//     config.headers.Authorization = authKey;
//   }
//   return config;
// });

AXIOS_CLIENT.interceptors.response.use(
  function (response) {
    return response;
  },
  function (err) {
    // if (err.response.status == 401 || err.response.status == 403) {
    //   window.location.href = '/login';
    //   return Promise.reject(err);
    // }

    return Promise.reject(err);
  }
);

export default AXIOS_CLIENT;
