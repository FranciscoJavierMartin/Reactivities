import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import {
  ACTIVITY_DASHBOARD_PAGE_NAME,
  ACTIVITY_DASHBOARD_PAGE_ROUTE,
  ACTIVITY_DETAILS_PAGE_NAME,
  ACTIVITY_DETAILS_PAGE_ROUTE,
  CREATE_ACTIVITY_PAGE_NAME,
  CREATE_ACTIVITY_PAGE_ROUTE,
  HOME_PAGE_NAME,
  HOME_PAGE_ROUTE,
  MANAGE_ACTIVITY_PAGE_NAME,
  MANAGE_ACTIVITY_PAGE_ROUTE,
  NOT_FOUND_PAGE_NAME,
  NOT_FOUND_PAGE_ROUTE,
  SERVER_ERROR_PAGE_NAME,
  SERVER_ERROR_PAGE_ROUTE,
  TEST_ERROR_PAGE_NAME,
  TEST_ERROR_PAGE_ROUTE,
} from '../app/constants/routes';
import LayoutWithNavBar from '../app/layout/LayoutWithNavBar.vue';
import ActivityDashboard from '../feature/activities/dashboard/ActivityDashboard.vue';
import ActivityDetails from '../feature/activities/details/ActivityDetails.vue';
import ActivityForm from '../feature/activities/form/ActivityForm.vue';
import HomePage from '../feature/home/HomePage.vue';
import TestErrorsPage from '../feature/errors/TestErrorPage.vue';
import ServerErrorPage from '../feature/errors/ServerErrorPage.vue';
import NotFoundPage from '../feature/errors/NotFoundPage.vue';

const routes: Array<RouteRecordRaw> = [
  { path: HOME_PAGE_ROUTE, name: HOME_PAGE_NAME, component: HomePage },
  {
    path: '/(.+)',
    component: LayoutWithNavBar,
    name: 'LayoutWithNavBar',
    children: [
      {
        path: ACTIVITY_DASHBOARD_PAGE_ROUTE,
        name: ACTIVITY_DASHBOARD_PAGE_NAME,
        component: ActivityDashboard,
      },
      {
        path: ACTIVITY_DETAILS_PAGE_ROUTE,
        name: ACTIVITY_DETAILS_PAGE_NAME,
        component: ActivityDetails,
      },
      {
        path: CREATE_ACTIVITY_PAGE_ROUTE,
        name: CREATE_ACTIVITY_PAGE_NAME,
        component: ActivityForm,
      },
      {
        path: MANAGE_ACTIVITY_PAGE_ROUTE,
        name: MANAGE_ACTIVITY_PAGE_NAME,
        component: ActivityForm,
      },
      {
        path: TEST_ERROR_PAGE_ROUTE,
        name: TEST_ERROR_PAGE_NAME,
        component: TestErrorsPage,
      },
      {
        path: SERVER_ERROR_PAGE_ROUTE,
        name: SERVER_ERROR_PAGE_NAME,
        component: ServerErrorPage,
      },
      {
        path: NOT_FOUND_PAGE_ROUTE,
        name: NOT_FOUND_PAGE_NAME,
        component: NotFoundPage,
      },
      {
        path: '*',
        redirect: { name: NOT_FOUND_PAGE_NAME },
      },
    ],
  },
];

export const history = createWebHistory(import.meta.env.BASE_URL);

const router = createRouter({
  history,
  routes,
});

export default router;
