import { Prompt } from "./Prompt";
import { TaskGraph } from "../tasks/TaskGraph";
import { TaskInstance } from "../tasks/TaskInstance";

export abstract class Prompter {
  public async prompt<Type>(
    prompt: Prompt<Type>,
    instance: TaskInstance<any>,
    graph: TaskGraph
  ): Promise<any> {
    // Here the prompter should prompt the user for input and return the result
    return null;
  }
}
