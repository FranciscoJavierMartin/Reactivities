export type FilteringPredicate =
  | 'all'
  | 'startDate'
  | 'isGoing'
  | 'isHost'
  | 'past'
  | 'hosting'
  | 'future';
export type FilteringValue = boolean | Date | string;
