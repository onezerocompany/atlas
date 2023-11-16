import { Encodable, EncodableType } from "./Encodable";
import { ProjectConfig } from "./ProjectConfig";

export class RepoConfig extends Encodable {
  public name: string;
  public github_url: string;
  public projects: ProjectConfig[];

  constructor({ name = "", github_url = "", projects = [] } = {}) {
    super();
    this.name = name;
    this.github_url = github_url;
    this.projects = projects;
  }

  public static decode(type: EncodableType, data: string): RepoConfig {
    return super.decode(type, data) as RepoConfig;
  }

  public encode(type: EncodableType): string {
    return super.encode(type);
  }
}
