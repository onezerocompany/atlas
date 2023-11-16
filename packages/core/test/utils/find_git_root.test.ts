import { describe, it, expect } from "bun:test";
import { findGitRoot } from "../../src/utils/find_git_root";
import { resolve } from "path";

describe("findGitRoot", () => {
  it("should return the git root path when given a path inside a git repository", async () => {
    const dir = resolve(import.meta.dir, "../../../..");
    const gitRoot = await findGitRoot(import.meta.dir);
    expect(gitRoot).toBe(dir);
  });

  it("should return null when given a path outside a git repository", async () => {
    const gitRoot = await findGitRoot("/");
    expect(gitRoot).toBe(null);
  });
});
