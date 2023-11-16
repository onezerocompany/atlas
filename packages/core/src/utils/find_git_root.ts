import * as path from "path";
import * as fs from "fs/promises";

/**
 * Finds the root directory of a Git repository starting from a given path.
 * @param startPath - The path to start searching from.
 * @returns The root directory of the Git repository, or null if not found.
 */
export async function findGitRoot(
  startPath: string = import.meta.dir
): Promise<string | null> {
  let currentPath = startPath;

  while (currentPath !== "/") {
    const gitPath = path.join(currentPath, ".git");

    try {
      await fs.access(gitPath);
      return currentPath;
    } catch (error) {
      // ignore error and continue searching
    }

    currentPath = path.dirname(currentPath);
  }

  return null;
}
