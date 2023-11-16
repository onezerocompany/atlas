import { Command, Prompt, Task } from "../..";
import { FieldPrompt } from "../../models/_index";

const name = Task.fromPrompt<string>({
  id: "name",
  prompt: new FieldPrompt({
    name: "name",
    message: "Project name",
  }),
});

export const init = new Command({
  id: "init",
  name: "init",
  description: "Initialize the repo for use with atlas",
  tasks: [name],
});
