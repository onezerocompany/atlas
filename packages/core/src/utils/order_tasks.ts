import { TaskInstance } from "../models/tasks/TaskInstance";

/**
 * Orders an array of TaskInstances based on their dependencies.
 * @param tasks An array of TaskInstances to be ordered.
 * @returns An ordered array of TaskInstances.
 */
export function orderTasksInstances(
  tasks: TaskInstance<any>[]
): TaskInstance<any>[] {
  const orderedTasks: TaskInstance<any>[] = [];

  for (const task of tasks) {
    const tasksThatRequireThisTask = orderedTasks.filter((t) =>
      t.task.requires.includes(task.task.id)
    );
    const index = tasksThatRequireThisTask
      .map((t) => orderedTasks.indexOf(t))
      .sort()[0];

    if (index) {
      orderedTasks.splice(index, 0, task);
    } else {
      orderedTasks.push(task);
    }
  }

  return orderedTasks;
}
