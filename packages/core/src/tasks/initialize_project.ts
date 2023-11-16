import { TaskStatus } from "..";
import { RepoConfig } from "../models/configs/RepoConfig";
import { Task } from "../models/tasks/Task";
import { RepoConfigFile, detectConfigFile } from "../utils/detect_config_file";
import { findGitRoot } from "../utils/find_git_root";
import { loadConfig } from "../utils/load_config";

const gitRootSubTask = new Task<string>({
  id: "git_root",
  title: "Detect project root",
  run: async (_, instance) => {
    instance.title = "Detecting project root...";

    const git_root = await findGitRoot(process.cwd());
    if (git_root === null) {
      throw new Error("Could not find git root");
    }

    instance.title = "Found project root";
    instance.result = git_root;
  },
});

const detectConfigSubTask = new Task<RepoConfigFile>({
  id: "config_path",
  title: "Detect configuration",
  requires: ["git_root"],
  async run(graph, instance) {
    instance.title = "Detecting  configuration...";

    const git_root = graph.resultFor<string>(["load_project", "git_root"]);
    if (git_root === null) {
      throw new Error("Project root needed to detect configuration");
    }

    instance.result = await detectConfigFile(git_root);
    if (instance.result === null) {
      throw new Error("Could not find project configuration");
    }

    instance.title = "Found configuration";
  },
});

const loadConfigSubTask = new Task<RepoConfig>({
  id: "load_config",
  title: "Load configuration",
  requires: ["config_path"],
  async run(graph, instance) {
    instance.title = "Loading configuration...";

    const config_file = graph.resultFor<RepoConfigFile>([
      "load_project",
      "config_path",
    ]);

    if (config_file === null) {
      throw new Error(
        "Project configuration path needed to load configuration"
      );
    }

    const config = await loadConfig(config_file);
    if (config === null) {
      throw new Error("Could not load project configuration");
    }

    instance.title = "Loaded configuration";
    instance.result = config;
  },
});

export const projectInitTask = new Task<RepoConfig>({
  id: "load_project",
  title: "Initialize project",
  subtasks: [gitRootSubTask, detectConfigSubTask, loadConfigSubTask],
  collapsible: true,
  run: async (graph, instance) => {
    instance.result = graph.resultFor<RepoConfig>([
      "load_project",
      "load_config",
    ]);
    instance.title = "Project initialized";

    var output = "";
    output += `${instance.result?.name ?? "-"}`;
    if (instance.result?.github_url !== undefined) {
      output += ` (${instance.result?.github_url})`;
    }
    instance.output = output;
  },
});
