import { ActionTypes as activityTypes } from './modules/activity/action-types';
import { ActionTypes as commonTypes } from './modules/common/action-types';
import { ActionTypes as rootATypes } from './modules/root/action-types';

export const AllActionTypes = {
  ...activityTypes,
  ...commonTypes,
  ...rootATypes,
};
