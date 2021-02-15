export const HOME_PAGE_ROUTE = '/';
export const ACTIVITIES_PAGE_ROUTE = '/activities';
export const ACTIVITIES_DETAILS_PAGE_ROUTE = `${ACTIVITIES_PAGE_ROUTE}/:id`;
export const CREATE_ACTIVITY_PAGE_ROUTE = '/createActivity';
export const MANAGE_ACTIVITY_PAGE_ROUTE = '/manage/:id';

export const getActivityDetailsRoute = (id: string) =>
  `${ACTIVITIES_PAGE_ROUTE}/${id}`;
export const getManageActivityRoute = (id: string) => `/manage/${id}`;
