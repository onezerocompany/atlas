/**
 * Represents an option that can be passed to a command.
 * @template Type The type of the option's value.
 */
export class Option<Type> {
  public id: string;
  public flags: string[];
  public description: string;
  public defaultValue: Type;
  public validate: (value: Type) => boolean;

  constructor({
    id,
    flags,
    description,
    defaultValue,
    validate,
  }: {
    id: string;
    flags: string[];
    description: string;
    defaultValue: Type;
    validate: (value: Type) => boolean;
  }) {
    this.id = id;
    this.flags = flags;
    this.description = description;
    this.defaultValue = defaultValue;
    this.validate = validate;
  }
}
