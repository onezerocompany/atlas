import { PromptValidationResult } from "./PromptValidationResult";

/**
 * Represents a prompt that can be displayed to the user.
 * @template Type The type of value expected from the prompt.
 */
export abstract class Prompt<Type> {
  public name: string;
  public message?: string;
  public required: boolean;
  public default?: Type;
  public validator?: (value: Type) => PromptValidationResult;

  public constructor({
    name,
    message,
    required = true,
  }: {
    name: string;
    message?: string;
    required: boolean;
  }) {
    this.name = name;
    this.message = message;
    this.required = required;
  }

  public validate(value: Type): PromptValidationResult {
    const result: PromptValidationResult = {
      valid: true,
      message: "",
    };

    if (this.required && !value) {
      result.valid = false;
      result.message = `${this.name} is required`;
    }

    if (this.validator) {
      const validatorResult = this.validator(value);
      result.valid = result.valid && validatorResult.valid;
      result.message = validatorResult.message;
    }

    return result;
  }
}
