import { Command } from "../../../models/commands/command";
import { projectInitTask } from "../../../tasks/initialize_project";

export const add = new Command({
  id: "add",
  name: "Add Project",
  description: "Add a new project",
  tasks: [projectInitTask],
});
