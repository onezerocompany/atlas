import yaml from "yaml";

import { Encodable } from "./Encodable";

export class ProjectConfig extends Encodable {
  public name: string;

  constructor({ name = "" } = {}) {
    super();
    this.name = name;
  }

  public static decode(type: string, data: string): ProjectConfig {
    if (type === "yaml") {
      return yaml.parse(data);
    } else {
      return JSON.parse(data);
    }
  }

  public encode(type: string): string {
    if (type === "yaml") {
      return yaml.stringify(this);
    } else {
      return JSON.stringify(this);
    }
  }
}
