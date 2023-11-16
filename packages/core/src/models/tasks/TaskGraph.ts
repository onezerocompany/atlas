import { Task, TaskId } from "./Task";
import { orderTasksInstances } from "../../utils/order_tasks";
import { TaskInstance } from "./TaskInstance";
import { Prompter } from "../prompts/Prompter";

export type TaskGraphSubscription = (instance: TaskInstance<any>) => void;

/**
 * Represents a graph of tasks and their instances. This is the main class that
 * is used to run tasks. It is responsible for ordering the tasks and their
 * instances, and for providing access to the instances. It also provides a
 * method to subscribe to updates to the instances. This is useful for UIs that
 * want to update when a task is completed. The graph also provides access to
 * the options and prompter that are used to run the tasks. The graph is passed
 * to the tasks when they are run.
 */
export class TaskGraph {
  public instances: TaskInstance<any>[];
  public options: Map<string, any>;

  private subscriptions: TaskGraphSubscription[] = [];
  public subscribe(callback: TaskGraphSubscription): number {
    this.subscriptions.push(callback);
    return this.subscriptions.length - 1;
  }

  public unsubscribe(id: number): void {
    this.subscriptions.splice(id, 1);
  }

  private _notifyUpdate(instance: TaskInstance<any>): void {
    for (const subscriber of this.subscriptions) {
      subscriber(instance);
    }
  }

  public get completed(): boolean {
    return this.instances.every((task) => task.completed);
  }

  public instanceFor<Type>(id: TaskId): TaskInstance<Type> | undefined {
    // first level of id should be looked up in the root instances
    // then the second level should be looked up in the subinstances of the first level
    // and so on
    let ids = Array.isArray(id) ? id : [id];
    var instance = this.instances.find((instance) =>
      Array.isArray(instance.task.id)
        ? instance.task.id[instance.task.id.length - 1]
        : instance.task.id === ids.shift()
    );
    if (instance === undefined) {
      throw new Error(`Instance with id ${id} not found`);
    }
    while (ids.length > 0) {
      let subId = ids.shift();
      instance = instance?.subinstances.find((subinstance) =>
        Array.isArray(subinstance.task.id)
          ? subinstance.task.id[subinstance.task.id.length - 1]
          : subinstance.task.id === subId
      );
      if (instance === undefined) {
        throw new Error(`Sub instance with id ${subId} not found`);
      }
    }
    return instance;
  }

  public resultFor<Type>(id: TaskId): Type | null {
    let instance = this.instanceFor<Type>(id);
    return instance?.result ?? null;
  }

  private _subscribeToInstances(instances: TaskInstance<any>[]): void {
    for (let instance of instances) {
      instance.subscribe((state) => {
        this._notifyUpdate(state);
      });
    }
  }

  constructor({
    tasks,
    options,
  }: {
    tasks: Task<any>[];
    options?: Map<string, any>;
  }) {
    this.instances = orderTasksInstances(
      tasks.map((task) => new TaskInstance(task))
    );
    this._subscribeToInstances(this.instances);
    this.options = options ?? new Map<string, any>();
  }
}
