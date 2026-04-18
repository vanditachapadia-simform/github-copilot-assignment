/**
 * String Utility Module
 *
 * Provides reusable helper functions for common string operations.
 * This file follows the GENERAL Copilot instructions only
 * (.github/copilot-instructions.md) since it lives outside src/components/.
 *
 * Rules demonstrated:
 *   - camelCase for variables/functions, PascalCase for types, UPPER_SNAKE_CASE for constants
 *   - Single-responsibility, short, pure functions
 *   - JSDoc comments explaining "why" and documenting public API
 *   - Strict equality, early returns, explicit input validation
 *   - No use of `any`; all parameters and returns are typed
 */

// ── Constants ────────────────────────────────────────────────────────────────

/** Default separator used when no custom separator is provided. */
const DEFAULT_SEPARATOR = "-";

/** Maximum allowed input length to prevent excessive processing. */
const MAX_INPUT_LENGTH = 10_000;

// ── Types ────────────────────────────────────────────────────────────────────

/** Options for the slugify function. */
interface SlugifyOptions {
  separator?: string;
  lowercase?: boolean;
}

// ── Validation Helpers ───────────────────────────────────────────────────────

/**
 * Validates that the input is a non-empty string within acceptable bounds.
 *
 * Failing fast with a clear message prevents hard-to-debug downstream errors
 * (e.g., silent empty-string returns or regex hangs on huge inputs).
 *
 * @param value - The value to validate.
 * @param paramName - Name of the parameter, used in error messages.
 */
function validateStringInput(value: unknown, paramName: string): asserts value is string {
  if (typeof value !== "string") {
    throw new TypeError(`${paramName} must be a string, received ${typeof value}`);
  }

  if (value.length === 0) {
    throw new RangeError(`${paramName} must not be empty`);
  }

  if (value.length > MAX_INPUT_LENGTH) {
    throw new RangeError(
      `${paramName} exceeds maximum length of ${MAX_INPUT_LENGTH} characters`,
    );
  }
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Capitalizes the first letter of a string while lowercasing the rest.
 *
 * Useful for normalizing user-supplied names before display.
 *
 * @param text - The string to capitalize.
 * @returns The capitalized string.
 *
 * @example
 * capitalize("hello"); // "Hello"
 * capitalize("hELLO"); // "Hello"
 */
function capitalize(text: string): string {
  validateStringInput(text, "text");
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Converts a human-readable string into a URL-friendly slug.
 *
 * Non-alphanumeric characters are replaced with the chosen separator, and
 * consecutive separators are collapsed to keep slugs tidy.
 *
 * @param text - The source string.
 * @param options - Optional configuration for separator and casing.
 * @returns A URL-safe slug string.
 *
 * @example
 * slugify("Hello World!");           // "hello-world"
 * slugify("Hello World!", { separator: "_" }); // "hello_world"
 */
function slugify(text: string, options: SlugifyOptions = {}): string {
  validateStringInput(text, "text");

  const { separator = DEFAULT_SEPARATOR, lowercase = true } = options;

  let result = text.trim().replace(/[^a-zA-Z0-9]+/g, separator);

  // Remove leading/trailing separators that may result from edge whitespace
  result = result.replace(
    new RegExp(`^\\${separator}+|\\${separator}+$`, "g"),
    "",
  );

  return lowercase ? result.toLowerCase() : result;
}

/**
 * Truncates a string to the specified length, appending an ellipsis if truncated.
 *
 * Avoids cutting words in half by backtracking to the last space when possible,
 * which produces more readable preview text.
 *
 * @param text - The string to truncate.
 * @param maxLength - Maximum character count (must be > 0).
 * @returns The truncated string.
 *
 * @example
 * truncate("The quick brown fox", 9); // "The quick…"
 */
function truncate(text: string, maxLength: number): string {
  validateStringInput(text, "text");

  if (maxLength <= 0) {
    throw new RangeError("maxLength must be a positive number");
  }

  if (text.length <= maxLength) {
    return text;
  }

  // Backtrack to the last space so we don't slice mid-word
  const trimmed = text.slice(0, maxLength);
  const lastSpaceIndex = trimmed.lastIndexOf(" ");
  const breakpoint = lastSpaceIndex > 0 ? lastSpaceIndex : maxLength;

  return `${trimmed.slice(0, breakpoint)}…`;
}

export { capitalize, slugify, truncate };
export type { SlugifyOptions };
