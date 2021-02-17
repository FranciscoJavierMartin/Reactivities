export const HOME_PAGE_ROUTE = '/';
export const ACTIVITY_DASHBOARD_PAGE_ROUTE = '/activities';
export const ACTIVITY_DETAILS_PAGE_ROUTE = '/activities/:id';
export const CREATE_ACTIVITY_PAGE_ROUTE = '/createActivity';
export const MANAGE_ACTIVITY_PAGE_ROUTE = '/manage/:id';
export const TEST_ERROR_PAGE_ROUTE = '/errors';
export const SERVER_ERROR_PAGE_ROUTE = '/server-error';
export const NOT_FOUND_PAGE_ROUTE = '/not-found';

export const HOME_PAGE_NAME = 'Home';
export const ACTIVITY_DASHBOARD_PAGE_NAME = 'ActivityDashboard';
export const ACTIVITY_DETAILS_PAGE_NAME = 'ActivityDetails';
export const CREATE_ACTIVITY_PAGE_NAME = 'CreateActivity';
export const MANAGE_ACTIVITY_PAGE_NAME = 'ManageActivity';
export const TEST_ERROR_PAGE_NAME = 'TestError';
export const SERVER_ERROR_PAGE_NAME = 'ServerError';
export const NOT_FOUND_PAGE_NAME = 'NotFound';

export const getActivityDetailsRoute = (id: string) =>
  `${ACTIVITY_DASHBOARD_PAGE_ROUTE}/${id}`;
export const getManageActivityRoute = (id: string) => `/manage/${id}`;
