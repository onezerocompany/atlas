import { Task, TaskId } from "./Task";
import { TaskStatus } from "./TaskStatus";
import { TaskGraph } from "./TaskGraph";
import { delay } from "../../utils/delay";

/**
 * Represents the state of a task.
 * @template Type The type of the result of the task.
 */
export class TaskInstance<Type> {
  public task: Task<Type>;
  public parentId: TaskId;
  public subinstances: TaskInstance<any>[] = [];

  private _prependParentIds(id: TaskId): TaskId {
    if (Array.isArray(this.parentId) && this.parentId.length > 0) {
      return this.parentId.concat(id);
    } else if (typeof this.parentId === "string") {
      let normalizedId: string[] = typeof id === "string" ? [id] : id;
      return [this.parentId, ...normalizedId];
    } else {
      return id;
    }
  }

  public get fullId(): TaskId {
    return this._prependParentIds(this.task.id);
  }

  public get stringId(): string {
    return Array.isArray(this.fullId) ? this.fullId.join(".") : this.fullId;
  }

  private _status = TaskStatus.Pending;
  get status(): TaskStatus {
    return this._status;
  }
  set status(value: TaskStatus) {
    this._status = value;
    this._notifyUpdate();
  }

  private _title: string | null = null;
  get title(): string | null {
    return this._title;
  }
  set title(value: string | null) {
    this._title = value;
    this._notifyUpdate();
  }

  private _output: string;
  public get output(): string {
    return this._output;
  }
  public set output(value: string) {
    this._output = value;
    this._notifyUpdate();
  }

  private _result: Type | null;
  get result(): Type | null {
    return this._result;
  }
  set result(value: Type | null) {
    this._result = value;
    this._notifyUpdate();
  }

  public get pending(): boolean {
    if (this.status === TaskStatus.Pending) {
      return true;
    }
    for (const subinstance of this.subinstances) {
      if (subinstance.pending) {
        return true;
      }
    }
    return false;
  }

  public get completed(): boolean {
    if (
      this.status === TaskStatus.Completed ||
      this.status === TaskStatus.Failed ||
      this.status === TaskStatus.Skipped
    ) {
      return true;
    }
    for (const subinstance of this.subinstances) {
      if (!subinstance.completed) {
        return false;
      }
    }
    return true;
  }

  // Update subscriptions
  public subscriptions = new Map<number, (state: TaskInstance<Type>) => void>();

  public subscribe(callback: (state: TaskInstance<Type>) => void): number {
    let id = this.subscriptions.size;
    this.subscriptions.set(id, callback);
    callback(this);
    return id;
  }

  public unsubscribe(id: number): void {
    this.subscriptions.delete(id);
  }

  _notifyUpdate() {
    for (const subscription of this.subscriptions.values()) {
      subscription(this);
    }
  }

  async execute(graph: TaskGraph): Promise<void> {
    if (this.task.skip(graph)) {
      this.status = TaskStatus.Skipped;
      return;
    }

    if (
      !this.task.requires
        .map((id) => graph.instanceFor(this._prependParentIds(id))?.status)
        .every((status) => status === TaskStatus.Completed)
    ) {
      throw new Error(
        `Task ${this.fullId} requires incomplete tasks ${this.task.requires}`
      );
    }

    for (const required of this.task.requires) {
      const required_instance = graph.instanceFor(
        this._prependParentIds(required)
      );
      if (required_instance === undefined) {
        throw new Error(
          `Task ${this.fullId} requires missing task ${required}`
        );
      }
      if (required_instance.status !== TaskStatus.Completed) {
        throw new Error(
          `Task ${this.fullId} requires incomplete task ${required}`
        );
      }
    }

    this.status = TaskStatus.Running;

    await delay(500);
    try {
      await this.task.run(graph, this);
      this.status = TaskStatus.Completed;
    } catch (error) {
      this.status = TaskStatus.Failed;
      this.output = error instanceof Error ? error.message : String(error);
      throw error;
    }
  }

  public constructor(task: Task<Type>, parentIds: TaskId = []) {
    this.task = task;
    this.parentId = parentIds;
    this._title = task.title ?? null;
    this._result = task.default_result ?? null;
    this._output = task.title;
    this.subinstances = task.subtasks.map(
      (task) => new TaskInstance(task, this.fullId)
    );

    for (const subinstance of this.subinstances) {
      subinstance.subscribe(() => {
        this._notifyUpdate();
      });
    }
  }
}
