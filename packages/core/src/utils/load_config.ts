import { RepoConfig } from "../models/configs/RepoConfig";
import { RepoConfigFile } from "./detect_config_file";
import { exists } from "fs/promises";

export async function loadConfig(file: RepoConfigFile): Promise<RepoConfig> {
  if (await exists(file.absolute_path)) {
    const fileContents = await Bun.file(file.absolute_path).text();
    return RepoConfig.decode(file.type, fileContents);
  } else {
    throw new Error(`Config file not found: ${file.absolute_path}`);
  }
}
