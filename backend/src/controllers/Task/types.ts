export type NewTaskType = {
  id?: number;
  name: string;
  projectNumber: number;
  hoursAvailableToWork: number;
  hoursWorked: number;
  notes: string | null;
  hoursRemaining: number;
  numberOfReviews: number;
  reviewHours: number;
  hoursRequiredByBim: number;
  complete: boolean;
  UserId?: number;
  TaskId?: number;
};
