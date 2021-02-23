export const HOME_PAGE_ROUTE = '/';
export const ACTIVITIES_PAGE_ROUTE = '/activities';
export const ACTIVITIES_DETAILS_PAGE_ROUTE = `${ACTIVITIES_PAGE_ROUTE}/:id`;
export const CREATE_ACTIVITY_PAGE_ROUTE = '/createActivity';
export const MANAGE_ACTIVITY_PAGE_ROUTE = '/manage/:id';
export const PROFILE_PAGE_ROUTE = '/profiles/:username';
export const ERRORS_PAGE_ROUTE = '/errors';
export const NOT_FOUND_PAGE_ROUTE = '/not-found';
export const SERVER_ERROR_PAGE_ROUTE = '/server-error';

export const getActivityDetailsRoute = (id: string) =>
  `${ACTIVITIES_PAGE_ROUTE}/${id}`;
export const getManageActivityRoute = (id: string) => `/manage/${id}`;
export const getProfileRoute = (username: string | undefined) => `/profiles/${username}`;
