#!/usr/bin/env bun

import { Command as CommanderCommand } from "commander";
import { Command, allCommands } from "atlas-core";
import { CommandRunner } from "./CommandRunner";

const program = new CommanderCommand();

program
  .version("1.0.0", "-v, --version", "Output the current version")
  .description("A simple Commander CLI program")
  .helpOption("-h, --help", "Display help for command");

function addCommands(commands: Command[], parent: CommanderCommand) {
  for (const command of commands) {
    const cmd = parent.command(command.id);
    cmd.description(command.description);
    for (const option of command.options) {
      cmd.option(
        option.flags.join(", "),
        option.description,
        option.defaultValue
      );
    }
    if (command.subcommands.length === 0) {
      cmd.action(async () => {
        const runner = new CommandRunner(command, cmd.opts().options);
        await runner.execute();
      });
    } else {
      addCommands(command.subcommands, cmd);
    }
  }
}

addCommands(allCommands, program);

program.parse(process.argv);
