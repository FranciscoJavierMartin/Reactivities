import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import {
  ACTIVITIES_DETAILS_PAGE_ROUTE,
  ACTIVITIES_PAGE_ROUTE,
  CREATE_ACTIVITY_PAGE_ROUTE,
  HOME_PAGE_ROUTE,
  MANAGE_ACTIVITY_PAGE_ROUTE,
} from '../app/constants/routes';
import LayoutWithNavBar from '../app/layout/LayoutWithNavBar.vue';
import ActivityDashboard from '../feature/activities/dashboard/ActivityDashboard.vue';
import ActivityDetails from '../feature/activities/details/ActivityDetails.vue';
import ActivityForm from '../feature/activities/form/ActivityForm.vue';
import HomePage from '../feature/home/HomePage.vue';
import NotFoundPage from '../feature/not-found/NotFoundPage.vue';

const routes: Array<RouteRecordRaw> = [
  { path: HOME_PAGE_ROUTE, name: 'Home', component: HomePage },
  {
    path: '/(.+)',
    component: LayoutWithNavBar,
    name: 'LayoutWithNavBar',
    children: [
      {
        path: '/activities',
        name: 'ActivityDashboard',
        component: ActivityDashboard,
      },
      {
        path: '/activities/:id',
        name: 'ActivityDetails',
        component: ActivityDetails,
      },
      {
        path: '/createActivity',
        name: 'CreateActivity',
        component: ActivityForm,
      },
      {
        path: '/manage/:id',
        name: 'ManageActivity',
        component: ActivityForm,
      },
    ],
  },
  {
    path: '/*',
    component: NotFoundPage
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
