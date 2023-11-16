import { PromptValidationResult } from "../PromptValidationResult";
import { Prompt } from "../Prompt";

export class FieldPrompt extends Prompt<string> {
  private minLength: number;
  private maxLength: number;

  constructor({
    name,
    message,
    required = true,
    minLength = 0,
    maxLength = Infinity,
  }: {
    name: string;
    message?: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
  }) {
    super({
      name,
      message,
      required,
    });
    this.minLength = minLength;
    this.maxLength = maxLength;
  }

  public validate(value: string): PromptValidationResult {
    const result = super.validate(value);
    if (result.valid) {
      if (this.minLength && value.length < this.minLength) {
        return {
          valid: false,
          message: `${this.name} must be at least ${this.minLength} characters long`,
        };
      }
      if (this.maxLength && value.length > this.maxLength) {
        return {
          valid: false,
          message: `${this.name} must be at most ${this.maxLength} characters long`,
        };
      }
    }
    return result;
  }
}
