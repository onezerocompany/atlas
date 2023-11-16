import { exists } from "fs/promises";
import { EncodableType } from "../models/configs/Encodable";
import { resolve } from "path";

export const repoConfigFiles = [
  { name: "atlas.config.yml", type: EncodableType.yaml },
  { name: "atlas.config.yaml", type: EncodableType.yaml },
  { name: "atlas.config.json", type: EncodableType.json },
];

export interface RepoConfigFile {
  name: string;
  absolute_path: string;
  type: EncodableType;
}

export async function detectConfigFile(
  path: string = process.cwd()
): Promise<RepoConfigFile | null> {
  for (const repoFile of repoConfigFiles) {
    const filePath = `${path}/${repoFile.name}`;
    if (await exists(filePath)) {
      return { ...repoFile, absolute_path: resolve(filePath) };
    }
  }

  return null;
}
