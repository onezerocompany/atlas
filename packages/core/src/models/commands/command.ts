import { Option } from "./option";
import { Task } from "../tasks/Task";

/**
 * Represents a command that can be executed.
 */
export class Command {
  public id: string;
  public name: string;
  public description: string;
  public options: Option<any>[];
  public subcommands: Command[];
  public tasks: Task<any>[];

  constructor({
    id,
    name,
    description,
    options,
    subcommands,
    tasks,
  }: {
    id: string;
    name: string;
    description: string;
    options?: Option<any>[];
    subcommands?: Command[];
    tasks?: Task<any>[];
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.options = options ?? [];
    this.subcommands = subcommands ?? [];
    this.tasks = tasks ?? [];
  }
}
