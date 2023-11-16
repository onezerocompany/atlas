import yaml from "yaml";

export enum EncodableType {
  json = "json",
  yaml = "yaml",
}

export abstract class Encodable {
  encode(type: EncodableType): string {
    switch (type) {
      case EncodableType.json:
        return JSON.stringify(this);
      case EncodableType.yaml:
        return yaml.stringify(this);
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  }

  static decode(type: EncodableType, encodedString: string): Encodable {
    switch (type) {
      case EncodableType.json:
        return JSON.parse(encodedString) as Encodable;
      case EncodableType.yaml:
        return yaml.parse(encodedString) as Encodable;
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  }
}
