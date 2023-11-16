/**
 * Validates if a given string is a valid underscore name.
 * @param name - The string to be validated.
 * @returns A boolean indicating if the string is a valid underscore name.
 */
export function validateUnderscoreName(name: string): boolean {
  const regex = /^[a-zA-Z0-9_]+$/;
  return regex.test(name);
}
