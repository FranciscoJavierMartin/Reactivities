import axios, { AxiosError, AxiosResponse } from 'axios';
import router from '../../router';
import {
  NOT_FOUND_PAGE_NAME,
  SERVER_ERROR_PAGE_ROUTE,
} from '../constants/routes';
import { Activity } from '../models/activity';
import { useStore } from '../store';
import { AllActionTypes } from '../store/action-types';
import { useToast } from 'vue-toastification';

const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));

axios.defaults.baseURL = `${import.meta.env.VITE_BASE_URL}`;

axios.interceptors.response.use(
  async (response) => {
    await sleep(1000);
    return response;
  },
  (error: AxiosError) => {
    const { data, status, config } = error.response!;
    const store = useStore();
    const toast = useToast();

    switch (status) {
      case 400:
        if (typeof data === 'string') {
          toast.error(data);
        } else if (
          config.method === 'get' &&
          data.errors.hasOwnProperty('id')
        ) {
          router.push({ name: NOT_FOUND_PAGE_NAME });
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
        router.push({ name: NOT_FOUND_PAGE_NAME });
        break;
      case 500:
        store.dispatch(AllActionTypes.SET_ERROR, data);
        router.push(SERVER_ERROR_PAGE_ROUTE);
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
