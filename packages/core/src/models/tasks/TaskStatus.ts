/**
 * Enum representing the possible states of a task.
 */
export enum TaskStatus {
  /** The task is pending and has not yet started. */
  Pending = "pending",
  /** The task is currently running. */
  Running = "running",
  /** The task has completed successfully. */
  Completed = "completed",
  /** The task has failed to complete. */
  Failed = "failed",
  /** The task was skipped due to a previous failure or other reason. */
  Skipped = "skipped",
}
