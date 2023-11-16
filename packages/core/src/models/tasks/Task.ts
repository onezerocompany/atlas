import { Prompt } from "../prompts/Prompt";
import { TaskGraph } from "./TaskGraph";
import { TaskInstance } from "./TaskInstance";

/**
 * A function that determines whether a task should be skipped in a task graph.
 * @param graph - The task graph.
 * @returns A boolean indicating whether the task should be skipped.
 */
export type SkipFunction = (graph: TaskGraph) => boolean;

/**
 * Defines a function that runs a task instance within a task graph.
 * @template Type The type of data expected by the task instance.
 * @param graph The task graph containing the task instance.
 * @param instance The task instance to run.
 * @returns A Promise that resolves when the task instance has completed.
 */
export type RunFunction<Type> = (
  graph: TaskGraph,
  instance: TaskInstance<Type>
) => Promise<void>;

/**
 * Represents the ID of a task, which can be either a string or an array of
 * strings. The array is only used for subtasks meaning each string in the array
 * represents a parent task. The string ID is used for the top-level task.
 */
export type TaskId = string | string[];

/**
 * Represents a task that can be executed.
 * @template Type The type of the result of the task.
 */
export class Task<Type> {
  /**
   * The unique identifier for the task.
   */
  public id: TaskId;

  /**
   * The title of the task.
   */
  public title: string;

  /**
   * An array of TaskIds used for dependency resolution.
   */
  public requires: TaskId[];

  /**
   * The default result of the task.
   */
  public default_result?: Type;

  /**
   * An array of subtasks that belong to this group.
   */
  public subtasks: Task<any>[];

  /**
   * Whether to collapse the group in the graph when successful.
   */
  public collapsible: boolean;

  /**
   * Whether the task is a user input task.
   */
  public userInputTask: boolean;

  /**
   * A function that determines whether the task should be skipped.
   */
  public skip: SkipFunction;

  /**
   * A function that runs the task.
   */
  public run: RunFunction<Type>;

  /**
   * Creates a new task.
   * @param id The unique identifier for the task.
   * @param title The title of the task.
   * @param requires An array of TaskIds used for dependency resolution.
   * @param default_result The default result of the task.
   * @param subtasks An array of subtasks that belong to this group.
   * @param collapsible Whether to collapse the group in the graph when successful.
   * @param skip A function that determines whether the task should be skipped.
   * @param run A function that runs the task.
   */
  constructor({
    id,
    title,
    requires,
    default_result,
    subtasks = [],
    collapsible = false,
    userInputTask = false,
    skip,
    run,
  }: {
    id: string;
    title: string;
    requires?: TaskId[];
    default_result?: Type;
    subtasks?: Task<any>[];
    collapsible?: boolean;
    userInputTask?: boolean;
    skip?: SkipFunction;
    run: RunFunction<Type>;
  }) {
    this.id = id;
    this.title = title;
    this.requires = requires ?? [];
    this.default_result = default_result;
    this.subtasks = subtasks;
    this.collapsible = collapsible;
    this.userInputTask = userInputTask;
    this.skip = skip ?? (() => false);
    this.run = run;
  }

  /**
   * Creates a new Task instance from a Prompt object.
   * @param id - The unique identifier for the task.
   * @param prompt - The Prompt object to use for the task.
   * @param requires - An optional array of TaskIds that this task requires to be completed before it can be run.
   * @param skip - An optional function that determines whether this task should be skipped based on the current state of the graph.
   * @returns A new Task instance.
   */
  public static fromPrompt<Type>({
    id,
    prompt,
    requires,
    skip,
  }: {
    id: string;
    prompt: Prompt<Type>;
    requires?: TaskId[];
    skip?: SkipFunction;
  }): Task<Type> {
    return new Task<Type>({
      id,
      title: prompt.name,
      requires,
      userInputTask: true,
      skip,
      run: async (graph, instance) => {
        // return await graph.prompter.prompt(prompt, instance, graph);
      },
    });
  }
}
