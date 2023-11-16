import { Command, TaskGraph, TaskInstance, TaskStatus } from "atlas-core";
import { CommandLine } from "./CommandLine";
import { renderLine } from "./StatusStyle";

export class CommandRunner {
  public command: Command;
  public graph: TaskGraph;
  public cli = new CommandLine();

  private _linesForInstance(
    instance: TaskInstance<any>,
    level: number = 0
  ): string[] {
    var lines: string[] = [];

    lines.push(
      renderLine({
        line: instance.task.title,
        status: instance.status,
        level,
      })
    );

    for (const subinstance of instance.subinstances) {
      lines = lines.concat(this._linesForInstance(subinstance, level + 1));
    }

    if (instance.output.length > 0) {
      lines = lines.concat(instance.output.split("\n"));
    }

    return lines;
  }

  public constructor(
    command: Command,
    options: Map<string, any> = new Map<string, any>()
  ) {
    this.command = command;
    this.graph = new TaskGraph({
      tasks: command.tasks,
      options: options,
    });

    this.graph.subscribe((instance) => {
      console.log("\n" + instance.stringId);

      let lines = this._linesForInstance(instance);
      console.log(lines.join("\n"));
    });
  }

  private async _runInstance(
    instance: TaskInstance<any>,
    level = 0
  ): Promise<void> {
    if (instance.subinstances.length > 0) {
      instance.status = TaskStatus.Running;
      for (const subinstance of instance.subinstances) {
        await this._runInstance(subinstance, level + 1);
      }
    }
    await instance.execute(this.graph);
  }

  public async execute(): Promise<void> {
    for (const instance of this.graph.instances) {
      await this._runInstance(instance);
    }
  }
}
