export class ProjectType {
  public id: string;
  public name: string;

  public constructor({ id, name }: { id: string; name: string }) {
    this.id = id;
    this.name = name;
  }
}
