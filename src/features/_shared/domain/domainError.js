export class DomainError {
  constructor(code, message, details = null) {
    if (typeof code !== "string" || code.trim().length === 0) {
      throw new Error("DomainError code must be a non-empty string");
    }

    if (typeof message !== "string" || message.trim().length === 0) {
      throw new Error("DomainError message must be a non-empty string");
    }

    this.code = code.trim();
    this.message = message.trim();
    this.details = details;

    Object.freeze(this);
  }
}
