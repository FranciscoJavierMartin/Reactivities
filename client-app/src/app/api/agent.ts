import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..';
import {
  NOT_FOUND_PAGE_ROUTE,
  SERVER_ERROR_PAGE_ROUTE,
} from '../constants/routes';
import { Activity } from '../models/activity';
import { store } from '../stores/store';

const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

axios.interceptors.response.use(
  async (response) => {
    await sleep(1000);
    return response;
  },
  (error: AxiosError) => {
    const { data, status, config } = error.response!;
    switch (status) {
      case 400:
        if (typeof data === 'string') {
          toast.error(data);
        } else if (
          config.method === 'get' &&
          data.errors.hasOwnProperty('id')
        ) {
          history.push(NOT_FOUND_PAGE_ROUTE);
        } else if (data.errors) {
          const modalStateErrors = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modalStateErrors.push(data.errors[key]);
            }
          }
          throw modalStateErrors.flat();
        }
        break;
      case 401:
        toast.error('Unauthorized');
        break;
      case 404:
        history.push(NOT_FOUND_PAGE_ROUTE);
        break;
      case 500:
        store.commonStore.setServerError(data);
        history.push(SERVER_ERROR_PAGE_ROUTE);
        break;
    }
    return Promise.reject(error);
  }
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const request = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Activities = {
  list: () => request.get<Activity[]>('activities'),
  details: (id: string) => request.get<Activity>(`activities/${id}`),
  create: (activity: Activity) => request.post('activities', activity),
  update: (activity: Activity) =>
    request.put(`activities/${activity.id}`, activity),
  delete: (id: string) => request.del(`activities/${id}`),
};

const agent = {
  Activities,
};

export default agent;
