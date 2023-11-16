import { Command } from "../../models/commands/command";
import { add } from "./add/add";

export const projects = new Command({
  id: "projects",
  name: "projects",
  description: "Manage projects",
  subcommands: [add],
});
