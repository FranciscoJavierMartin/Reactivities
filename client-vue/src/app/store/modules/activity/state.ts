import { Activity } from '../../../models/activity';
import { ActivityStateTypes } from '../../interfaces';

export const state: ActivityStateTypes = {
  activityRegistry: new Map<string, Activity>(),
  selectedActivity: undefined,
  editMode: false,
  isLoading: false,
  isLoadingInitial: true,
};
